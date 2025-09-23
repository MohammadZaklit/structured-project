import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasedragDrop } from './basedrag-drop';

describe('BasedragDrop', () => {
  let component: BasedragDrop;
  let fixture: ComponentFixture<BasedragDrop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasedragDrop]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasedragDrop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
