import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzComponentConfiguration } from './component-configuration.interface';
import { NzFormControl, NzFormGroup } from '@zak-lib/ui-library/shared';
import { NzInput, NzInputComponent } from '@zak-lib/ui-library/elements/form-fields/input';
import {
  NzToggleSwitch,
  NzToggleSwitchComponent,
} from '@zak-lib/ui-library/elements/form-fields/toggle-switch';
import { NzFormFieldModule } from '@zak-lib/ui-library/elements/form-fields/form-field/form-field-module';
import { NzFieldTypeEnum } from '@zak-lib/ui-library/elements/form-fields/form-field';
import { TabsModule } from 'primeng/tabs';
import { FormBuilder, Validators } from '@angular/forms';
import { NzButton, NzButtonComponent } from '@zak-lib/ui-library/elements/button';
import {
  NzAutoComplete,
  NzAutocomplete,
} from '@zak-lib/ui-library/elements/form-fields/autocomplete';
import { DropdownService, ModuleOption } from '../services/dropdownservice';

@Component({
  selector: 'nz-component-configuration',
  imports: [
    NzFormFieldModule,
    NzInputComponent,
    NzToggleSwitchComponent,
    TabsModule,
    NzButtonComponent,
    NzAutocomplete,
  ],
  templateUrl: './component-configuration.html',
  styles: ``,
})
export class NzConfigurationComponent implements OnInit {
  @Input() config!: NzComponentConfiguration;

  fieldTypes = NzFieldTypeEnum;

  nameFieldConfig!: NzInput;
  labelFieldConfig!: NzInput;
  hintFieldConfig!: NzInput;

  valueFieldConfig!: NzInput;
  apiToValidateFieldConfig!: NzInput;
  extraPropsFieldConfig!: NzInput;
  placeholderFieldConfig!: NzInput;
  dataSourceDropdownConfig!: NzAutoComplete;
  patternFieldConfig!: NzInput;

  isRequiredFieldConfig!: NzToggleSwitch;
  isDisabledFieldConfig!: NzToggleSwitch;
  isVisibleFieldConfig!: NzToggleSwitch;

  form!: NzFormGroup;

  cancelBtn!: NzButton;
  saveBtn!: NzButton;

  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<NzComponentConfiguration>();

  constructor(
    private dropdownService: DropdownService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.form = new NzFormGroup({});

    this.cancelBtn = {
      label: 'Cancel',
      type: 'button',
      onclick: () => {
        this.form.reset();
        this.cancel.emit();
      },
    };

    this.saveBtn = {
      label: 'Save',
      type: 'button',
      onclick: () => {
        if (this.form.valid) {
          this.save.emit(this.form.getRawValue());
        } else {
          this.form.markAllAsTouched();
        }
      },
    };

    this.addFields();
    this.initConfig();
  }

  private addFields(): void {
    const settingsFormGroup = new NzFormGroup({});
    settingsFormGroup.addControl(
      'value',
      new NzFormControl(this.config?.configuration?.['settings']?.value || null, []),
    );
    settingsFormGroup.addControl(
      'isRequired',
      new NzFormControl(this.config?.configuration?.['settings']?.isRequired || false, []),
    );
    settingsFormGroup.addControl(
      'isDisabled',
      new NzFormControl(this.config?.configuration?.['settings']?.isDisabled || false, []),
    );
    settingsFormGroup.addControl(
      'isVisible',
      new NzFormControl(this.config?.configuration?.['settings']?.isVisible || false, []),
    );
    settingsFormGroup.addControl(
      'apiValidate',
      new NzFormControl(this.config?.configuration?.['settings']?.apiValidate || null, []),
    );
    settingsFormGroup.addControl(
      'dataSource',
      new NzFormControl(this.config?.configuration?.['settings']?.dataSource || null, []),
    );
    settingsFormGroup.addControl(
      'extraProps',
      new NzFormControl(this.config?.configuration?.['settings']?.extraProps || null, []),
    );
    settingsFormGroup.addControl(
      'placeholder',
      new NzFormControl(this.config?.configuration?.['settings']?.placeholder || null, []),
    );
    settingsFormGroup.addControl(
      'pattern',
      new NzFormControl(this.config?.configuration?.['settings']?.pattern || null, []),
    );
    this.form.addControl('settings', settingsFormGroup);

    this.form.addControl(
      'name',
      new NzFormControl(this.config?.configuration?.['name'] || null, [Validators.required]),
    );
    this.form.addControl(
      'label',
      new NzFormControl(this.config?.configuration?.['label'] || null, [Validators.required]),
    );
    this.form.addControl(
      'hint',
      new NzFormControl(this.config?.configuration?.['hint'] || null, []),
    );
  }

  private initConfig(): void {
    this.nameFieldConfig = {
      control: this.form.get('name') as NzFormControl,
      label: 'Name',
      name: 'name',
      form: this.form,
    };

    this.labelFieldConfig = {
      control: this.form.get('label') as NzFormControl,
      label: 'Label',
      name: 'label',
      form: this.form,
    };

    this.hintFieldConfig = {
      control: this.form.get('hint') as NzFormControl,
      label: 'Hint',
      name: 'hint',
      form: this.form,
    };

    this.valueFieldConfig = {
      control: this.form.get('settings.value') as NzFormControl,
      label: 'Value',
      name: 'value',
      form: this.form,
    };

    this.apiToValidateFieldConfig = {
      control: this.form.get('settings.apiValidate') as NzFormControl,
      label: 'Validate Value by API',
      name: 'apiValidate',
      form: this.form,
    };
    this.dataSourceDropdownConfig = {
      control: this.form.get('settings.dataSource') as NzFormControl,
      label: 'data Source Selection',
      name: 'dataSource',
      form: this.form,
      options: [],
    };

    this.dropdownService.getDropdownList().subscribe({
      next: (res: ModuleOption[]) => {
        this.dataSourceDropdownConfig.options = res.map((option) => ({
          label: option.label,
          id: option.id,
        }));
      },
      error: (err) => console.error('Error loading dropdown options', err),
    });
    this.extraPropsFieldConfig = {
      control: this.form.get('settings.extraProps') as NzFormControl,
      label: 'Extra Parameters',
      name: 'extraProps',
      form: this.form,
    };

    this.placeholderFieldConfig = {
      control: this.form.get('settings.placeholder') as NzFormControl,
      label: 'Placeholder',
      name: 'placeholder',
      form: this.form,
    };

    this.patternFieldConfig = {
      control: this.form.get('settings.pattern') as NzFormControl,
      label: 'Pattern',
      name: 'pattern',
      form: this.form,
    };

    this.isRequiredFieldConfig = {
      control: this.form.get('settings.isRequired') as NzFormControl,
      label: 'Is Required?',
      name: 'isRequired',
      form: this.form,
    };

    this.isDisabledFieldConfig = {
      control: this.form.get('settings.isDisabled') as NzFormControl,
      label: 'Is Disabled?',
      name: 'isDisabled',
      form: this.form,
    };

    this.isVisibleFieldConfig = {
      control: this.form.get('settings.isVisible') as NzFormControl,
      label: 'Is Visible?',
      name: 'isVisible',
      form: this.form,
    };
  }
}
