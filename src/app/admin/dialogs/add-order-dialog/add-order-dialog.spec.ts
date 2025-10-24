import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrderDialog } from './add-order-dialog';

describe('AddOrderDialog', () => {
  let component: AddOrderDialog;
  let fixture: ComponentFixture<AddOrderDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOrderDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOrderDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
