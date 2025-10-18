import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPageView } from './admin-page-view';

describe('AdminPageView', () => {
  let component: AdminPageView;
  let fixture: ComponentFixture<AdminPageView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPageView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPageView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
