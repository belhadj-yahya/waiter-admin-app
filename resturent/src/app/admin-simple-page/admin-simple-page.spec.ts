import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSimplePage } from './admin-simple-page';

describe('AdminSimplePage', () => {
  let component: AdminSimplePage;
  let fixture: ComponentFixture<AdminSimplePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSimplePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSimplePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
