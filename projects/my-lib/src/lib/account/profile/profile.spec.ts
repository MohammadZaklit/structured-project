import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NzAccountProfileComponent } from './profile';

describe('NzAccountProfileComponent', () => {
  let component: NzAccountProfileComponent;
  let fixture: ComponentFixture<NzAccountProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NzAccountProfileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NzAccountProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
