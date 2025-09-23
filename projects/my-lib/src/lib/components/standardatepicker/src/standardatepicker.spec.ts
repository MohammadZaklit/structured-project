import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Standardatepicker } from './standardatepicker';

describe('Standardatepicker', () => {
  let component: Standardatepicker;
  let fixture: ComponentFixture<Standardatepicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Standardatepicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Standardatepicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
