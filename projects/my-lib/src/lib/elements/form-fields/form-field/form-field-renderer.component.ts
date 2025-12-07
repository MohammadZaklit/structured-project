import { Component, Inject, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NzFormFieldComponents } from './field-component-map';
import { NzFieldRegistry } from './field-registry.token';
import { NzFieldComponentType, NzFieldType } from './field-component-type';
export interface NzFormFieldLoaderConfig {
  type: NzFieldType;
  fieldConfig: NzFieldComponentType;
}

@Component({
  selector: 'nz-form-field-renderer',
  template: `<ng-container #fieldContainer></ng-container>`,
  imports: [],
  providers: [{ provide: NzFieldRegistry, useValue: NzFormFieldComponents }],
  standalone: true,
})
export class NzFormFieldRendererComponent implements OnInit {
  @Input() config!: NzFormFieldLoaderConfig; // lets a parent component(nzformFieldLoaderConfig) send data to a child
  // component(config here) — basically pass values into the component.

  @ViewChild('fieldContainer', { read: ViewContainerRef, static: true }) //@ViewChild() lets a component access a child component,
  container!: ViewContainerRef;

  constructor(@Inject(NzFieldRegistry) private registry: Record<string, any>) {}

  ngOnInit() {
    this.renderField();
  }

  async renderField() {
    const loader = this.registry[this.config.type];
    if (!loader) {
      console.error(`No component registered for type ${this.config.type}`);
      return;
    }

    try {
      const componentType = await loader();
      this.container.clear();
      const componentRef = this.container.createComponent(componentType);

      // Set input dynamically
      componentRef.setInput('config', this.config.fieldConfig);

      // Trigger change detection
      componentRef.changeDetectorRef.detectChanges();
    } catch (error) {
      console.error(`Failed to load component for type ${this.config.type}`, error);
    }
  }
}
