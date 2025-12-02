import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentConfiguration } from './component-configuration';

describe('ComponentConfiguration', () => {
  let component: ComponentConfiguration;
  let fixture: ComponentFixture<ComponentConfiguration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentConfiguration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentConfiguration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
