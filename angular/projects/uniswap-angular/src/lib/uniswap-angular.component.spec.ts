import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniswapAngularComponent } from './uniswap-angular.component';

describe('UniswapAngularComponent', () => {
  let component: UniswapAngularComponent;
  let fixture: ComponentFixture<UniswapAngularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniswapAngularComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UniswapAngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
