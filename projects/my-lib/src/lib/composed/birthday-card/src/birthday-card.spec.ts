import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthdayCard } from './birthday-card';

describe('BirthdayCard', () => {
  let component: BirthdayCard;
  let fixture: ComponentFixture<BirthdayCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BirthdayCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BirthdayCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
