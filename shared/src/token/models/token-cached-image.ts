import { TokenImage } from './token-image';

export interface TokenCachedImage {
  tokenImageContext: TokenImage;
  contractAddress: string;
  chainId: number;
}
