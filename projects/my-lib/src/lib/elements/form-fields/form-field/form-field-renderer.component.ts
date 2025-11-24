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
  @Input() config!: NzFormFieldLoaderConfig;

  @ViewChild('fieldContainer', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  constructor(@Inject(NzFieldRegistry) private registry: Record<string, any>) {}

  ngOnInit() {
    this.renderField();
    // // load component dynamically
    // const loader = FIELD_COMPONENTS[this.type];

    // if (!loader) {
    //   console.error(`Unknown field type: ${this.type}`);
    //   return;
    // }

    // const componentType = await loader();

    // // render it
    // this.container.createComponent(componentType, {
    //   inputs: {
    //     config: this.config,
    //   },
    // });
  }

  renderField() {
    const componentType = this.registry[this.config.type];
    console.warn('componentType: ', componentType);
    if (!componentType) throw new Error(`No component registered for type ${this.config.type}`);

    const componentRef = this.container.createComponent(componentType);

    // Set input dynamically
    componentRef.setInput('config', this.config.fieldConfig);

    // Trigger change detection
    componentRef.changeDetectorRef.detectChanges();
  }
}
