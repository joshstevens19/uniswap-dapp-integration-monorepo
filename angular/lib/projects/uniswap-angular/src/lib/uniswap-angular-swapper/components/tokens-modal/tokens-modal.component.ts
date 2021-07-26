import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ErrorCodes,
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
  @Output() public changedTokenCompleted = new EventEmitter<boolean>();

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

        await this.changeToken(contractAddress);
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

        await this.changeToken(contractAddress);
        return;
    }
  }

  /**
   * Change token handler
   * @param contractAddress The contractAddress
   */
  private async changeToken(contractAddress: string): Promise<void> {
    try {
      await this.uniswapDappSharedLogic.changeToken(contractAddress);
    } catch (error) {
      if (error?.code === ErrorCodes.noRoutesFound) {
        this.changedTokenCompleted.emit(true);
        return;
      } else {
        throw error;
      }
    }

    this.changedTokenCompleted.emit(false);
  }
}
