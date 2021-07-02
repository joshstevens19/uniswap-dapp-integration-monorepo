import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { BehaviorSubject, Subject } from 'rxjs';
import {
  TokensFactoryPublic,
  TradeContext,
  TradeDirection,
  UniswapPair,
  UniswapPairFactory,
  UniswapPairSettings,
  UniswapSubscription,
  UniswapVersion,
  WETH,
} from 'simple-uniswap-sdk';
import { getCoinGeckoFiatPrices } from './coin-gecko';
import { EthereumProvider } from './ethereum-provider';
import {
  MiningAction,
  MiningTransaction,
  SelectTokenActionFrom,
  TransactionStatus,
  UniswapDappSharedLogicContext,
} from './models';
import { Theming } from './theming';
import { TokenService } from './token';
import { ExtendedToken } from './token/models/extended-token';
import { SupportedTokenResult } from './token/models/supported-token-result';
import { Utils } from './utils';

export class UniswapDappSharedLogic {
  public inputToken!: ExtendedToken;
  public outputToken: ExtendedToken | undefined;
  public factory: UniswapPairFactory | undefined;
  public tradeContext: TradeContext | undefined;
  public newPriceTradeContext: TradeContext | undefined;
  // this is used to alert the UI to change the framework
  // binded values
  public newPriceTradeContextAvailable = new Subject<TradeContext>();
  public loading = new BehaviorSubject<boolean>(false);
  public supportedTokenBalances!: SupportedTokenResult[];
  public userAcceptedPriceChange = true;
  public uniswapPairSettings: UniswapPairSettings = new UniswapPairSettings();
  public selectorOpenFrom: SelectTokenActionFrom | undefined;
  public chainId!: number;
  public supportedNetwork = false;
  public miningTransaction: MiningTransaction | undefined;
  public currentTokenSearch: string | undefined;

  private _confirmSwapOpened = false;
  private _inputAmount = new BigNumber('0');
  private _tokensFactoryPublic!: TokensFactoryPublic;
  private _balanceInterval: NodeJS.Timeout | undefined;
  private _quoteSubscription: UniswapSubscription = UniswapSubscription.EMPTY;

  // services
  private _ethereumProvider: EthereumProvider = new EthereumProvider(
    this._context.ethereumAddress,
    this._context.ethereumProvider,
  );
  private _theming = new Theming(this._context.theming);
  private _tokenService = new TokenService();

  constructor(private _context: UniswapDappSharedLogicContext) {
    if (this._context.defaultInputValue) {
      this._inputAmount = new BigNumber(this._context.defaultInputValue);
    }
    if (this._context.settings) {
      this.uniswapPairSettings = this._context.settings;
    }
  }

  /**
   * Init the shared logic
   */
  public async init(): Promise<void> {
    this.loading.next(true);
    this.supportedNetwork = false;

    await this.setupEthereumContext();

    const weth = WETH.token(this.chainId);
    const supportedNetworkTokens = this._context.supportedNetworkTokens.find(
      (t) => t.chainId === this.chainId,
    )!;

    supportedNetworkTokens.supportedTokens.push(weth);

    const inputToken =
      supportedNetworkTokens.defaultInputToken || weth.contractAddress;

    this.inputToken = await this._tokenService.getTokenInformation(
      inputToken,
      this.chainId,
    );

    this.getBalances();
    this.syncBalancesInternal();
    this._theming.apply();

    if (supportedNetworkTokens.defaultOutputToken) {
      await this.buildFactory(
        this.inputToken.contractAddress,
        supportedNetworkTokens.defaultOutputToken,
      );
    } else {
      this.inputToken = await this._tokenService.getTokenInformation(
        inputToken,
        this.chainId,
      );
    }

    // resync once got context so ordering of tokens
    // can sync
    this.getBalances();
    this.loading.next(false);
  }

