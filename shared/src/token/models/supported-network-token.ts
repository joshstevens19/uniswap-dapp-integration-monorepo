import { ChainId } from 'simple-uniswap-sdk';
import { SupportedToken } from './supported-token';

export interface SupportedNetworkTokens {
  chainId: ChainId;
  defaultInputValue?: string | undefined;
  defaultInputToken?: string | undefined;
  defaultOutputToken?: string | undefined;
  supportedTokens: SupportedToken[];
}
