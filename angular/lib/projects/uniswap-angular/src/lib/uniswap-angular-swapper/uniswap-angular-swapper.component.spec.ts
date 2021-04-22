import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniswapAngularSwapperComponent } from './uniswap-angular-swapper.component';

describe('UniswapAngularSwapperComponent', () => {
  let component: UniswapAngularSwapperComponent;
  let fixture: ComponentFixture<UniswapAngularSwapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniswapAngularSwapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UniswapAngularSwapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
