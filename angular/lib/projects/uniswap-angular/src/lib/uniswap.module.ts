import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SafePipe } from './pipes/safe.pipe';
import { UniswapAngularSwapperComponent } from './uniswap-angular-swapper/uniswap-angular-swapper.component';

@NgModule({
  declarations: [SafePipe, UniswapAngularSwapperComponent],
  imports: [CommonModule],
  exports: [],
})
export class UniswapModule {}
