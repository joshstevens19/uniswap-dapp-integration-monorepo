import BigNumber from 'bignumber.js';
import { ChainId, Token, UniswapPairSettings } from 'simple-uniswap-sdk';

export interface UniswapDappSharedLogicContext {
  supportedNetworkTokens: SupportedNetworkTokens[];
  ethereumProvider?: any;
  settings?: UniswapPairSettings | undefined;
  theming?: UniswapTheming;
  defaultInputValue?: string | undefined;
}

interface TextAndColor {
  textColor?: string | undefined;
  backgroundColor?: string | undefined;
}

export interface UniswapTheming {
  backgroundColor?: string | undefined;
  textColor?: string | undefined;
  button?: TextAndColor;
  panel?: TextAndColor;
}

export interface ExtendedToken extends Token {
  balance: BigNumber;
  fiatPrice: BigNumber | undefined;
  image: string;
}

export interface SupportedNetworkTokens {
  chainId: ChainId;
  providerUrl?: string | undefined;
  defaultInputToken?: string;
  defaultOutputToken?: string;
  supportedTokens: SupportedToken[];
}

export interface SupportedToken {
  iconUrl?: string;
  contractAddress: string;
}

export interface SupportedTokenResult extends ExtendedToken {
  canShow: boolean;
}

export enum SelectTokenActionFrom {
  input = 'input',
  output = 'output',
}

export enum MiningAction {
  approval = 'approval',
  swap = 'swap',
}

export enum TransactionStatus {
  waitingForConfirmation = 'waitingForConfirmation',
  rejected = 'rejected',
  mining = 'mining',
  completed = 'completed',
}
export interface MiningTransaction {
  txHash?: string | undefined;
  status: TransactionStatus;
  miningAction: MiningAction;
  blockExplorerLink?: string | undefined;
}

export interface TokenCachedImage {
  image: string;
  contractAddress: string;
  chainId: number;
}