  /**
   * Setup ethereum context
   */
  public async setupEthereumContext(): Promise<void> {
    this.chainId = (await this._ethereumProvider.provider.getNetwork()).chainId;
    this.supportedNetwork = this._ethereumProvider.isSupportedChain(
      this.chainId,
      this._context.supportedNetworkTokens,
    );

    if (!this.supportedNetwork) {
      this.loading.next(false);
      throw new Error('unsupported network');
    }

    this._tokensFactoryPublic = new TokensFactoryPublic({
      chainId: this.chainId,
    });

    // (window as any).ethereum.on('accountsChanged', (_accounts: string[]) => {
    //   try {
    //     this._quoteSubscription.unsubscribe();
    //     this.init();
    //   } catch (error) {}
    // });

    // (window as any).ethereum.on('chainChanged', () => {
    //   try {
    //     this._quoteSubscription.unsubscribe();
    //     this.init();
    //   } catch (error) {}
    // });
  }

  /**
   * Send the approve allowance
   */
  public async approveAllowance(): Promise<MiningTransaction> {
    this.miningTransaction = {
      status: TransactionStatus.waitingForConfirmation,
      miningAction: MiningAction.approval,
    };

    try {
      const txHash = await this._ethereumProvider.sendAsync(
        this.tradeContext!.approvalTransaction!,
      );
      this.miningTransaction.status = TransactionStatus.mining;
      this.miningTransaction.txHash = txHash;
      this.miningTransaction.blockExplorerLink = '';
      return this.miningTransaction;
    } catch (error) {
      this.miningTransaction.status = TransactionStatus.rejected;
      return this.miningTransaction;
    }
  }

  /**
   * Send the swap transaction
   */
  public async swapTransaction(): Promise<MiningTransaction> {
    this.miningTransaction = {
      status: TransactionStatus.waitingForConfirmation,
      miningAction: MiningAction.swap,
    };

    try {
      const txHash = await this._ethereumProvider.sendAsync(
        this.tradeContext!.transaction,
      );
      this.miningTransaction.status = TransactionStatus.mining;
      this.miningTransaction.txHash = txHash;
      this.miningTransaction.blockExplorerLink = '';
      return this.miningTransaction;
    } catch (error) {
      this.miningTransaction.status = TransactionStatus.rejected;
      return this.miningTransaction;
    }
  }

  /**
   * Toggle showing and hiding the settings
   */
  public toggleSettings(): void {
    this._theming.toggleSettings();
  }

  /**
   * Open token selector from
   */
  public openTokenSelectorFrom(): void {
    this.selectorOpenFrom = SelectTokenActionFrom.input;
    this._theming.showTokenSelector();
  }

  /**
   * Open token selector to
   */
  public openTokenSelectorTo(): void {
    this.selectorOpenFrom = SelectTokenActionFrom.output;
    this._theming.showTokenSelector();
  }

  /**
   * Hide the token selector
   */
  public hideTokenSelector(): void {
    this.selectorOpenFrom = undefined;
    this.currentTokenSearch = undefined;
    this._theming.hideTokenSelector();
  }

  /**
   * Show the confirm swap modal
   */
  public showConfirmSwap(): void {
    this._theming.showConfirmSwap();
    this._confirmSwapOpened = true;
  }

  /**
   * Hide the confirm swap modal
   */
  public hideConfirmSwap(): void {
    this._theming.hideConfirmSwap();
    this._confirmSwapOpened = false;
    this.acceptPriceChange();
  }

  /**
   * Change token selected
   * @param contractAddress The contract address
   */
  public async changeToken(contractAddress: string): Promise<void> {
    switch (this.selectorOpenFrom) {
      case SelectTokenActionFrom.input:
        // if (
        //   this.tradeContext?.toToken.contractAddress ===
        //   contractAddress
        // ) {
        //   return await this.switchSwap();
        // }
        await this.changeInputToken(contractAddress);
        return;
      case SelectTokenActionFrom.output:
        // if (
        //   this.uniswapDappSharedLogic.tradeContext?.fromToken
        //     .contractAddress === contractAddress
        // ) {
        //   return await this.switchSwap();
        // }
        await this.changeOutputToken(contractAddress);
    }
  }

