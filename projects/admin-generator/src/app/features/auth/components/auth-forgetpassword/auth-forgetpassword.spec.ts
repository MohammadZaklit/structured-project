import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthForgetpassword } from './auth-forgetpassword';

describe('AuthForgetpassword', () => {
  let component: AuthForgetpassword;
  let fixture: ComponentFixture<AuthForgetpassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthForgetpassword]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthForgetpassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
