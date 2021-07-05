import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { UniswapAngularSwapperComponent } from './uniswap-angular-swapper/uniswap-angular-swapper.component';
import { LoadingComponent } from './uniswap-angular-swapper/components/loading/loading.component';
import { HeaderComponent } from './uniswap-angular-swapper/components/header/header.component';
import { ConfirmSwapModalComponent } from './uniswap-angular-swapper/components/confirm-swap-modal/confirm-swap-modal.component';
import { TransactionModalComponent } from './uniswap-angular-swapper/components/transaction-modal/transaction-modal.component';
import { ErrorComponent } from './uniswap-angular-swapper/components/error/error.component';
import { TokensModalComponent } from './uniswap-angular-swapper/components/tokens-modal/tokens-modal.component';
import { SwapQuoteInfoComponent } from './uniswap-angular-swapper/components/swap-quote-info/swap-quote-info.component';
import { ApprovalComponent } from './uniswap-angular-swapper/components/approval/approval.component';

@NgModule({
  declarations: [UniswapAngularSwapperComponent, LoadingComponent, HeaderComponent, ConfirmSwapModalComponent, TransactionModalComponent, ErrorComponent, TokensModalComponent, SwapQuoteInfoComponent, ApprovalComponent],
  imports: [CommonModule, FormsModule, BrowserModule],
  exports: [UniswapAngularSwapperComponent],
})
export class UniswapModule {}
