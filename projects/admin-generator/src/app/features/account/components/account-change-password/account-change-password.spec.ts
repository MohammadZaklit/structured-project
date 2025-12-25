import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountChangePassword } from './account-change-password';

describe('AccountChangePassword', () => {
  let component: AccountChangePassword;
  let fixture: ComponentFixture<AccountChangePassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountChangePassword]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountChangePassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
