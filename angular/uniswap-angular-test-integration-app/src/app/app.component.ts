import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'uniswap-angular-test-integration-app';

  public inputCurrency = '0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b';
  public outputCurrency = '0x1985365e9f78359a9B6AD760e32412f4a445E862';
  public supportedContracts: string[] = [
    '0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b',
    '0x1985365e9f78359a9B6AD760e32412f4a445E862',
  ];

  constructor() {
    // (<any>window).ethereum.request({ method: 'eth_requestAccounts' });
  }
}
