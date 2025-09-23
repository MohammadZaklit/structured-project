import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Standardtextarea } from '../standardtextarea';

describe('Standardtextarea', () => {
  let component: Standardtextarea;
  let fixture: ComponentFixture<Standardtextarea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Standardtextarea],
    }).compileComponents();

    fixture = TestBed.createComponent(Standardtextarea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
