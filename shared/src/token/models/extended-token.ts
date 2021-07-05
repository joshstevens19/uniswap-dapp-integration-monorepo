import BigNumber from 'bignumber.js';
import { Token } from 'simple-uniswap-sdk';
import { TokenImage } from './token-image';

export interface ExtendedToken extends Token {
  balance: BigNumber;
  fiatPrice: BigNumber | undefined;
  tokenImageContext: TokenImage;
}
