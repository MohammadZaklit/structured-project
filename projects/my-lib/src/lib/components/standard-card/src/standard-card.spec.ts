import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardCard } from './standard-card';

describe('StandardCard', () => {
  let component: StandardCard;
  let fixture: ComponentFixture<StandardCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandardCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandardCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
