import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountBase } from './account-base';

describe('AccountBase', () => {
  let component: AccountBase;
  let fixture: ComponentFixture<AccountBase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountBase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountBase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
