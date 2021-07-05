import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { UniswapModule } from 'projects/uniswap-angular/src/public-api';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, UniswapModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
