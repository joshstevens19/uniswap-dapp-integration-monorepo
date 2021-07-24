import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import BigNumber from 'bignumber.js';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  ErrorCodes,
  SwapSwitchResponse,
  TradeContext,
  TradeDirection,
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

  public loading = true;
  public uniswapDappSharedLogic!: UniswapDappSharedLogic;
  public noLiquidityFound = false;

  // ng models
  public inputValue = '';
  public outputValue = '';

  public utils = UniswapUtils;

  public inputTradePriceChanged: Subject<string> = new Subject<string>();
  public outputTradePriceChanged: Subject<string> = new Subject<string>();

  private _inputTradePriceChangedSubscription: Subscription =
    Subscription.EMPTY;
  private _outputTradePriceChangedSubscription: Subscription =
    Subscription.EMPTY;
  private _tradeContextSubscription: any = Subscription.EMPTY;
  private _newPriceTradeContextAvailableSubscription: any = Subscription.EMPTY;
  private _tradeCompletedSubscription: any = Subscription.EMPTY;
  private _loadingUniswapSubscription: any = Subscription.EMPTY;

  // milliseconds
  private readonly DEBOUNCE_DELAY = 250;

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

    await this.uniswapDappSharedLogic.init();

    this._tradeContextSubscription =
      this.uniswapDappSharedLogic.tradeContext$.subscribe(
        (tradeContext: TradeContext | undefined) => {
          if (tradeContext) {
            if (tradeContext.quoteDirection === TradeDirection.input) {
              this.outputValue = tradeContext.expectedConvertQuote;
            } else {
              this.inputValue = tradeContext.expectedConvertQuote;
            }
          }
        },
      );

    this._newPriceTradeContextAvailableSubscription =
      this.uniswapDappSharedLogic.newPriceTradeContextAvailable.subscribe(
        (tradeContext: TradeContext) => {
          if (tradeContext.quoteDirection === TradeDirection.input) {
            this.outputValue = tradeContext.expectedConvertQuote;
          } else {
            this.inputValue = tradeContext.expectedConvertQuote;
          }
        },
      );

    this._tradeCompletedSubscription =
      this.uniswapDappSharedLogic.tradeCompleted$.subscribe(
        (completed: boolean) => {
          if (completed) {
            this.noLiquidityFound = false;
            this.inputValue = '';
            this.outputValue = '';
          }
        },
      );

    if (this.uniswapDappSharedLogic.tradeContext?.expectedConvertQuote) {
      this.outputValue =
        this.uniswapDappSharedLogic.tradeContext.expectedConvertQuote;
    }

    this._loadingUniswapSubscription =
      this.uniswapDappSharedLogic.loading$.subscribe((_loading: boolean) => {
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

    this._inputTradePriceChangedSubscription = this.inputTradePriceChanged
      .pipe(debounceTime(this.DEBOUNCE_DELAY), distinctUntilChanged())
      .subscribe((amount) => {
        this.changeInputTradePrice(amount);
      });

    this._outputTradePriceChangedSubscription = this.outputTradePriceChanged
      .pipe(debounceTime(this.DEBOUNCE_DELAY), distinctUntilChanged())
      .subscribe((amount) => {
        this.changeOutputTradePrice(amount);
      });

    this.loading = false;
  }

  /**
   * On destroy
   */
  public ngOnDestroy(): void {
    this.uniswapDappSharedLogic.destroy();
    this._inputTradePriceChangedSubscription.unsubscribe();
    this._outputTradePriceChangedSubscription.unsubscribe();
    this._tradeContextSubscription.unsubscribe();
    this._newPriceTradeContextAvailableSubscription.unsubscribe();
    this._tradeCompletedSubscription.unsubscribe();
    this._loadingUniswapSubscription.unsubscribe();
    this._accountChangedSubscription?.unsubscribe();
    this._chainChangedSubscription?.unsubscribe();
  }

  /**
   * Switch the swap
   */
  public async switchSwap(): Promise<void> {
    const swapState = await this.uniswapDappSharedLogic.swapSwitch();
    this.switchSwapCompleted(swapState);
  }

  /**
   * Switch the swap completed
   */
  public switchSwapCompleted(response: SwapSwitchResponse): void {
    this.inputValue = response.inputValue;
    this.outputValue = response.outputValue;
  }

  /**
   * The token has been changed successfully
   */
  public changedTokenCompleted(): void {
    this.noLiquidityFound = false;
  }

  /**
   * Change input trade price
   * @param amount The amount
   */
  private async changeInputTradePrice(amount: string): Promise<void> {
    this.inputValue = amount;
    if (!this.inputValue || new BigNumber(this.inputValue).isEqualTo(0)) {
      this.outputValue = '';
      return;
    }

    const success = await this.changeTradePrice(amount, TradeDirection.input);
    if (success) {
      this.outputValue =
        this.uniswapDappSharedLogic.tradeContext!.expectedConvertQuote;
    } else {
      this.outputValue = '';
    }
  }

  /**
   * Change output trade price
   * @param amount The amount
   */
  private async changeOutputTradePrice(amount: string): Promise<void> {
    this.outputValue = amount;
    if (!this.outputValue || new BigNumber(this.outputValue).isEqualTo(0)) {
      this.inputValue = '';
      return;
    }
    const success = await this.changeTradePrice(amount, TradeDirection.output);
    if (success) {
      this.inputValue =
        this.uniswapDappSharedLogic.tradeContext!.expectedConvertQuote;
    } else {
      this.inputValue = '';
    }
  }

  /**
   * Change trade price
   * @param amount The amount
   * @param tradeDirection The trade direction
   */
  private async changeTradePrice(
    amount: string,
    tradeDirection: TradeDirection,
  ): Promise<boolean> {
    try {
      await this.uniswapDappSharedLogic.changeTradePrice(
        amount,
        tradeDirection,
      );
    } catch (error) {
      if (error.code === ErrorCodes.noRoutesFound) {
        this.noLiquidityFound = true;
        return false;
      }
    }

    this.noLiquidityFound = false;

    return true;
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
}
