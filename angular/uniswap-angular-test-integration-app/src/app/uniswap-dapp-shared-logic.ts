/// TODO MOVE TO NPM PACKAGE ONCE HAPPY

import BigNumber from 'bignumber.js';
import { ChainId, Token, TokenFactoryPublic } from 'simple-uniswap-sdk';

export interface UniswapDappSharedLogicContext {
  // ethereumAddress: string;
  inputCurrency?: string | undefined;
  ouputCurrency?: string | undefined;
  // look into a default token list??
  supportedContracts: string[];
}

export interface ExtendedToken extends Token {
  balance?: BigNumber | undefined;
}

export class UniswapDappSharedLogic {
  public inputToken!: ExtendedToken;

  constructor(private _context: UniswapDappSharedLogicContext) {}

  /**
   * Init the shared logic
   */
  public async init(): Promise<void> {
    this.inputToken = await this.getTokenInformation(
      this._context?.inputCurrency ||
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
    );
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
}
