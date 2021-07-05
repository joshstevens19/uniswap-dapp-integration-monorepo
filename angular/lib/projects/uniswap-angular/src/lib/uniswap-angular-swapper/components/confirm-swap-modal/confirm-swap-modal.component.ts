import { Component, Input } from '@angular/core';
import {
  UniswapDappSharedLogic,
  Utils as UniswapUtils,
} from 'uniswap-dapp-integration-shared';

@Component({
  selector: 'lib-confirm-swap-modal',
  templateUrl: './confirm-swap-modal.component.html',
  styleUrls: ['./confirm-swap-modal.component.scss'],
})
export class ConfirmSwapModalComponent {
  @Input() public uniswapDappSharedLogic!: UniswapDappSharedLogic;

  public utils = UniswapUtils;
  constructor() {}
}
