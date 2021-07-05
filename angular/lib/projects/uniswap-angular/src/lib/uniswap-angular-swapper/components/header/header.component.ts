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
}
