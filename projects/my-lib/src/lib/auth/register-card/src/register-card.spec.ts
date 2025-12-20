import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NzRegisterCardComponent } from './register-card';

describe('RegisterCard', () => {
  let component: NzRegisterCardComponent;
  let fixture: ComponentFixture<NzRegisterCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NzRegisterCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NzRegisterCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
