import { TokenImage } from './token-image';

export interface SupportedToken {
  tokenImageContext?: TokenImage;
  contractAddress: string;
}
