import { Component, Input } from '@angular/core';
import { UniswapDappSharedLogic } from 'uniswap-dapp-integration-shared';

@Component({
  selector: 'lib-swap-quote-info',
  templateUrl: './swap-quote-info.component.html',
  styleUrls: ['./swap-quote-info.component.scss'],
})
export class SwapQuoteInfoComponent {
  @Input() public uniswapDappSharedLogic!: UniswapDappSharedLogic;

  constructor() {}
}
