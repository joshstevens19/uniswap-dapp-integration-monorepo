import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  SelectTokenActionFrom,
  UniswapDappSharedLogic,
  Utils as UniswapUtils,
} from 'uniswap-dapp-integration-shared';

@Component({
  selector: 'lib-tokens-modal',
  templateUrl: './tokens-modal.component.html',
  styleUrls: ['./tokens-modal.component.scss'],
})
export class TokensModalComponent {
  @Input() public uniswapDappSharedLogic!: UniswapDappSharedLogic;
  @Output() public switchSwapCompleted = new EventEmitter();

  public utils = UniswapUtils;
  public searchToken: string | undefined;
  constructor() {}

  /**
   * Change select token
   * @param contractAddress The contractAddress
   */
  public async changeSelectToken(contractAddress: string): Promise<void> {
    switch (this.uniswapDappSharedLogic.selectorOpenFrom) {
      case SelectTokenActionFrom.input:
        if (
          this.uniswapDappSharedLogic.tradeContext?.fromToken
            .contractAddress === contractAddress
        ) {
          this.uniswapDappSharedLogic.hideTokenSelector();
          return;
        }

        if (
          this.uniswapDappSharedLogic.tradeContext?.toToken.contractAddress ===
          contractAddress
        ) {
          await this.uniswapDappSharedLogic.swapSwitch();
          this.switchSwapCompleted.emit();
          this.uniswapDappSharedLogic.hideTokenSelector();
          return;
        }
        await this.uniswapDappSharedLogic.changeToken(contractAddress);
        return;
      case SelectTokenActionFrom.output:
        if (
          this.uniswapDappSharedLogic.tradeContext?.toToken.contractAddress ===
          contractAddress
        ) {
          this.uniswapDappSharedLogic.hideTokenSelector();
          return;
        }

        if (
          this.uniswapDappSharedLogic.tradeContext?.fromToken
            .contractAddress === contractAddress
        ) {
          await this.uniswapDappSharedLogic.swapSwitch();
          this.switchSwapCompleted.emit();
          this.uniswapDappSharedLogic.hideTokenSelector();
          return;
        }
        await this.uniswapDappSharedLogic.changeToken(contractAddress);
    }
  }
}
