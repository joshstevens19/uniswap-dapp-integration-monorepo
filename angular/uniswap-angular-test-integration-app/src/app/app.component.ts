import { Component, OnInit } from '@angular/core';
import BigNumber from 'bignumber.js';
import { UniswapDappSharedLogic } from './uniswap-dapp-shared-logic';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'uniswap-angular-test-integration-app';

  public uniswapDappSharedLogic = new UniswapDappSharedLogic({
    inputCurrency: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // '0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b';
    outputCurrency: '0x1985365e9f78359a9B6AD760e32412f4a445E862',
    supportedContracts: [
      { contractAddress: '0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b' },
      { contractAddress: '0x1985365e9f78359a9B6AD760e32412f4a445E862' },
    ],
  });
  public loading = true;

  public inputValue = '1';
  public outputValue = '0';

  constructor() {
    // (<any>window).ethereum.request({ method: 'eth_requestAccounts' });
  }

  public async ngOnInit(): Promise<void> {
    await this.uniswapDappSharedLogic.init();

    if (this.uniswapDappSharedLogic.tradeContext?.expectedConvertQuote) {
      this.outputValue = this.uniswapDappSharedLogic.tradeContext.expectedConvertQuote;
    }

    this.loading = false;
  }

  public toggleSettings(): void {
    this.uniswapDappSharedLogic.toggleSettings();
  }

  public openTokenSelectorFrom(): void {
    this.uniswapDappSharedLogic.openTokenSelectorFrom();
  }

  public openTokenSelectorTo(): void {
    this.uniswapDappSharedLogic.openTokenSelectorTo();
  }

  public hideTokenSelector(): void {
    this.uniswapDappSharedLogic.hideTokenSelector();
  }

  public async changeInputTradePrice(amount: string): Promise<void> {
    this.inputValue = amount;
    if (new BigNumber(this.inputValue).isEqualTo(0)) {
      this.outputValue = '0';
      return;
    }

    await this.uniswapDappSharedLogic.changeInputTradePrice(amount);
    this.outputValue = this.uniswapDappSharedLogic.tradeContext!.expectedConvertQuote;
  }
}
