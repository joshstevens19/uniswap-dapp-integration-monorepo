/// TODO MOVE TO NPM PACKAGE ONCE HAPPY

import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { Subject } from 'rxjs';
import {
  ChainId,
  Token,
  TokenFactoryPublic,
  TokensFactoryPublic,
  TradeContext,
  TradeDirection,
  UniswapPair,
  UniswapPairFactory,
  UniswapPairSettings,
  UniswapVersion,
  WETH,
} from 'simple-uniswap-sdk';

export interface UniswapDappSharedLogicContext {
  // ethereumAddress: string;
  inputCurrency?: string | undefined;
  outputCurrency?: string | undefined;
  supportedContracts: SupportedToken[];
  settings?: UniswapPairSettings | undefined;
  theming?: UniswapTheming;
}

interface TextAndColor {
  textColor?: string | undefined;
  backgroundColor?: string | undefined;
}

export interface UniswapTheming {
  backgroundColor?: string | undefined;
  textColor?: string | undefined;
  button?: TextAndColor;
  panel?: TextAndColor;
}

export interface ExtendedToken extends Token {
  balance: BigNumber;
  fiatPrice: BigNumber | undefined;
}

export interface SupportedToken {
  iconUrl?: string;
  contractAddress: string;
}

export interface SupportedTokenResult {
  token: ExtendedToken;
}

export enum SelectTokenActionFrom {
  input = 'input',
  output = 'output',
}

export class UniswapDappSharedLogic {
  public inputToken!: ExtendedToken;
  public outputToken: ExtendedToken | undefined;
  public factory: UniswapPairFactory | undefined;
  public tradeContext: TradeContext | undefined;
  public newPriceTradeContext: TradeContext | undefined;
  // this is used to alert the UI to change the framework
  // binded values
  public newPriceTradeContextAvailable = new Subject<TradeContext>();
  public supportedTokenBalances!: ExtendedToken[];
  public userAcceptedPriceChange = true;
  public uniswapPairSettings: UniswapPairSettings = new UniswapPairSettings();
  public selectorOpenFrom: SelectTokenActionFrom | undefined;

  private _confirmSwapOpened = false;

  private _inputAmount = new BigNumber(0.00004);

  private _tokensFactoryPublic = new TokensFactoryPublic(ChainId.MAINNET);

  constructor(private _context: UniswapDappSharedLogicContext) {
    this._context.supportedContracts.push(WETH.MAINNET());
    if (this._context.settings) {
      this.uniswapPairSettings = this._context.settings;
    }
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

    this.getBalances();
    this.syncBalancesInternal();
    this.themeComponent();
  }

  /**
   * Toggle showing and hiding the settings
   */
  public toggleSettings(): void {
    const settingsElement = document.getElementsByClassName(
      'uni-ic__settings-container',
    )[0];
    if (settingsElement.classList.contains('uni-ic-hidden')) {
      settingsElement.classList.remove('uni-ic-hidden');
    } else {
      settingsElement.classList.add('uni-ic-hidden');
      this.themeComponent();
    }
  }

  /**
   * Open token selector from
   */
  public openTokenSelectorFrom(): void {
    this.selectorOpenFrom = SelectTokenActionFrom.input;
    this.showTokenSelector();
  }

  /**
   * Open token selector to
   */
  public openTokenSelectorTo(): void {
    this.selectorOpenFrom = SelectTokenActionFrom.output;
    this.showTokenSelector();
  }

  /**
   * Hide the token selector
   */
  public hideTokenSelector(): void {
    this.selectorOpenFrom = undefined;
    const modal = document.getElementById('uni-ic__modal-token')!;
    modal.style.display = 'none';
  }

  /**
   * Show the confirm swap modal
   */
  public showConfirmSwap(): void {
    const modal = document.getElementById('uni-ic__modal-confirm-swap')!;
    modal.style.display = 'block';
    this._confirmSwapOpened = true;
  }

