import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsForOrder } from './items-for-order';

describe('ItemsForOrder', () => {
  let component: ItemsForOrder;
  let fixture: ComponentFixture<ItemsForOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsForOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsForOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
