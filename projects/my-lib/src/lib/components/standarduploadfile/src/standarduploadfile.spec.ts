import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Standarduploadfile } from './standarduploadfile';

describe('Standarduploadfile', () => {
  let component: Standarduploadfile;
  let fixture: ComponentFixture<Standarduploadfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Standarduploadfile],
    }).compileComponents();

    fixture = TestBed.createComponent(Standarduploadfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
