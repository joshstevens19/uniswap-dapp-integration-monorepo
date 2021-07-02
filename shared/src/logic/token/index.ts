import BigNumber from 'bignumber.js';
import { ethers } from 'ethereum-abi-types-generator/node_modules/ethersv5';
import { Token, TokenFactoryPublic } from 'simple-uniswap-sdk';
import { ExtendedToken } from './models/extended-token';
import { SupportedTokenResult } from './models/supported-token-result';
import { TokenCachedImage } from './models/token-cached-image';

export class TokenService {
  private _tokensCachedImages: TokenCachedImage[] = [];

  constructor() {}

  /**
   * Get the token image url
   * @param contractAddress The contract address
   * @param chainId The chain id
   */
  public async getTokenImageUrl(
    contractAddress: string,
    chainId: number,
  ): Promise<string> {
    contractAddress = ethers.utils.getAddress(contractAddress);
    const cachedImage = this._tokensCachedImages.find(
      (c) => c.contractAddress === contractAddress && c.chainId === chainId,
    );
    if (cachedImage) {
      return cachedImage.image;
    }

    const image = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${contractAddress}/logo.png`;

    try {
      const result = await fetch(image);
      if (result.status === 404) {
        return this.getDefaultTokenImageAndCache(contractAddress, chainId);
      }
      this._tokensCachedImages.push({
        contractAddress,
        chainId: chainId,
        image,
      });

      return image;
    } catch (error) {
      return this.getDefaultTokenImageAndCache(contractAddress, chainId);
    }
  }

  /**
   * Get token information
   * @param contractAddress The contract address
   * @param chainId The chain id
   */
  public async getTokenInformation(
    contractAddress: string,
    chainId: number,
  ): Promise<ExtendedToken> {
    contractAddress = ethers.utils.getAddress(contractAddress);
    const tokenFactoryPublic = new TokenFactoryPublic(
      contractAddress,
      // FIX
      { chainId: chainId },
    );

    const token = (await tokenFactoryPublic.getToken()) as ExtendedToken;
    // to do fix
    token.balance = new BigNumber(
      await tokenFactoryPublic.balanceOf(contractAddress),
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
      image: await this.getTokenImageUrl(token.contractAddress, token.chainId),
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
  ): string {
    this._tokensCachedImages.push({
      contractAddress,
      chainId: chainId,
      image: 'assets/unknown.svg',
    });

    return 'assets/unknown.svg';
  }
}
