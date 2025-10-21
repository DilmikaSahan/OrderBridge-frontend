import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsWidget } from './product-details-widget';

describe('ProductDetailsWidget', () => {
  let component: ProductDetailsWidget;
  let fixture: ComponentFixture<ProductDetailsWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailsWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
