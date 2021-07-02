import BigNumber from 'bignumber.js';
import { Token } from 'simple-uniswap-sdk';

export interface ExtendedToken extends Token {
  balance: BigNumber;
  fiatPrice: BigNumber | undefined;
  image: string;
}
