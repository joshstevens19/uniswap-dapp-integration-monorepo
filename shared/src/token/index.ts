import BigNumber from 'bignumber.js';
import {
  getAddress,
  removeEthFromContractAddress,
  Token,
  TokenFactoryPublic,
} from 'simple-uniswap-sdk';
import { EthereumProvider } from '../ethereum-provider';
import { ExtendedToken } from './models/extended-token';
import { SupportedNetworkTokens } from './models/supported-network-token';
import { SupportedTokenResult } from './models/supported-token-result';
import { TokenCachedImage } from './models/token-cached-image';
import { TokenImage } from './models/token-image';

export class TokenService {
  private _tokensCachedImages: TokenCachedImage[] = [];
  private _defaultTokenImageSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sc-1fvnadz-1 eIZpIe" style="color: rgb(136, 141, 155);"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>';

  constructor(
    private _ethereumProvider: EthereumProvider,
    private _supportedNetworkTokens: SupportedNetworkTokens[],
  ) {}

  /**
   * Get the token image url
   * @param contractAddress The contract address
   * @param chainId The chain id
   */
  public async getTokenImage(
    contractAddress: string,
    chainId: number,
  ): Promise<TokenImage> {
    contractAddress = getAddress(contractAddress, true);
    const cachedImage = this._tokensCachedImages.find(
      (c) => c.contractAddress === contractAddress && c.chainId === chainId,
    );
    if (cachedImage) {
      return cachedImage.tokenImageContext;
    }

    const supportedTokensForNetwork = this._supportedNetworkTokens.find(
      (tokens) => tokens.chainId === chainId,
    );

    if (supportedTokensForNetwork) {
      const token = supportedTokensForNetwork.supportedTokens.find(
        (c) => getAddress(c.contractAddress, true) === contractAddress,
      );
      if (token?.tokenImageContext) {
        this._tokensCachedImages.push({
          contractAddress,
          chainId: chainId,
          tokenImageContext: token.tokenImageContext,
        });
        return token.tokenImageContext;
      }
    }

    const image = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${removeEthFromContractAddress(
      contractAddress,
    )}/logo.png`;

    try {
      const result = await fetch(image);
      if (result.status === 404) {
        return this.getDefaultTokenImageAndCache(contractAddress, chainId);
      }
      this._tokensCachedImages.push({
        contractAddress,
        chainId: chainId,
        tokenImageContext: { image, isSvg: false },
      });

      return { image, isSvg: false };
    } catch (error) {
      return this.getDefaultTokenImageAndCache(contractAddress, chainId);
    }
  }

  /**
   * Get token information
   * @param contractAddress The contract address
   * @param ethereumProvider The custom ethereum provider from the dapp (not our interval one)
   */
  public async getTokenInformation(
    contractAddress: string,
    ethereumProvider: any,
  ): Promise<ExtendedToken> {
    contractAddress = getAddress(contractAddress, true);
    const tokenFactoryPublic = new TokenFactoryPublic(contractAddress, {
      ethereumProvider,
    });

    const token = (await tokenFactoryPublic.getToken()) as ExtendedToken;
    token.balance = new BigNumber(
      await tokenFactoryPublic.balanceOf(this._ethereumProvider.address),
    );

    return token;
  }

  /**
   * Build extended token
   * @param token The token
   * @param balance The balance
   */
  public async buildExtendedToken(
    token: Token,
    balance: string,
    // tslint:disable-next-line: ban-types
    fiatPriceResults: Object,
  ): Promise<ExtendedToken> {
    let fiatPrice: number | undefined;

    for (const [key, value] of Object.entries(fiatPriceResults)) {
      if (
        key.toLowerCase() ===
        removeEthFromContractAddress(token.contractAddress.toLowerCase())
      ) {
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
      tokenImageContext: await this.getTokenImage(
        token.contractAddress,
        token.chainId,
      ),
    };
  }

  /**
   * Search for tokens
   * @param search The search term
   */
  public searchToken(
    search: string,
    supportedTokenBalances: SupportedTokenResult[],
  ): SupportedTokenResult[] {
    let noneCaseSearch = search.toLowerCase();
    for (let i = 0; i < supportedTokenBalances.length; i++) {
      const token = supportedTokenBalances[i];
      if (
        search &&
        search !== '' &&
        !token.symbol.toLowerCase().includes(noneCaseSearch) &&
        noneCaseSearch !== token.contractAddress.toLowerCase()
      ) {
        token.canShow = false;
      } else {
        token.canShow = true;
      }
    }

    return supportedTokenBalances;
  }

  /**
   * Get the default token image and cache it
   * @param contractAddress The contract address
   * @param chainId The chain id
   */
  private getDefaultTokenImageAndCache(
    contractAddress: string,
    chainId: number,
  ): TokenImage {
    const tokenImageContext: TokenImage = {
      image: this._defaultTokenImageSvg,
      isSvg: true,
    };
    this._tokensCachedImages.push({
      contractAddress,
      chainId: chainId,
      tokenImageContext,
    });

    return { image: this._defaultTokenImageSvg, isSvg: true };
  }
}
