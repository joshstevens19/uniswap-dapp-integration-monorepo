/// TODO MOVE TO NPM PACKAGE ONCE HAPPY

import BigNumber from 'bignumber.js';
import {
  ChainId,
  Token,
  TokenFactoryPublic,
  TokensFactoryPublic,
  TradeContext,
  Transaction,
  UniswapPair,
  UniswapPairFactory,
} from 'simple-uniswap-sdk';

export interface UniswapDappSharedLogicContext {
  // ethereumAddress: string;
  inputCurrency?: string | undefined;
  outputCurrency?: string | undefined;
  supportedContracts: SupportedToken[];
}

export interface ExtendedToken extends Token {
  balance: BigNumber;
}

export interface SupportedToken {
  iconUrl?: string;
  contractAddress: string;
}

export interface SupportedTokenResult {
  token: ExtendedToken;
}

export class UniswapDappSharedLogic {
  public inputToken!: ExtendedToken;
  public outputToken: ExtendedToken | undefined;
  public factory: UniswapPairFactory | undefined;
  public tradeContext: TradeContext | undefined;
  public slippage = 0.05;
  public supportedTokenBalances!: ExtendedToken[];

  private _inputAmount = new BigNumber(1);

  private _tokensFactoryPublic = new TokensFactoryPublic(ChainId.MAINNET);

  constructor(private _context: UniswapDappSharedLogicContext) {
    this.syncBalances();
  }

  /**
   * Init the shared logic
   */
  public async init(): Promise<void> {
    const inputToken =
      this._context?.inputCurrency ||
      '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';

    if (this._context.outputCurrency) {
      await this.buildFactory(inputToken, this._context.outputCurrency);
    } else {
      this.inputToken = await this.getTokenInformation(inputToken);
    }
  }

  /**
   * Toggle showing and hiding the settings
   */
  public toggleSettings(): void {
    const settingsElement = document.getElementsByClassName(
      'uni-ic__settings-container'
    )[0];
    if (settingsElement.classList.contains('uni-ic-hidden')) {
      settingsElement.classList.remove('uni-ic-hidden');
    } else {
      settingsElement.classList.add('uni-ic-hidden');
    }
  }

  /**
   * Open token selector from
   */
  public openTokenSelectorFrom(): void {
    this.showTokenSelector();
  }

  /**
   * Open token selector to
   */
  public openTokenSelectorTo(): void {
    this.showTokenSelector();
  }

  /**
   * Hide the token selector
   */
  public hideTokenSelector(): void {
    const modal = document.getElementById('uni-ic__model-token')!;
    modal.style.display = 'none';
  }

  /**
   * Change input token
   * @param contractAddress The contract address
   */
  public async changeInputToken(contractAddress: string): Promise<void> {
    await this.buildFactory(contractAddress, this.outputToken!.contractAddress);
  }

  /**
   * Change output token
   * @param contractAddress The contract address
   */
  public async changeOutputToken(contractAddress: string): Promise<void> {
    await this.buildFactory(this.inputToken.contractAddress, contractAddress);
  }

  /**
   * Change input trade price
   */
  public async changeInputTradePrice(amount: string): Promise<void> {
    this._inputAmount = new BigNumber(amount);
    if (!this.factory) {
      await this.buildFactory(
        this.inputToken.contractAddress,
        this.outputToken!.contractAddress
      );
    }
    await this.trade(this._inputAmount);
  }

  /**
   * Set max input
   */
  public async setMaxInput(): Promise<string> {
    const maxBalance = this.inputToken.balance.toFixed();
    await this.changeInputTradePrice(maxBalance);

    return maxBalance;
  }

  /**
   * Generate approve max allowance
   */
  public async generateApproveMaxAllowanceData(): Promise<Transaction> {
    return await this.factory!.generateApproveMaxAllowanceData();
  }

