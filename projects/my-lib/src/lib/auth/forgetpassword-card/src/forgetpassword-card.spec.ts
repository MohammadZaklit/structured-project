import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NzForgetPasswordComponent } from './forgetpassword-card';

describe('NzForgetPasswordComponent', () => {
  let component: NzForgetPasswordComponent;
  let fixture: ComponentFixture<NzForgetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NzForgetPasswordComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NzForgetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
