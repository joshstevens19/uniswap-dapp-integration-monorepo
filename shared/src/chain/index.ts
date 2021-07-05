import { Subject } from 'rxjs';
import { ChainId } from 'simple-uniswap-sdk';
import { EthereumProvider } from '../ethereum-provider';

export class ChainService {
  public newBlock$ = new Subject<number>();
  constructor(private _ethereumProvider: EthereumProvider) {
    this.unwatch();
    this.watchBlocks();
  }

  /**
   * Get the block explorer for transaction hash
   * @param chainId The chain id
   * @param transactionHash The transaction hash
   */
  public getBlockExplorerLinkForTransactionHash(
    chainId: ChainId,
    transactionHash: string,
  ): string {
    return `${this.getBlockExplorerForNetwork(chainId)}tx/${transactionHash}`;
  }

  /**
   * Get block explorer link for network
   * @param network The network
   */
  private getBlockExplorerForNetwork(chainId: ChainId): string {
    switch (chainId) {
      case ChainId.MAINNET:
        return 'https://etherscan.io/';
      case ChainId.RINKEBY:
        return 'https://rinkeby.etherscan.io/';
      case ChainId.ROPSTEN:
        return 'https://ropsten.etherscan.io/';
      case ChainId.KOVAN:
        return 'https://kovan.etherscan.io/';
      case ChainId.GÖRLI:
        return 'https://goerli.etherscan.io/';
      default:
        throw new Error('Network is not defined');
    }
  }

  /**
   * Watch blocks
   */
  private watchBlocks(): void {
    this._ethereumProvider.provider.on('block', (block: number) => {
      this.handleNewBlock(block);
    });
  }

  /**
   * Handle new block
   */
  private handleNewBlock(block: number): void {
    console.log('new block chain service', block);
    this.newBlock$.next(block);
  }

  /**
   * unwatch any block streams
   */
  private unwatch(): void {
    this._ethereumProvider.provider.removeAllListeners('block');
  }
}