  /**
   * Get the token image url
   * @param contractAddress The contract address
   */
  public getTokenImageUrl(contractAddress: string): string {
    // TODO CHECK SUPPORTED TOKENS LIST IF OVERRIDES

    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${contractAddress}/logo.png`;
  }

  /**
   * Get token information
   * @param contractAddress The contract address
   */
  public async getTokenInformation(
    contractAddress: string
  ): Promise<ExtendedToken> {
    const tokenFactoryPublic = new TokenFactoryPublic(
      contractAddress,
      ChainId.MAINNET
    );

    const token = (await tokenFactoryPublic.getToken()) as ExtendedToken;
    // to do fix
    token.balance = new BigNumber(
      await tokenFactoryPublic.balanceOf(contractAddress)
    );

    return token;
  }

  /**
   * Deep clone a object
   * @param object The object
   */
  public deepClone<T>(object: T): T {
    return JSON.parse(JSON.stringify(object)) as T;
  }

  /**
   * Swap switch
   */
  public async swapSwitch(): Promise<void> {
    const clonedOutput = this.deepClone(this.outputToken!);
    const clonedInput = this.deepClone(this.inputToken);

    this._inputAmount = new BigNumber(this.tradeContext!.expectedConvertQuote!);

    await this.buildFactory(
      clonedOutput.contractAddress,
      clonedInput.contractAddress
    );
  }

  // MOVE INTO SDK
  /**
   * work out what 1 is equal to
   */
  public workOutOneEqualTo(): string {
    return new BigNumber(
      +this.tradeContext!.expectedConvertQuote /
        +this.tradeContext!.baseConvertRequest
    ).toFixed();
  }

  /**
   * Build factory
   */
  private async buildFactory(
    inputToken: string,
    outputToken: string
  ): Promise<void> {
    const uniswapPair = new UniswapPair({
      fromTokenContractAddress: inputToken,
      toTokenContractAddress: outputToken,
      // the ethereum address of the user using this part of the dApp
      ethereumAddress: '0x37c81284caA97131339415687d192BF7D18F0f2a',
      chainId: ChainId.MAINNET,
    });

    this.factory = await uniswapPair.createFactory();
    this.inputToken = this.buildExtendedToken(
      this.factory.fromToken,
      await this.factory.getFromTokenBalance()
    );
    this.outputToken = this.buildExtendedToken(
      this.factory.toToken,
      await this.factory.getToTokenBalance()
    );
    await this.trade(this._inputAmount);
  }

  /**
   * Build extended token
   * @param token The token
   * @param balance The balance
   */
  private buildExtendedToken(token: Token, balance: string): ExtendedToken {
    return {
      chainId: token.chainId,
      contractAddress: token.contractAddress,
      decimals: token.decimals,
      symbol: token.symbol,
      name: token.name,
      balance: new BigNumber(balance),
    };
  }

  /**
   * Show the token selector
   */
  private showTokenSelector(): void {
    const modal = document.getElementById('uni-ic__model-token')!;
    modal.style.display = 'block';
  }

  /**
   * Execute the trade quote
   * @param amount The amount
   */
  private async trade(amount: BigNumber): Promise<void> {
    if (amount.isGreaterThan(0)) {
      this.tradeContext = await this.factory!.trade(
        this._inputAmount.toFixed()
      );

      this.tradeContext?.quoteChanged$.subscribe((quote) => {
        this.tradeContext = quote;
      });

      console.log(this.tradeContext);
    } else {
      this.factory = undefined;
    }
  }

  /**
   * Keep the balances in balances
   */
  private async syncBalances(): Promise<void> {
    setInterval(async () => {
      const results = await this._tokensFactoryPublic.getAllowanceAndBalanceOfForContracts(
        '0x37c81284caA97131339415687d192BF7D18F0f2a',
        this._context.supportedContracts.map((c) => c.contractAddress),
        true
      );

      this.supportedTokenBalances = results.map((c) => {
        return this.buildExtendedToken(
          c.token,
          c.allowanceAndBalanceOf.balanceOf
        );
      });

      if (this.inputToken.symbol.toLowerCase() === 'weth') {
        this.inputToken.balance = new BigNumber(
          await this.factory!.getFromTokenBalance()
        );
      } else {
        const newInputBalance = this.supportedTokenBalances.find(
          (c) => c.contractAddress === this.inputToken.contractAddress
        )?.balance;
        if (newInputBalance) {
          this.inputToken.balance = new BigNumber(newInputBalance);
        }
      }

      if (this.outputToken) {
        if (this.outputToken.symbol.toLowerCase() === 'weth') {
          this.outputToken.balance = new BigNumber(
            await this.factory!.getToTokenBalance()
          );
        } else {
          const newOutputBalance = this.supportedTokenBalances.find(
            (c) => c.contractAddress === this.outputToken!.contractAddress
          )?.balance;

          if (newOutputBalance) {
            this.outputToken.balance = new BigNumber(newOutputBalance);
          }
        }
      }
    }, 5000);
  }
}
