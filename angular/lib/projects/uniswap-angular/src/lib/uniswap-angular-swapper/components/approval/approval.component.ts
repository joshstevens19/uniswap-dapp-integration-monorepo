import { Component, Input } from '@angular/core';
import { UniswapDappSharedLogic } from 'uniswap-dapp-integration-shared';

@Component({
  selector: 'lib-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.scss'],
})
export class ApprovalComponent {
  @Input() public uniswapDappSharedLogic!: UniswapDappSharedLogic;

  constructor() {}
}
