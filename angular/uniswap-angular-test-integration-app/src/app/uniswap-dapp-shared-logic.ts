/// TODO MOVE TO NPM PACKAGE ONCE HAPPY

import BigNumber from 'bignumber.js';
import {
  ChainId,
  Token,
  TokenFactoryPublic,
  TradeContext,
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
  balance?: BigNumber | undefined;
}

export interface SupportedToken {
  iconUrl?: string;
  contractAddress: string;
}

export class UniswapDappSharedLogic {
  public inputToken!: ExtendedToken;
  public outputToken: ExtendedToken | undefined;
  public factory: UniswapPairFactory | undefined;
  public tradeContext: TradeContext | undefined;
  public slippage = 0.05;

  private _inputAmount = new BigNumber(1);

  constructor(private _context: UniswapDappSharedLogicContext) {}

  /**
   * Init the shared logic
   */
  public async init(): Promise<void> {
    this.inputToken = await this.getTokenInformation(
      this._context?.inputCurrency ||
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
    );

    if (this._context.outputCurrency) {
      this.outputToken = await this.getTokenInformation(
        this._context.outputCurrency
      );

      await this.buildFactory();
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
    const modal = document.getElementById('uni-ic__model')!;
    modal.style.display = 'none';
  }

  /**
   * Change input token
   * @param contractAddress The contract address
   */
  public async changeInputToken(contractAddress: string): Promise<void> {
    this.inputToken = await this.getTokenInformation(contractAddress);
    await this.buildFactory();
  }

  /**
   * Change output token
   * @param contractAddress The contract address
   */
  public async changeOutputToken(contractAddress: string): Promise<void> {
    this.outputToken = await this.getTokenInformation(contractAddress);
    await this.buildFactory();
  }

  /**
   * Change input trade price
   */
  public async changeInputTradePrice(amount: string): Promise<void> {
    this._inputAmount = new BigNumber(amount);
    if (!this.factory) {
      await this.buildFactory();
    }
    await this.trade(this._inputAmount);
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
   * Get the balance of the token
   * @param contractAddress The contract address
   */
  public getBalance(contractAddress: string): BigNumber {
    console.log(contractAddress);
    return new BigNumber('10');
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
    token.balance = this.getBalance(contractAddress);
    if (token.symbol.toLowerCase() === 'weth') {
      token.symbol = 'ETH';
    }

    return token;
  }

  /**
   * Build factory
   */
  private async buildFactory(): Promise<void> {
    const uniswapPair = new UniswapPair({
      fromTokenContractAddress: this.inputToken.contractAddress,
      toTokenContractAddress: this.outputToken!.contractAddress,
      // the ethereum address of the user using this part of the dApp
      ethereumAddress: '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9',
      chainId: ChainId.MAINNET,
    });

    this.factory = await uniswapPair.createFactory();
    await this.trade(this._inputAmount);
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

      console.log(this.tradeContext);

      this.tradeContext?.quoteChanged$.subscribe((quote) => {
        this.tradeContext = quote;
      });
    } else {
      this.factory = undefined;
    }
  }
}
