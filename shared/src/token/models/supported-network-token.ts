import { ChainId } from 'simple-uniswap-sdk';
import { SupportedToken } from './supported-token';

export interface SupportedNetworkTokens {
  chainId: ChainId;
  providerUrl?: string | undefined;
  defaultInputToken?: string;
  defaultOutputToken?: string;
  supportedTokens: SupportedToken[];
}