  /**
   * Change trade price
   */
  public async changeTradePrice(
    amount: string,
    directon: TradeDirection,
  ): Promise<void> {
    if (directon === TradeDirection.input) {
      this._inputAmount = new BigNumber(amount);
    }
    if (!this.factory) {
      await this.buildFactory(
        this.inputToken.contractAddress,
        this.outputToken!.contractAddress,
      );
    }
    await this.trade(new BigNumber(amount), directon);
  }

  /**
   * Set max input
   */
  public async setMaxInput(): Promise<string> {
    const maxBalance = this.inputToken.balance.toFixed();
    await this.changeTradePrice(maxBalance, TradeDirection.input);

    return maxBalance;
  }

  /**
   * Swap switch
   */
  public async swapSwitch(): Promise<void> {
    const clonedOutput = Utils.deepClone(this.outputToken!);
    const clonedInput = Utils.deepClone(this.inputToken);

    this._inputAmount = new BigNumber(this.tradeContext!.expectedConvertQuote!);

    await this.buildFactory(
      clonedOutput.contractAddress,
      clonedInput.contractAddress,
    );
  }

  /**
   * Accept the price change
   */
  public acceptPriceChange(): void {
    if (this.newPriceTradeContext) {
      this.tradeContext = this.newPriceTradeContext;
    }
    this.newPriceTradeContext = undefined;
    this.userAcceptedPriceChange = true;
  }

  // MOVE INTO SDK
  /**
   * work out what 1 is equal to
   */
  public workOutOneEqualTo(): string {
    return Utils.toPrecision(
      new BigNumber(
        +this.tradeContext!.expectedConvertQuote /
          +this.tradeContext!.baseConvertRequest,
      ),
    );
  }

  /**
   * Set multihops
   * @param disableMultihops The status of disable multihops
   */
  public async setDisableMultihops(disableMultihops: boolean): Promise<void> {
    this.uniswapPairSettings.disableMultihops = disableMultihops;
    await this.buildFactory(
      this.inputToken.contractAddress,
      this.outputToken!.contractAddress,
      this.uniswapPairSettings,
    );
  }

  /**
   * Set transaction deadline
   * @param deadlineMinutes The deadline minutes the tx has to be mined before it fails
   */
  public async setTransactionDeadline(
    deadlineMinutes: string | number,
  ): Promise<void> {
    if (deadlineMinutes === '') {
      this.uniswapPairSettings.deadlineMinutes = 20;
    } else {
      this.uniswapPairSettings.deadlineMinutes = Number(deadlineMinutes);
    }
    await this.buildFactory(
      this.inputToken.contractAddress,
      this.outputToken!.contractAddress,
      this.uniswapPairSettings,
    );
  }

  /**
   * Set transaction slippage
   * @param slippage The slippage the route can take
   */
  public async setSlippage(slippage: string | number): Promise<void> {
    if (slippage === '') {
      this.uniswapPairSettings.slippage = 0.005;
    } else {
      this.uniswapPairSettings.slippage = Number(slippage) / 100;
    }
    await this.buildFactory(
      this.inputToken.contractAddress,
      this.outputToken!.contractAddress,
      this.uniswapPairSettings,
    );
  }

  /**
   * Search for tokens
   * @param search The search term
   */
  public searchToken(search: string): void {
    this.currentTokenSearch = search;

    this.supportedTokenBalances = this._tokenService.searchToken(
      search,
      this.supportedTokenBalances,
    );
  }

  /**
   * Change input token
   * @param contractAddress The contract address
   */
  private async changeInputToken(contractAddress: string): Promise<void> {
    this.hideTokenSelector();
    contractAddress = ethers.utils.getAddress(contractAddress);

    await this.buildFactory(contractAddress, this.outputToken!.contractAddress);
  }

