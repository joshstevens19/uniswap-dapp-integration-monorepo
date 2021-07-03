import { ChainId } from 'simple-uniswap-sdk';
import { SupportedToken } from './supported-token';

export interface SupportedNetworkTokens {
  chainId: ChainId;
  defaultInputToken?: string | undefined;
  defaultOutputToken?: string | undefined;
  supportedTokens: SupportedToken[];
}
