import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import BigNumber from 'bignumber.js';
import { Subscription } from 'rxjs';
import { TradeDirection } from 'simple-uniswap-sdk';
import {
  SelectTokenActionFrom,
  UniswapDappSharedLogic,
  UniswapDappSharedLogicContext,
} from 'uniswap-dapp-integration-shared';

@Component({
  selector: 'lib-uniswap-angular-swapper',
  templateUrl: './uniswap-angular-swapper.component.html',
  styleUrls: ['./uniswap-angular-swapper.component.scss'],
})
export class UniswapAngularSwapperComponent implements OnInit, OnDestroy {
  // @Output()
  // public generatedApproveTransaction: EventEmitter<Transaction> = new EventEmitter();

  @Input() uniswapDappSharedLogicContext!: UniswapDappSharedLogicContext;

  public uniswapDappSharedLogic!: UniswapDappSharedLogic;

  public loading = true;

  public inputValue: string = '';
  public outputValue: string = '';

  public transactionDeadline: number | undefined;
  public slippageCustom: number | undefined;
  public searchToken: string | undefined;

  private _newPriceTradeContextAvailableSubscription: any = Subscription.EMPTY;
  private _loadingUniswapSubscription: any = Subscription.EMPTY;

  constructor() {}

  /**
   * On destroy
   */
  public ngOnDestroy(): void {
    this._newPriceTradeContextAvailableSubscription.unsubscribe();
    this._loadingUniswapSubscription.unsubscribe();
  }

  /**
   * On load
   */
  public async ngOnInit(): Promise<void> {
    this.uniswapDappSharedLogic = new UniswapDappSharedLogic(
      this.uniswapDappSharedLogicContext,
    );
    if (this.uniswapDappSharedLogicContext.defaultInputValue) {
      this.inputValue = this.uniswapDappSharedLogicContext.defaultInputValue;
    }
    try {
      await this.uniswapDappSharedLogic.init();
    } catch (error) {
      if (error.message.includes('unsupported network')) {
        this.loading = false;
        return;
      }
    }

    this._newPriceTradeContextAvailableSubscription =
      this.uniswapDappSharedLogic.newPriceTradeContextAvailable.subscribe(
        (tradeContext) => {
          if (tradeContext.quoteDirection === TradeDirection.input) {
            this.outputValue = tradeContext.expectedConvertQuote;
          } else {
            this.inputValue = tradeContext.expectedConvertQuote;
          }
        },
      );

    if (this.uniswapDappSharedLogic.tradeContext?.expectedConvertQuote) {
      this.outputValue =
        this.uniswapDappSharedLogic.tradeContext.expectedConvertQuote;
    }

    this.loading = false;

    this._loadingUniswapSubscription =
      this.uniswapDappSharedLogic.loading.subscribe((_loading) => {
        this.loading = _loading;
      });
  }

  /**
   * Change input trade price
   * @param amount The amount
   */
  public async changeInputTradePrice(amount: string): Promise<void> {
    this.inputValue = amount;
    if (new BigNumber(this.inputValue).isEqualTo(0)) {
      this.outputValue = '0';
      return;
    }

    await this.uniswapDappSharedLogic.changeTradePrice(
      amount,
      TradeDirection.input,
    );
    this.outputValue =
      this.uniswapDappSharedLogic.tradeContext!.expectedConvertQuote;
  }

  /**
   * Change output trade price
   * @param amount The amount
   */
  public async changeOutputTradePrice(amount: string): Promise<void> {
    this.outputValue = amount;
    await this.uniswapDappSharedLogic.changeTradePrice(
      amount,
      TradeDirection.output,
    );
    this.inputValue =
      this.uniswapDappSharedLogic.tradeContext!.expectedConvertQuote;
  }

  /**
   * Switch the swap
   */
  public async switchSwap(): Promise<void> {
    this.inputValue = this.outputValue;
    await this.uniswapDappSharedLogic.swapSwitch();

    this.outputValue =
      this.uniswapDappSharedLogic.tradeContext!.expectedConvertQuote;
  }

  /**
   * approve allowance data
   */
  public async approveAllowance(): Promise<void> {
    // this.generatedApproveTransaction.emit(
    //   this.uniswapDappSharedLogic.tradeContext!.approvalTransaction!,
    // );

    await this.uniswapDappSharedLogic.approveAllowance();
  }

  /**
   * Max supply
   */
  public async maxSwap(): Promise<void> {
    this.inputValue = await this.uniswapDappSharedLogic.setMaxInput();
    this.outputValue =
      this.uniswapDappSharedLogic.tradeContext!.expectedConvertQuote;
  }

  /**
   * Change select token
   * @param contractAddress The contractAddress
   */
  public async changeSelectToken(contractAddress: string): Promise<void> {
    switch (this.uniswapDappSharedLogic.selectorOpenFrom) {
      case SelectTokenActionFrom.input:
        if (
          this.uniswapDappSharedLogic.tradeContext?.fromToken
            .contractAddress === contractAddress
        ) {
          this.uniswapDappSharedLogic.hideTokenSelector();
          return;
        }

        if (
          this.uniswapDappSharedLogic.tradeContext?.toToken.contractAddress ===
          contractAddress
        ) {
          await this.switchSwap();
          this.uniswapDappSharedLogic.hideTokenSelector();
          return;
        }
        await this.uniswapDappSharedLogic.changeToken(contractAddress);
        return;
      case SelectTokenActionFrom.output:
        if (
          this.uniswapDappSharedLogic.tradeContext?.toToken.contractAddress ===
          contractAddress
        ) {
          this.uniswapDappSharedLogic.hideTokenSelector();
          return;
        }

        if (
          this.uniswapDappSharedLogic.tradeContext?.fromToken
            .contractAddress === contractAddress
        ) {
          await this.switchSwap();
          this.uniswapDappSharedLogic.hideTokenSelector();
          return;
        }
        await this.uniswapDappSharedLogic.changeToken(contractAddress);
    }
  }

  /**
   * Check if something is zero
   * @param amount The amount
   */
  public isZero(amount: string | number): boolean {
    if (amount === '') {
      return true;
    }
    return new BigNumber(amount).eq(0);
  }
}
