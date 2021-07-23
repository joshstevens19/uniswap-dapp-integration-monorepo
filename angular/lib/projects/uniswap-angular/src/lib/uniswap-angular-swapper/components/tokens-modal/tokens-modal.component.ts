import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  SelectTokenActionFrom,
  SwapSwitchResponse,
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
  @Output() public switchSwapCompleted = new EventEmitter<SwapSwitchResponse>();
  @Output() public changedTokenCompleted = new EventEmitter<void>();

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
          this.uniswapDappSharedLogic.inputToken.contractAddress ===
          contractAddress
        ) {
          this.uniswapDappSharedLogic.hideTokenSelector();
          return;
        }

        if (
          this.uniswapDappSharedLogic.outputToken?.contractAddress ===
          contractAddress
        ) {
          const swapResponse = await this.uniswapDappSharedLogic.swapSwitch();
          this.switchSwapCompleted.emit(swapResponse);
          this.uniswapDappSharedLogic.hideTokenSelector();
          return;
        }
        await this.uniswapDappSharedLogic.changeToken(contractAddress);
        this.changedTokenCompleted.emit();
        return;
      case SelectTokenActionFrom.output:
        if (
          this.uniswapDappSharedLogic.outputToken?.contractAddress ===
          contractAddress
        ) {
          this.uniswapDappSharedLogic.hideTokenSelector();
          return;
        }

        if (
          this.uniswapDappSharedLogic.inputToken.contractAddress ===
          contractAddress
        ) {
          const swapResponse = await this.uniswapDappSharedLogic.swapSwitch();
          this.switchSwapCompleted.emit(swapResponse);
          this.uniswapDappSharedLogic.hideTokenSelector();
          return;
        }
        await this.uniswapDappSharedLogic.changeToken(contractAddress);
        this.changedTokenCompleted.emit();
    }
  }
}
