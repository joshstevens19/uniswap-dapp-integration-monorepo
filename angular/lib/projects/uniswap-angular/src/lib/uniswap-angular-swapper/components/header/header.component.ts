import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UniswapDappSharedLogic } from 'uniswap-dapp-integration-shared';

@Component({
  selector: 'lib-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() public uniswapDappSharedLogic!: UniswapDappSharedLogic;
  @Output() public disableMultihopsCompleted = new EventEmitter<boolean>();

  public slippageCustom: number | undefined;
  public transactionDeadline: number | undefined;

  constructor() {}

  /**
   * Set slippage from the choosen options
   */
  public async setSlippage(value: number): Promise<void> {
    this.slippageCustom = undefined;
    await this.uniswapDappSharedLogic.setSlippage(value);
  }

  /**
   * Set custom slippage
   */
  public async setCustomSlippage(value: number): Promise<void> {
    if (!value) {
      await this.uniswapDappSharedLogic.setSlippage(0.5);
    } else {
      await this.uniswapDappSharedLogic.setSlippage(value);
    }
  }

  /**
   * Set disable multihops
   * @params isDisabled - true or false
   */
  public async setDisableMultihops(isDisabled: boolean): Promise<void> {
    let thrownError = false;
    try {
      await this.uniswapDappSharedLogic.setDisableMultihops(isDisabled);
    } catch (error) {
      thrownError = true;
    }

    this.disableMultihopsCompleted.emit(thrownError);
  }
}
