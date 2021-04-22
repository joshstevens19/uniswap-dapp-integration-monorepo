import { TestBed } from '@angular/core/testing';

import { UniswapAngularService } from './uniswap-angular.service';

describe('UniswapAngularService', () => {
  let service: UniswapAngularService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UniswapAngularService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
