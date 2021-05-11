import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import BigNumber from 'bignumber.js';
import { Transaction } from 'simple-uniswap-sdk';
import { UniswapDappSharedLogic } from './uniswap-dapp-shared-logic';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @Output()
  public generatedApproveTransaction: EventEmitter<Transaction> = new EventEmitter();

  public notEnoughLiquidity = false;

  public uniswapDappSharedLogic = new UniswapDappSharedLogic({
    inputCurrency: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // '0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b';
    outputCurrency: '0x419d0d8bdd9af5e606ae2232ed285aff190e711b', // 0x1985365e9f78359a9B6AD760e32412f4a445E862
    supportedContracts: [
      { contractAddress: '0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b' },
      { contractAddress: '0x1985365e9f78359a9B6AD760e32412f4a445E862' },
    ],
  });
  public loading = true;

  public inputValue = '1';
  public outputValue = '0';

  constructor() {
    (<any>window).ethereum.request({ method: 'eth_requestAccounts' });
  }

  /**
   * On load
   */
  public async ngOnInit(): Promise<void> {
    try {
      await this.uniswapDappSharedLogic.init();

      if (this.uniswapDappSharedLogic.tradeContext?.expectedConvertQuote) {
        this.outputValue = this.uniswapDappSharedLogic.tradeContext.expectedConvertQuote;
      }
    } catch (error) {
      this.notEnoughLiquidity = true;
    }

    this.loading = false;
  }

  /**
   * Toggle settings
   */
  public toggleSettings(): void {
    this.uniswapDappSharedLogic.toggleSettings();
  }

  /**
   * Open token selector from
   */
  public openTokenSelectorFrom(): void {
    this.uniswapDappSharedLogic.openTokenSelectorFrom();
  }

  /**
   * Open token selector
   */
  public openTokenSelectorTo(): void {
    this.uniswapDappSharedLogic.openTokenSelectorTo();
  }

  /**
   * Hide token selector
   */
  public hideTokenSelector(): void {
    this.uniswapDappSharedLogic.hideTokenSelector();
  }

  /**
   * Change input trade price
   * @param amount The amount
   */
  public async changeInputTradePrice(amount: string): Promise<void> {
    this.notEnoughLiquidity = false;
    try {
      this.inputValue = amount;
      if (new BigNumber(this.inputValue).isEqualTo(0)) {
        this.outputValue = '0';
        return;
      }

      await this.uniswapDappSharedLogic.changeInputTradePrice(amount);
      this.outputValue = this.uniswapDappSharedLogic.tradeContext!.expectedConvertQuote;
    } catch (error) {
      this.notEnoughLiquidity = true;
    }
  }

  /**
   * Switch the swap
   */
  public async switchSwap(): Promise<void> {
    this.inputValue = this.outputValue;
    await this.uniswapDappSharedLogic.swapSwitch();

    this.outputValue = this.uniswapDappSharedLogic.tradeContext!.expectedConvertQuote;
  }

  /**
   * Generate approve max allowance data
   */
  public async generateApproveMaxAllowanceData(): Promise<void> {
    this.generatedApproveTransaction.emit(
      await this.uniswapDappSharedLogic.generateApproveMaxAllowanceData()
    );
  }

  /**
   * Max supply
   */
  public async maxSwap(): Promise<void> {
    this.inputValue = await this.uniswapDappSharedLogic.setMaxInput();
    this.outputValue = this.uniswapDappSharedLogic.tradeContext!.expectedConvertQuote;
  }
}
