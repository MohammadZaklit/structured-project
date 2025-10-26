import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPageForm } from './admin-page-form';

describe('AdminPageForm', () => {
  let component: AdminPageForm;
  let fixture: ComponentFixture<AdminPageForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPageForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPageForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