  /**
   * Change output token
   * @param contractAddress The contract address
   */
  private async changeOutputToken(contractAddress: string): Promise<void> {
    this.hideTokenSelector();
    contractAddress = ethers.utils.getAddress(contractAddress);
    await this.buildFactory(this.inputToken.contractAddress, contractAddress);
  }

  /**
   * Build factory
   */
  private async buildFactory(
    inputToken: string,
    outputToken: string,
    settings?: UniswapPairSettings | undefined,
  ): Promise<void> {
    inputToken = ethers.utils.getAddress(inputToken);
    outputToken = ethers.utils.getAddress(outputToken);
    const uniswapPair = this.createUniswapPairContext(
      inputToken,
      outputToken,
      settings,
    );

    this.factory = await uniswapPair.createFactory();
    const fiatPrices = await getCoinGeckoFiatPrices(
      [
        this.factory.fromToken.contractAddress,
        this.factory.toToken.contractAddress,
      ],
      this.chainId,
    );

    this.inputToken = await this._tokenService.buildExtendedToken(
      this.factory.fromToken,
      await this.factory.getFromTokenBalance(),
      fiatPrices,
    );
    this.outputToken = await this._tokenService.buildExtendedToken(
      this.factory.toToken,
      await this.factory.getToTokenBalance(),
      fiatPrices,
    );
    await this.trade(this._inputAmount, TradeDirection.input);
  }

  /**
   * Create uniswap pair context
   * @param inputToken The input token
   * @param outputToken The output token
   * @param settings The settings
   */
  private createUniswapPairContext(
    inputToken: string,
    outputToken: string,
    settings?: UniswapPairSettings | undefined,
  ): UniswapPair {
    if (this._context.ethereumProvider) {
      return new UniswapPair({
        fromTokenContractAddress: inputToken,
        toTokenContractAddress: outputToken,
        ethereumAddress: this._ethereumProvider.address,
        ethereumProvider: this._context.ethereumProvider,
        settings,
      });
    }

    return new UniswapPair({
      fromTokenContractAddress: inputToken,
      toTokenContractAddress: outputToken,
      ethereumAddress: this._ethereumProvider.address,
      chainId: this.chainId,
      providerUrl: this._context.supportedNetworkTokens.find(
        (c) => c.chainId === this.chainId,
      )?.providerUrl,
      settings,
    });
  }

  /**
   * Execute the trade quote
   * @param amount The amount
   */
  private async trade(
    amount: BigNumber,
    direction: TradeDirection,
  ): Promise<void> {
    if (amount.isGreaterThan(0)) {
      const context = await this.factory!.trade(amount.toFixed(), direction);
      this.tradeContext = this.formatTradeContext(context);

      this._quoteSubscription = this.tradeContext?.quoteChanged$.subscribe(
        (quote) => {
          // TEMP FIX UNTIL SORT THE SUBSCRIPTION LOGIC
          if (
            quote.toToken.contractAddress === this.inputToken.contractAddress &&
            quote.fromToken.contractAddress ===
              this.outputToken?.contractAddress &&
            quote.transaction.from === this._ethereumProvider.address
          ) {
            console.log('price change', quote);
            const formattedQuote = this.formatTradeContext(quote);
            if (this._confirmSwapOpened) {
              this.newPriceTradeContext = formattedQuote;
            } else {
              this.tradeContext = formattedQuote;
              this.newPriceTradeContextAvailable.next(formattedQuote);
            }
          }
        },
      );

      console.log('first quote', this.tradeContext);
    }
  }

