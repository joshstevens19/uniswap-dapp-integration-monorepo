import { ChainId, removeEthFromContractAddress } from 'simple-uniswap-sdk';
import { Utils } from './utils';

export class CoinGecko {
  private _fiatPriceCache:
    | {
        cachedResponse: any;
        timestamp: number;
      }
    | undefined = undefined;
  // 30 seconds cache
  private _cacheMilliseconds = 30000;
  constructor() {}

  /**
   * Get the coin gecko fiat price
   * @param contractAddress The array of contract addresses
   * @param chainId The chain id
   */
  public async getCoinGeckoFiatPrices(
    contractAddresses: string[],
    chainId: number,
  ): Promise<any> {
    contractAddresses = contractAddresses.map((address) =>
      removeEthFromContractAddress(address),
    );
    if (chainId === ChainId.MAINNET) {
      if (this._fiatPriceCache) {
        const now = Date.now();
        if (
          Utils.deepClone(this._fiatPriceCache.timestamp) >
          now - this._cacheMilliseconds
        ) {
          return this._fiatPriceCache.cachedResponse;
        }
      }

      try {
        const response = await (
          await fetch(
            `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${contractAddresses.join()}&vs_currencies=usd`,
          )
        ).json();

        this._fiatPriceCache = {
          cachedResponse: response,
          timestamp: Date.now(),
        };

        return response;
      } catch (e) {
        // if coin gecko is down for any reason still allow the swapper to work
        if (this._fiatPriceCache) {
          return this._fiatPriceCache.cachedResponse;
        }

        return {};
      }
    } else {
      return {};
    }
  }
}
