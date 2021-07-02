import { ChainId, UniswapPairSettings } from 'simple-uniswap-sdk';
import { UniswapTheming } from '../theming/models/uniswap-theming';

export interface UniswapDappSharedLogicContext {
  supportedNetworkTokens: SupportedNetworkTokens[];
  ethereumAddress: string;
  ethereumProvider: any;
  settings?: UniswapPairSettings | undefined;
  theming?: UniswapTheming;
  defaultInputValue?: string | undefined;
  ngZone?: any;
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
