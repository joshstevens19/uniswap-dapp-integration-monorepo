import BigNumber from 'bignumber.js';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import {
  ETH,
  getAddress,
  TokensFactoryPublic,
  TradeContext,
  TradeDirection,
  Transaction,
  UniswapPair,
  UniswapPairFactory,
  UniswapPairSettings,
  UniswapSubscription,
  UniswapVersion,
} from 'simple-uniswap-sdk';
import { ChainService } from './chain';
import { CoinGecko } from './coin-gecko';
import { EthereumProvider } from './ethereum-provider';
import {
  MiningAction,
  MiningTransaction,
  SelectTokenActionFrom,
  SwapSwitchResponse,
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
  public inputToken$: Subject<ExtendedToken> = new Subject();
  public outputToken: ExtendedToken | undefined;
  public outputToken$: Subject<ExtendedToken> = new Subject();
  public factory: UniswapPairFactory | undefined;
  public tradeContext: TradeContext | undefined;
  public tradeContext$: Subject<TradeContext | undefined> = new Subject();
  public newPriceTradeContext: TradeContext | undefined;
  public newPriceTradeContext$: Subject<TradeContext | undefined> =
    new Subject();
  public loading$ = new BehaviorSubject<boolean>(false);
  public supportedTokenBalances: SupportedTokenResult[] = [];
  public uniswapPairSettings: UniswapPairSettings = new UniswapPairSettings();
  public uniswapPairSettings$: Subject<UniswapPairSettings> = new Subject();
  public selectorOpenFrom: SelectTokenActionFrom | undefined;
  public selectorOpenFrom$: Subject<SelectTokenActionFrom | undefined> =
    new Subject();
  public chainId!: number;
  public chainId$: Subject<number> = new Subject();
  public supportedNetwork = false;
  public supportedNetwork$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public miningTransaction: MiningTransaction | undefined;
  public miningTransaction$: BehaviorSubject<MiningTransaction | undefined> =
    new BehaviorSubject<MiningTransaction | undefined>(undefined);
  public currentTokenSearch: string | undefined;
  public blockNumber: number | undefined;
  public tradeCompleted$ = new BehaviorSubject<boolean>(false);

  private _confirmSwapOpened = false;
  private _inputAmount = new BigNumber('0');
  private _tokensFactoryPublic!: TokensFactoryPublic;
  private _quoteSubscription: UniswapSubscription = UniswapSubscription.EMPTY;

  // services
  private _ethereumProvider: EthereumProvider = new EthereumProvider(
    this._context.ethereumAddress,
    this._context.ethereumProvider,
  );
  private _coinGecko = new CoinGecko();
  private _theming = new Theming(this._context.theming);
  private _tokenService = new TokenService(
    this._ethereumProvider,
    this._context.supportedNetworkTokens,
  );
  private _chainService = new ChainService(this._ethereumProvider);
  private _blockStream = Subscription.EMPTY;

  constructor(private _context: UniswapDappSharedLogicContext) {
    if (this._context.settings) {
      this.uniswapPairSettings = this._context.settings;
    }

    this.uniswapPairSettings$.next(this.uniswapPairSettings);
  }

  /**
   * Init the shared logic
   */
  public async init(): Promise<void> {
    this.loading$.next(true);
    this.supportedNetwork = false;
    this.supportedNetwork$.next(this.supportedNetwork);
    this._quoteSubscription.unsubscribe();
    this._blockStream.unsubscribe();

    await this.setupEthereumContext();
    if (!this.supportedNetwork) {
      this.loading$.next(false);
      return;
    }

    const eth = ETH.info(this.chainId);
    const supportedNetworkTokens = this._context.supportedNetworkTokens.find(
      (t) => t.chainId === this.chainId,
    )!;

    if (supportedNetworkTokens.defaultInputValue) {
      this._inputAmount = new BigNumber(
        supportedNetworkTokens.defaultInputValue,
      );
    }

    if (
      !supportedNetworkTokens.supportedTokens.find(
        (c) =>
          c.contractAddress.toLowerCase() === eth.contractAddress.toLowerCase(),
      )
    ) {
      supportedNetworkTokens.supportedTokens.push({
        contractAddress: eth.contractAddress,
      });
    }

    const inputToken =
      supportedNetworkTokens.defaultInputToken || eth.contractAddress;

    this.inputToken = await this._tokenService.getTokenInformation(
      inputToken,
      this._context.ethereumProvider,
    );
    this.inputToken$.next(this.inputToken);

    await this.getBalances();
    this._blockStream = this.subscribeToBlockStream();
    this._theming.apply();

    if (supportedNetworkTokens.defaultOutputToken) {
      await this.buildFactory(
        this.inputToken.contractAddress,
        supportedNetworkTokens.defaultOutputToken,
      );
    } else {
      this.inputToken = await this._tokenService.getTokenInformation(
        inputToken,
        this._context.ethereumProvider,
      );
      this.inputToken$.next(this.inputToken);
    }

    if (this._inputAmount && this.inputToken && this.outputToken) {
      this.buildFactory(
        this.inputToken.contractAddress,
        this.outputToken.contractAddress,
      );
    }

    // resync once got context so ordering of tokens
    // can sync
    this.getBalances();
    this.loading$.next(false);
  }

  /**
   * Destroy logic
   */
  public destroy(): void {
    this._quoteSubscription.unsubscribe();
    this._blockStream.unsubscribe();
    this._chainService.unwatch();
    this.tradeContext?.destroy();
  }

  /**
   * Change ethereum address for your dApp if your provider does not
   * emit the event `accountsChanged`
   * @param ethereumAddress The ethereum address
   */
  public async changeEthereumAddress(ethereumAddress: string): Promise<void> {
    this._quoteSubscription.unsubscribe();
    this._ethereumProvider.updateEthereumAddress(ethereumAddress);
    this.init();
  }

  /**
   * Change the chain for your dApp if your provider does not
   * emit the event `chainChanged`. Your ethereum provider you passed
   * to the lib if changed will work without passing a `newEthereumProvider`
   * if its a brand new instance you need to pass the lib the new ethereum provider
   * @param newEthereumProvider The new ethereum provider
   */
  public async changeChain(newEthereumProvider?: any): Promise<void> {
    if (newEthereumProvider) {
      this._context.ethereumProvider = newEthereumProvider;
    }

    this._ethereumProvider = new EthereumProvider(
      this._context.ethereumAddress,
      this._context.ethereumProvider,
    );
    this._chainService = new ChainService(this._ethereumProvider);
    this._tokenService = new TokenService(
      this._ethereumProvider,
      this._context.supportedNetworkTokens,
    );
    this._quoteSubscription.unsubscribe();
    this.init();
  }

  /**
   * Setup ethereum context
   */
  public async setupEthereumContext(): Promise<void> {
    this.chainId = (await this._ethereumProvider.provider.getNetwork()).chainId;
    this.chainId$.next(this.chainId);

    this.supportedNetwork = this._ethereumProvider.isSupportedChain(
      this.chainId,
      this._context.supportedNetworkTokens,
    );

    this.supportedNetwork$.next(this.supportedNetwork);

    if (this.supportedNetwork) {
      this._tokensFactoryPublic = new TokensFactoryPublic({
        chainId: this.chainId,
      });
    }

    // handle chain and account changes automatically
    // if they have event handlers on
    if (this._context.ethereumProvider.on) {
      this._context.ethereumProvider.on(
        'accountsChanged',
        async (accounts: string[]) => {
          await this.changeEthereumAddress(accounts[0]);
        },
      );

      this._context.ethereumProvider.on('chainChanged', async () => {
        await this.changeChain();
      });
    }
  }

  /**
   * Send the approve allowance
   */
  public async approveAllowance(): Promise<void> {
    this._theming.hideSettings();
    this.miningTransaction = {
      status: TransactionStatus.waitingForConfirmation,
      miningAction: MiningAction.approval,
    };
    this.miningTransaction$.next(this.miningTransaction);

    await this.handleTransaction(
      this.tradeContext!.approvalTransaction!,
      this.miningTransaction,
    );

    if (this.miningTransaction.status === TransactionStatus.completed) {
      this.miningTransaction = undefined;
      this.miningTransaction$.next(this.miningTransaction);
      this.tradeContext!.approvalTransaction = undefined;
      this.tradeContext!.hasEnoughAllowance = true;
    }
  }

  /**
   * Send the swap transaction
   */
  public async swapTransaction(): Promise<void> {
    this.miningTransaction = {
      status: TransactionStatus.waitingForConfirmation,
      miningAction: MiningAction.swap,
    };
    this.miningTransaction$.next(this.miningTransaction);

    this.showTransaction();

    await this.handleTransaction(
      this.tradeContext!.transaction,
      this.miningTransaction,
    );
  }

  /**
   * Toggle showing and hiding the settings
   */
  public toggleSettings(): void {
    if (!this.transactionInProcess()) {
      this._theming.toggleSettings();
    }
  }

  /**
   * Open token selector from
   */
  public openTokenSelectorFrom(): void {
    this._theming.showTokenSelector();
    this.selectorOpenFrom = SelectTokenActionFrom.input;
    this.selectorOpenFrom$.next(this.selectorOpenFrom);
  }

  /**
   * Open token selector to
   */
  public openTokenSelectorTo(): void {
    this._theming.showTokenSelector();
    this.selectorOpenFrom = SelectTokenActionFrom.output;
    this.selectorOpenFrom$.next(this.selectorOpenFrom);
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
   * Show transaction modal
   */
  public showTransaction(): void {
    this._theming.hideConfirmSwap();
    this._theming.showTransaction();
  }

  /**
   * Hide the transaction modal
   */
  public hideTransaction(): void {
    this._theming.hideTransaction();
    this.miningTransaction = undefined;
    this.miningTransaction$.next(this.miningTransaction);
    this.tradeContext?.destroy();
    this.tradeContext = undefined;
    this.tradeContext$.next(undefined);
    this._inputAmount = new BigNumber(0);
    // let the client know the swap all done to clear down the fields
    this.tradeCompleted$.next(true);
    this.tradeCompleted$.next(false);
    this.hideConfirmSwap();
  }

  /**
   * Change token selected
   * @param contractAddress The contract address
   */
  public async changeToken(contractAddress: string): Promise<void> {
    switch (this.selectorOpenFrom) {
      case SelectTokenActionFrom.input:
        await this.changeInputToken(contractAddress);
        return;
      case SelectTokenActionFrom.output:
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
  public async swapSwitch(): Promise<SwapSwitchResponse> {
    const clonedOutput = Utils.deepClone(this.outputToken!);
    const clonedInput = Utils.deepClone(this.inputToken);

    await this.buildFactory(
      clonedOutput.contractAddress,
      clonedInput.contractAddress,
      false,
    );

    if (this.tradeContext) {
      if (this.tradeContext.quoteDirection === TradeDirection.output) {
        const amount = Utils.deepClone(this.tradeContext.baseConvertRequest);
        await this.trade(new BigNumber(amount), TradeDirection.input);

        return {
          outputValue: this.tradeContext.expectedConvertQuote,
          inputValue: amount,
        };
      } else {
        const amount = Utils.deepClone(this.tradeContext.baseConvertRequest);

        await this.trade(new BigNumber(amount), TradeDirection.output);

        return {
          outputValue: amount,
          inputValue: this.tradeContext.expectedConvertQuote,
        };
      }
    } else {
      return {
        outputValue: '',
        inputValue: '',
      };
    }
  }

  /**
   * Accept the price change
   */
  public acceptPriceChange(): void {
    if (this.newPriceTradeContext) {
      this.tradeContext = this.newPriceTradeContext;
      this.tradeContext$.next(this.tradeContext);
    }
    this.newPriceTradeContext = undefined;
    this.newPriceTradeContext$.next(undefined);
  }

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
    if (disableMultihops === this.uniswapPairSettings.disableMultihops) {
      return;
    }

    this.uniswapPairSettings.disableMultihops = disableMultihops;
    this.uniswapPairSettings$.next(this.uniswapPairSettings);
    await this.buildFactory(
      this.inputToken.contractAddress,
      this.outputToken!.contractAddress,
      false,
    );

    await this.executeTradeAndHonourLastTradeDirection();
  }

  /**
   * Set transaction deadline
   * @param deadlineMinutes The deadline minutes the tx has to be mined before it fails
   */
  public async setTransactionDeadline(
    deadlineMinutes: string | number,
  ): Promise<void> {
    if (Number(deadlineMinutes) === this.uniswapPairSettings.deadlineMinutes) {
      return;
    }

    if (deadlineMinutes === '') {
      this.uniswapPairSettings.deadlineMinutes = 20;
    } else {
      this.uniswapPairSettings.deadlineMinutes = Number(deadlineMinutes);
    }

    this.uniswapPairSettings$.next(this.uniswapPairSettings);

    await this.buildFactory(
      this.inputToken.contractAddress,
      this.outputToken!.contractAddress,
      false,
    );

    await this.executeTradeAndHonourLastTradeDirection();
  }

  /**
   * Set transaction slippage
   * @param slippage The slippage the route can take
   */
  public async setSlippage(slippage: string | number): Promise<void> {
    if (Number(slippage) / 100 === this.uniswapPairSettings.slippage) {
      return;
    }

    if (slippage === '') {
      this.uniswapPairSettings.slippage = 0.005;
    } else {
      this.uniswapPairSettings.slippage = Number(slippage) / 100;
    }

    this.uniswapPairSettings$.next(this.uniswapPairSettings);

    await this.buildFactory(
      this.inputToken.contractAddress,
      this.outputToken!.contractAddress,
      false,
    );

    await this.executeTradeAndHonourLastTradeDirection();
  }

  /**
   * Search for tokens
   * @param search The search term
   */
  public searchToken(search: string): SupportedTokenResult[] {
    this.currentTokenSearch = search;

    this.supportedTokenBalances = this._tokenService.searchToken(
      search,
      this.supportedTokenBalances,
    );

    return this.supportedTokenBalances;
  }

  /**
   * See if the transaction is in process
   */
  public transactionInProcess(): boolean {
    return (
      this.miningTransaction?.status ===
        TransactionStatus.waitingForConfirmation ||
      this.miningTransaction?.status === TransactionStatus.mining
    );
  }

  /**
   * View the tx on etherscan
   */
  public viewOnEtherscan(): void {
    if (this.miningTransaction?.blockExplorerLink) {
      window.open(this.miningTransaction.blockExplorerLink, '_blank');
    }
  }

  /**
   * Execute the trade but honour the last trade direction
   */
  private async executeTradeAndHonourLastTradeDirection(): Promise<void> {
    if (this.tradeContext?.quoteDirection === TradeDirection.output) {
      await this.trade(
        new BigNumber(Utils.deepClone(this.tradeContext.baseConvertRequest)),
        TradeDirection.output,
      );
    } else {
      await this.trade(this._inputAmount, TradeDirection.input);
    }
  }

  /**
   * Handle transaction
   * @param transaction The transaction
   * @param miningTransaction The mining transaction
   */
  private async handleTransaction(
    transaction: Transaction,
    miningTransaction: MiningTransaction,
  ): Promise<void> {
    try {
      const txHash = await this._ethereumProvider.sendAsync(transaction);
      this._quoteSubscription.unsubscribe();
      miningTransaction.status = TransactionStatus.mining;
      miningTransaction.txHash = txHash;
      miningTransaction.blockExplorerLink =
        this._chainService.getBlockExplorerLinkForTransactionHash(
          this.chainId,
          txHash,
        );

      this.miningTransaction$.next(miningTransaction);

      let blockStream = Subscription.EMPTY;

      await new Promise<void>((resolve, reject) => {
        blockStream = this._chainService.newBlock$.subscribe(async () => {
          try {
            const receipt =
              await this._ethereumProvider.provider.getTransactionReceipt(
                txHash,
              );
            if (receipt) {
              resolve();
              this.miningTransaction!.status = TransactionStatus.completed;
              this.miningTransaction$.next(miningTransaction);
            }
          } catch (error) {
            blockStream.unsubscribe();
            reject(error);
          }
        });
      });

      blockStream.unsubscribe();
    } catch (error) {
      miningTransaction.status = TransactionStatus.rejected;
      this.miningTransaction$.next(miningTransaction);
    }
  }

  /**
   * Change input token
   * @param contractAddress The contract address
   */
  private async changeInputToken(contractAddress: string): Promise<void> {
    await this.changeTokenHandler(
      contractAddress,
      this.outputToken!.contractAddress,
    );
  }

  /**
   * Change output token
   * @param contractAddress The contract address
   */
  private async changeOutputToken(contractAddress: string): Promise<void> {
    await this.changeTokenHandler(
      this.inputToken.contractAddress,
      contractAddress,
    );
  }

  /**
   * Change token handler
   * @param inputToken The input token
   * @param outputToken The output token
   */
  private async changeTokenHandler(
    inputToken: string,
    outputToken: string,
  ): Promise<void> {
    this.hideTokenSelector();
    await this.buildFactory(inputToken, outputToken, false);
    await this.executeTradeAndHonourLastTradeDirection();
  }

  /**
   * Build factory
   */
  private async buildFactory(
    inputToken: string,
    outputToken: string,
    executeTrade = true,
  ): Promise<void> {
    this.tradeContext?.destroy();
    inputToken = getAddress(inputToken, true);
    outputToken = getAddress(outputToken, true);
    const uniswapPair = this.createUniswapPairContext(
      inputToken,
      outputToken,
      this.uniswapPairSettings,
    );

    this.factory = await uniswapPair.createFactory();
    const fiatPrices = await this._coinGecko.getCoinGeckoFiatPrices(
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
    this.inputToken$.next(this.inputToken);
    this.outputToken = await this._tokenService.buildExtendedToken(
      this.factory.toToken,
      await this.factory.getToTokenBalance(),
      fiatPrices,
    );
    this.outputToken$.next(this.outputToken);
    if (executeTrade) {
      await this.trade(this._inputAmount, TradeDirection.input);
    }
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
      ethereumProvider: this._ethereumProvider.provider,
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
      this.tradeContext$.next(this.tradeContext);

      this._quoteSubscription = this.tradeContext.quoteChanged$.subscribe(
        (quote) => {
          if (
            this.miningTransaction?.miningAction === MiningAction.swap &&
            (this.miningTransaction?.status === TransactionStatus.mining ||
              this.miningTransaction?.status === TransactionStatus.completed)
          ) {
            this._quoteSubscription.unsubscribe();
            return;
          }
          console.log('price change', quote);
          const formattedQuote = this.formatTradeContext(quote);
          if (this._confirmSwapOpened) {
            this.newPriceTradeContext = formattedQuote;
            this.newPriceTradeContext$.next(this.newPriceTradeContext);
          } else {
            this.tradeContext = formattedQuote;
            this.tradeContext$.next(this.tradeContext);
          }
        },
      );

      console.log('first quote', this.tradeContext);

      if (this.tradeContext.quoteDirection === TradeDirection.output) {
        this._inputAmount = new BigNumber(
          Utils.deepClone(this.tradeContext.expectedConvertQuote),
        );
      }
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
   * Subscribe to the block stream
   */
  private subscribeToBlockStream(): Subscription {
    return this._chainService.newBlock$.subscribe((block) => {
      this.blockNumber = block;
      this.getBalances();
    });
  }

  /**
   * Get the balances of the supported contracts
   */
  private async getBalances(): Promise<void> {
    if (this.supportedNetwork) {
      const tokenWithAllowanceInfo =
        await this._tokensFactoryPublic.getAllowanceAndBalanceOfForContracts(
          // dont care about allowance here so use v3 wont make a difference
          UniswapVersion.v3,
          this._ethereumProvider.address,
          this._context.supportedNetworkTokens
            .find((t) => t.chainId === this.chainId)!
            .supportedTokens.map((c) => getAddress(c.contractAddress, true)),
          true,
        );

      const fiatPrices = await this._coinGecko.getCoinGeckoFiatPrices(
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
              tokenImageContext: await this._tokenService.getTokenImage(
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

      const inputToken = this.supportedTokenBalances.find(
        (c) => c.contractAddress === this.inputToken.contractAddress,
      );
      if (inputToken) {
        const newInputBalance = inputToken.balance;
        const newInputFiatPrice = inputToken.fiatPrice;
        if (
          !this.inputToken.balance.isEqualTo(newInputBalance) ||
          (newInputFiatPrice &&
            this.inputToken.fiatPrice &&
            !this.inputToken.fiatPrice.isEqualTo(newInputFiatPrice))
        ) {
          this.inputToken.balance = newInputBalance;
          this.inputToken.fiatPrice = newInputFiatPrice;
          this.inputToken$.next(this.inputToken);
        }
      }

      if (this.outputToken) {
        const outputToken = this.supportedTokenBalances.find(
          (c) => c.contractAddress === this.outputToken!.contractAddress,
        );
        if (outputToken) {
          const newOutputBalance = outputToken.balance;
          const newOutputFiatPrice = outputToken.fiatPrice;
          if (
            !this.outputToken.balance.isEqualTo(newOutputBalance) ||
            (newOutputFiatPrice &&
              this.outputToken.fiatPrice &&
              !this.outputToken.fiatPrice.isEqualTo(newOutputFiatPrice))
          ) {
            this.outputToken.balance = newOutputBalance;
            this.outputToken.fiatPrice = newOutputFiatPrice;
            console.log('here output', newOutputBalance.toFixed());
            this.outputToken$.next(this.outputToken);
          }
        }
      }
    } else {
      this.supportedTokenBalances = [];
    }
  }
}
