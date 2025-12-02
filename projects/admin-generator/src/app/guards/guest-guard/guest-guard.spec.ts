import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestGuard } from './guest-guard';

describe('GuestGuard', () => {
  let component: GuestGuard;
  let fixture: ComponentFixture<GuestGuard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestGuard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestGuard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
