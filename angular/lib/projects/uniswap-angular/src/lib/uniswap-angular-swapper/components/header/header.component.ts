import { Component, Input } from '@angular/core';
import { UniswapDappSharedLogic } from 'uniswap-dapp-integration-shared';

@Component({
  selector: 'lib-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() public uniswapDappSharedLogic!: UniswapDappSharedLogic;

  public slippageCustom: number | undefined;
  public transactionDeadline: number | undefined;

  constructor() {}

  /**
   * Set custom slippage
   */
  public setCustomSlippage(value: number): void {
    if (!value) {
      this.uniswapDappSharedLogic.setSlippage(0.5);
    } else {
      this.uniswapDappSharedLogic.setSlippage(value);
    }
  }
}
