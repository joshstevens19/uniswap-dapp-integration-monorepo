import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { UniswapAngularSwapperComponent } from './uniswap-angular-swapper/uniswap-angular-swapper.component';

@NgModule({
  declarations: [UniswapAngularSwapperComponent],
  imports: [CommonModule, FormsModule, BrowserModule],
  exports: [UniswapAngularSwapperComponent],
})
export class UniswapModule {}
