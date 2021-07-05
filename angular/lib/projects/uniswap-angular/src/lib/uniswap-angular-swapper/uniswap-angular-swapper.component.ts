import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import BigNumber from 'bignumber.js';
import { Observable, Subscription } from 'rxjs';
import { TradeDirection } from 'simple-uniswap-sdk';
import {
  UniswapDappSharedLogic,
  UniswapDappSharedLogicContext,
  Utils as UniswapUtils,
} from 'uniswap-dapp-integration-shared';

@Component({
  selector: 'lib-uniswap-angular-swapper',
  templateUrl: './uniswap-angular-swapper.component.html',
  styleUrls: ['./uniswap-angular-swapper.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UniswapAngularSwapperComponent implements OnInit, OnDestroy {
  @Input() uniswapDappSharedLogicContext!: UniswapDappSharedLogicContext;
  @Input() accountChanged: Observable<string> | undefined;
  private _accountChangedSubscription: Subscription | undefined;
  @Input() chainChanged: Observable<any> | undefined;
  private _chainChangedSubscription: Subscription | undefined;

  public uniswapDappSharedLogic!: UniswapDappSharedLogic;

  public loading = true;

  // ng models
  public inputValue = '';
  public outputValue = '';

  public utils = UniswapUtils;

  private _newPriceTradeContextAvailableSubscription: any = Subscription.EMPTY;
  private _loadingUniswapSubscription: any = Subscription.EMPTY;

  constructor() {}

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

    this._loadingUniswapSubscription =
      this.uniswapDappSharedLogic.loading.subscribe((_loading) => {
        this.loading = _loading;
      });

    if (this.accountChanged) {
      this._accountChangedSubscription = this.accountChanged.subscribe(
        (ethereumAddress: string) => {
          this.uniswapDappSharedLogic.changeEthereumAddress(ethereumAddress);
        },
      );
    }

    if (this.chainChanged) {
      this._chainChangedSubscription = this.chainChanged.subscribe(
        (ethereumProvider: any) => {
          this.uniswapDappSharedLogic.changeChain(ethereumProvider);
        },
      );
    }

    this.loading = false;
  }

  /**
   * On destroy
   */
  public ngOnDestroy(): void {
    this._newPriceTradeContextAvailableSubscription.unsubscribe();
    this._loadingUniswapSubscription.unsubscribe();
    this._accountChangedSubscription?.unsubscribe();
    this._chainChangedSubscription?.unsubscribe();
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
    await this.uniswapDappSharedLogic.swapSwitch();
    this.switchSwapCompleted();
  }

  /**
   * Switch the swap completed
   */
  public switchSwapCompleted(): void {
    this.inputValue = this.outputValue;
    this.outputValue =
      this.uniswapDappSharedLogic.tradeContext!.expectedConvertQuote;
  }

  /**
   * swap transaction
   */
  public async swapTransaction(): Promise<void> {
    await this.uniswapDappSharedLogic.swapTransaction();
  }

  /**
   * Max supply
   */

  //  <button
  //     class="uni-ic__swap-input-content-main-from-max"
  //     (click)="maxSwap()"
  //     >
  //   MAX</button>
  // public async maxSwap(): Promise<void> {
  //   this.inputValue = await this.uniswapDappSharedLogic.setMaxInput();
  //   this.outputValue =
  //     this.uniswapDappSharedLogic.tradeContext!.expectedConvertQuote;
  // }

  /**
   * Check if something is zero
   * @param amount The amount
   */
  public isZero(amount: string | number): boolean {
    if (!amount || amount === '') {
      return true;
    }
    return new BigNumber(amount).eq(0);
  }
}
