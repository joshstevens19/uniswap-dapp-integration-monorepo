import { Component, Input } from '@angular/core';
import { TokenImage } from 'uniswap-dapp-integration-shared/dist/token/models/token-image';

@Component({
  selector: 'lib-token-icon',
  templateUrl: './token-icon.component.html',
  styleUrls: ['./token-icon.component.scss'],
})
export class TokenIconComponent {
  @Input() public classes!: string;
  @Input() public tokenImageContext!: TokenImage;

  constructor() {}
}
