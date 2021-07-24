import { Component, Input } from '@angular/core';
import {
  TransactionStatus,
  UniswapDappSharedLogic,
} from 'uniswap-dapp-integration-shared';

@Component({
  selector: 'lib-transaction-modal',
  templateUrl: './transaction-modal.component.html',
  styleUrls: ['./transaction-modal.component.scss'],
})
export class TransactionModalComponent {
  @Input() public uniswapDappSharedLogic!: UniswapDappSharedLogic;

  public transactionStatus = TransactionStatus;
  constructor() {}
}
