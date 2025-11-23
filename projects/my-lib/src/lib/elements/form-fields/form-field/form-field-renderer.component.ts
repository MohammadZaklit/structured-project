import { Component, Inject, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FIELD_COMPONENTS } from './field-component-map';
import { FIELD_REGISTRY } from './field-registry.token';
import { NzFormField } from './form-field';

@Component({
  selector: 'nz-form-field-renderer',
  template: `<ng-container #fieldContainer></ng-container>`,
  imports: [],
  providers: [{ provide: FIELD_REGISTRY, useValue: FIELD_COMPONENTS }],
  standalone: true,
})
export class NzFormFieldRendererComponent implements OnInit {
  @Input() type!: string;
  @Input() config!: NzFormField;

  @ViewChild('fieldContainer', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  constructor(@Inject(FIELD_REGISTRY) private registry: Record<string, any>) {}

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
    const componentType = this.registry[this.type];
    if (!componentType) throw new Error(`No component registered for type ${this.type}`);

    const componentRef = this.container.createComponent(componentType);

    // Set input dynamically
    componentRef.setInput('config', this.config);

    // Trigger change detection
    componentRef.changeDetectorRef.detectChanges();
  }
}
