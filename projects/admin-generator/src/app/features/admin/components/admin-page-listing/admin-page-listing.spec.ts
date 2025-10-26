import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPageListing } from './admin-page-listing';

describe('AdminPageListing', () => {
  let component: AdminPageListing;
  let fixture: ComponentFixture<AdminPageListing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPageListing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPageListing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