  /**
   * Format trade context values
   * @param context The context
   */
  private formatTradeContext(context: TradeContext): TradeContext {
    context.liquidityProviderFee = Utils.toPrecision(
      context.liquidityProviderFee,
    );
    if (context.minAmountConvertQuote) {
      context.minAmountConvertQuote = Utils.toPrecision(
        context.minAmountConvertQuote,
      );
    }
    if (context.maximumSent) {
      context.maximumSent = Utils.toPrecision(context.maximumSent);
    }
    context.expectedConvertQuote = Utils.toPrecision(
      context.expectedConvertQuote,
    );

    return context;
  }

  /**
   * Sync balances interval
   */
  private async syncBalancesInternal(): Promise<void> {
    if (!this._balanceInterval) {
      this._balanceInterval = setInterval(() => this.getBalances(), 5000);
    }
  }

  /**
   * Get the balances of the supported contracts
   */
  private async getBalances(): Promise<void> {
    if (this.supportedNetwork) {
      const tokenWithAllowanceInfo =
        await this._tokensFactoryPublic.getAllowanceAndBalanceOfForContracts(
          UniswapVersion.v3,
          this._ethereumProvider.address,
          this._context.supportedNetworkTokens
            .find((t) => t.chainId === this.chainId)!
            .supportedTokens.map((c) =>
              ethers.utils.getAddress(c.contractAddress),
            ),
          true,
        );

      // look at caching this we still want to fetch the balances every 5 seconds but
      // fiat prices can be cached
      const fiatPrices = await getCoinGeckoFiatPrices(
        tokenWithAllowanceInfo.map((c) => c.token.contractAddress),
        this.chainId,
      );

      this.supportedTokenBalances = (
        await Promise.all(
          tokenWithAllowanceInfo.map(async (item) => {
            const token = await this._tokenService.buildExtendedToken(
              item.token,
              item.allowanceAndBalanceOf.balanceOf,
              fiatPrices,
            );

            let canShow = true;
            if (this.currentTokenSearch) {
              canShow = this.supportedTokenBalances.find(
                (c) =>
                  c.contractAddress.toLowerCase() ===
                  item.token.contractAddress.toLowerCase(),
              )!.canShow;
            }

            return {
              chainId: token.chainId,
              contractAddress: token.contractAddress,
              decimals: token.decimals,
              symbol: token.symbol,
              name: token.name,
              fiatPrice: token.fiatPrice,
              balance: token.balance,
              canShow,
              image: await this._tokenService.getTokenImageUrl(
                token.contractAddress,
                token.chainId,
              ),
            };
          }),
        )
      )
        .sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        })
        .sort((a, b) => {
          if (a.balance.isLessThan(b.balance)) {
            return 1;
          }
          if (a.balance.isGreaterThan(b.balance)) {
            return -1;
          }
          return 0;
        })
        .sort((a, b) => {
          if (a.contractAddress === this.inputToken.contractAddress) {
            return -1;
          }

          if (a.contractAddress === this.outputToken?.contractAddress) {
            return -1;
          }

          return 0;
        });

      if (this.inputToken.symbol.toLowerCase() === 'weth' && this.factory) {
        this.inputToken.balance = new BigNumber(
          await this.factory.getFromTokenBalance(),
        );
      } else {
        const newInputBalance = this.supportedTokenBalances.find(
          (c) => c.contractAddress === this.inputToken.contractAddress,
        )?.balance;
        if (newInputBalance) {
          this.inputToken.balance = new BigNumber(newInputBalance);
        }
      }

      if (this.outputToken) {
        if (this.outputToken.symbol.toLowerCase() === 'weth' && this.factory) {
          this.outputToken.balance = new BigNumber(
            await this.factory.getToTokenBalance(),
          );
        } else {
          const newOutputBalance = this.supportedTokenBalances.find(
            (c) => c.contractAddress === this.outputToken!.contractAddress,
          )?.balance;

          if (newOutputBalance) {
            this.outputToken.balance = new BigNumber(newOutputBalance);
          }
        }
      }
    } else {
      this.supportedTokenBalances = [];
    }
  }
}