  /**
   * Hide the confirm swap modal
   */
  public hideConfirmSwap(): void {
    const modal = document.getElementById('uni-ic__modal-confirm-swap')!;
    modal.style.display = 'none';
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
   * Get the token image url
   * @param contractAddress The contract address
   */
  public getTokenImageUrl(contractAddress: string): string {
    contractAddress = ethers.utils.getAddress(contractAddress);
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${contractAddress}/logo.png`;
  }

  /**
   * Get token information
   * @param contractAddress The contract address
   */
  public async getTokenInformation(
    contractAddress: string,
  ): Promise<ExtendedToken> {
    contractAddress = ethers.utils.getAddress(contractAddress);
    const tokenFactoryPublic = new TokenFactoryPublic(
      contractAddress,
      ChainId.MAINNET,
    );

    const token = (await tokenFactoryPublic.getToken()) as ExtendedToken;
    // to do fix
    token.balance = new BigNumber(
      await tokenFactoryPublic.balanceOf(contractAddress),
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
    return this.toPrecision(
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
   * To precision
   * @param value The value
   * @param significantDigits The significant digits
   */
  public toPrecision(
    value: string | number | BigNumber,
    significantDigits: number = 4,
    significantDigitsForDecimalOnly: boolean = true,
  ): string {
    const parsedValue = new BigNumber(value);
    if (significantDigitsForDecimalOnly) {
      const beforeDecimalsCount = parsedValue.toString().split('.')[0].length;
      return parsedValue
        .precision(
          beforeDecimalsCount + significantDigits,
          BigNumber.ROUND_DOWN,
        )
        .toFixed();
    } else {
      return parsedValue
        .precision(significantDigits, BigNumber.ROUND_DOWN)
        .toFixed();
    }
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
    const uniswapPair = new UniswapPair({
      fromTokenContractAddress: inputToken,
      toTokenContractAddress: outputToken,
      // the ethereum address of the user using this part of the dApp
      ethereumAddress: '0x37c81284caA97131339415687d192BF7D18F0f2a',
      chainId: ChainId.MAINNET,
      settings,
    });

    this.factory = await uniswapPair.createFactory();
    const fiatPrices = await this.getCoinGeckoFiatPrices([
      this.factory.fromToken.contractAddress,
      this.factory.toToken.contractAddress,
    ]);

    this.inputToken = this.buildExtendedToken(
      this.factory.fromToken,
      await this.factory.getFromTokenBalance(),
      fiatPrices,
    );
    this.outputToken = this.buildExtendedToken(
      this.factory.toToken,
      await this.factory.getToTokenBalance(),
      fiatPrices,
    );
    await this.trade(this._inputAmount, TradeDirection.input);
  }

  /**
   * Build extended token
   * @param token The token
   * @param balance The balance
   */
  private buildExtendedToken(
    token: Token,
    balance: string,
    // tslint:disable-next-line: ban-types
    fiatPriceResults: Object,
  ): ExtendedToken {
    // const results = await (
    //   await fetch(
    //     `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${token.contractAddress}&vs_currencies=usd`,
    //   )
    // ).json();

    let fiatPrice: number | undefined;

    for (const [key, value] of Object.entries(fiatPriceResults)) {
      if (key.toLowerCase() === token.contractAddress.toLowerCase()) {
        // @ts-ignore
        // tslint:disable-next-line: no-string-literal
        fiatPrice = Number(value['usd']);
        break;
      }
    }

    return {
      chainId: token.chainId,
      contractAddress: token.contractAddress,
      decimals: token.decimals,
      symbol: token.symbol,
      name: token.name,
      fiatPrice: fiatPrice !== undefined ? new BigNumber(fiatPrice) : undefined,
      balance: new BigNumber(balance),
    };
  }

  /**
   * Get coin gecko fiat prices
   * @param contractAddresses The contract addresses
   */
  private async getCoinGeckoFiatPrices(
    contractAddresses: string[],
  ): Promise<any> {
    return await (
      await fetch(
        `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${contractAddresses.join()}&vs_currencies=usd`,
      )
    ).json();
  }

  /**
   * Show the token selector
   */
  private showTokenSelector(): void {
    const modal = document.getElementById('uni-ic__modal-token')!;
    modal.style.display = 'block';
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

      this.tradeContext?.quoteChanged$.subscribe((quote) => {
        console.log('price change', quote);
        const formattedQuote = this.formatTradeContext(quote);
        if (this._confirmSwapOpened) {
          this.newPriceTradeContext = formattedQuote;
        } else {
          this.tradeContext = formattedQuote;
          this.newPriceTradeContextAvailable.next(formattedQuote);
        }
      });

      console.log('first quote', this.tradeContext);
    } else {
      this.factory = undefined;
    }
  }

  /**
   * Format trade context values
   * @param context The context
   */
  private formatTradeContext(context: TradeContext): TradeContext {
    context.liquidityProviderFee = this.toPrecision(
      context.liquidityProviderFee,
    );
    if (context.minAmountConvertQuote) {
      context.minAmountConvertQuote = this.toPrecision(
        context.minAmountConvertQuote,
      );
    }
    if (context.maximumSent) {
      context.maximumSent = this.toPrecision(context.maximumSent);
    }
    context.expectedConvertQuote = this.toPrecision(
      context.expectedConvertQuote,
    );

    return context;
  }

  /**
   * Sync balances interval
   */
  private async syncBalancesInternal(): Promise<void> {
    setInterval(() => this.getBalances(), 5000);
  }

  /**
   * Get the balances of the supported contracts
   */
  private async getBalances(): Promise<void> {
    const tokenWithAllowanceInfo =
      await this._tokensFactoryPublic.getAllowanceAndBalanceOfForContracts(
        UniswapVersion.v3,
        '0x37c81284caA97131339415687d192BF7D18F0f2a',
        this._context.supportedContracts.map((c) =>
          ethers.utils.getAddress(c.contractAddress),
        ),
        true,
      );

    // look at caching this we still want to fetch the balances every 5 seconds but
    // fiat prices can be cached
    const fiatPrices = await this.getCoinGeckoFiatPrices(
      tokenWithAllowanceInfo.map((c) => c.token.contractAddress),
    );

    this.supportedTokenBalances = tokenWithAllowanceInfo
      .map((item) =>
        this.buildExtendedToken(
          item.token,
          item.allowanceAndBalanceOf.balanceOf,
          fiatPrices,
        ),
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

    if (this.inputToken.symbol.toLowerCase() === 'weth') {
      this.inputToken.balance = new BigNumber(
        await this.factory!.getFromTokenBalance(),
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
      if (this.outputToken.symbol.toLowerCase() === 'weth') {
        this.outputToken.balance = new BigNumber(
          await this.factory!.getToTokenBalance(),
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
  }

  /**
   * Theme component
   */
  public themeComponent(): void {
    let css = '<style>';
    css += this.themeBackgroundColors();
    css += this.themeTextColors();
    css += this.themePanelColors();
    css += this.themeButtonColors();
    css += '<style>';

    document.head.insertAdjacentHTML('beforeend', css);
  }

  /**
   * Theme background colors
   */
  private themeBackgroundColors(): string {
    if (this._context.theming?.backgroundColor) {
      return `.uni-ic__theme-background {background: ${this._context.theming.backgroundColor} !important}`;
    }

    return '';
  }

  /**
   * Theme text colours
   */
  private themeTextColors(): string {
    if (this._context.theming?.textColor) {
      return `.uni-ic,
              .uni-ic__modal,
              .uni-ic__modal button:not(.uni-ic__theme-background-button),
              svg
              {color: ${this._context.theming.textColor} !important}`;
    }

    return '';
  }

  /**
   * Theme button colours
   */
  private themeButtonColors(): string {
    let css = '';
    if (this._context.theming?.button?.backgroundColor) {
      css += `background: ${this._context.theming.button.backgroundColor} !important; `;
    }

    if (this._context.theming?.button?.textColor) {
      css += `color: ${this._context.theming.button.textColor} !important`;
    }

    if (css.length > 0) {
      return `.uni-ic__theme-background-button,
              .uni-ic__settings-transaction-slippage-option.selected,
              .uni-ic__settings-interface-multihops-actions-off.selected
              {${css}}`;
    }

    return css;
  }

  /**
   * Theme panel colours
   */
  private themePanelColors(): string {
    let css = '';
    if (this._context.theming?.panel?.backgroundColor) {
      css += `background: ${this._context.theming.panel.backgroundColor} !important; border-color: ${this._context.theming.backgroundColor} !important; `;
    }

    if (this._context.theming?.panel?.textColor) {
      css += `color: ${this._context.theming.panel.textColor} !important`;
    }

    if (css.length > 0) {
      return `.uni-ic__theme-panel {${css}}`;
    }

    return css;
  }
}
