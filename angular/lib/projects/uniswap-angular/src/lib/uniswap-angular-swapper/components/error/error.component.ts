import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent {
  @Input() public error!: string;
  constructor() {}
}
