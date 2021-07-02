import { ChainId } from 'simple-uniswap-sdk';

export const getCoinGeckoFiatPrices = async (
  contractAddresses: string[],
  chainId: number,
) => {
  if (chainId === ChainId.MAINNET) {
    return await (
      await fetch(
        `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${contractAddresses.join()}&vs_currencies=usd`,
      )
    ).json();
  } else {
    return {};
  }
};
