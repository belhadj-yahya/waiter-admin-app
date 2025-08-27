import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeePlacedOrder } from './see-placed-order';

describe('SeePlacedOrder', () => {
  let component: SeePlacedOrder;
  let fixture: ComponentFixture<SeePlacedOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeePlacedOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeePlacedOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
