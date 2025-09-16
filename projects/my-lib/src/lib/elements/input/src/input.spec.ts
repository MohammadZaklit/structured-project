import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputElement } from './input';

describe('InputElement', () => {
  let component: InputElement;
  let fixture: ComponentFixture<InputElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputElement],
    }).compileComponents();

    fixture = TestBed.createComponent(InputElement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
