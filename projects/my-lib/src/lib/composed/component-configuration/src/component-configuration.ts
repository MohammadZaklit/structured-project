import { Component, computed, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzComponentConfiguration } from './component-configuration.interface';
import {
  NzFormArray,
  NzFormControl,
  NzFormGroup,
  NzGenericRecord,
} from '@zak-lib/ui-library/shared';
import { NzInput, NzInputComponent } from '@zak-lib/ui-library/elements/form-fields/input';
import {
  NzToggleSwitch,
  NzToggleSwitchComponent,
} from '@zak-lib/ui-library/elements/form-fields/toggle-switch';
import { NzFormFieldModule } from '@zak-lib/ui-library/elements/form-fields/form-field/form-field-module';
import {
  isSelectComponent,
  NzFieldType,
  NzFieldTypeEnum,
} from '@zak-lib/ui-library/elements/form-fields/form-field';
import { TabsModule } from 'primeng/tabs';
import { FormBuilder, Validators } from '@angular/forms';
import {
  NzAutoComplete,
  NzAutocompleteComponent,
} from '@zak-lib/ui-library/elements/form-fields/autocomplete';
import {
  NzStandardButton,
  NzStandardButtonComponent,
} from '@zak-lib/ui-library/components/standardbutton';
import { NzIconDef } from '@zak-lib/ui-library/shared/src/constants/icons';

@Component({
  selector: 'nz-component-configuration',
  imports: [
    NzFormFieldModule,
    NzInputComponent,
    NzToggleSwitchComponent,
    TabsModule,
    NzStandardButtonComponent,
    NzAutocompleteComponent,
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

  cancelBtn!: NzStandardButton;
  saveBtn!: NzStandardButton;
  addOptionBtn!: NzStandardButton;
  HideSelectFields = true;
  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<NzComponentConfiguration>();

  constructor(private fb: FormBuilder) {}

  getRemoveOptionBtn(i: number): NzStandardButton {
    return {
      label: '',
      icon: NzIconDef.DELETE,
      type: 'button',
      onclick: () => {
        this.removeOption(i);
      },
    };
  }

  ngOnInit(): void {
    this.form = new NzFormGroup({});

    this.addOptionBtn = {
      label: '',
      icon: NzIconDef.ADD,
      type: 'button',
      onclick: () => {
        this.addOption();
      },
    };

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
    if (isSelectComponent(this.config.type as NzFieldType)) {
      this.HideSelectFields = !isSelectComponent(this.config.type as NzFieldType);
      this.config.configuration?.['settings']?.dataOptions?.forEach((row: NzGenericRecord) => {
        this.addOption(row);
      });
    }
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
    settingsFormGroup.addControl('dataOptions', this.fb.array([]));
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
      label: 'Data Source Selection',
      name: 'Data Source',
      form: this.form,
      settings: {
        dataSource: {
          label: 'modules',
        },
      },
    };

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
  get dataOptions() {
    return this.form.get('settings.dataOptions') as NzFormArray; // NzFormArray / FormArray
  }
  createOption(obj?: NzGenericRecord): NzFormGroup {
    const newOptionFormGroup = new NzFormGroup({});
    newOptionFormGroup.addControl('id', new NzFormControl(obj?.id || '', [Validators.required]));
    newOptionFormGroup.addControl(
      'label',
      new NzFormControl(obj?.['label'] || '', [Validators.required]),
    );
    return newOptionFormGroup;
  }
  private addOption(obj?: NzGenericRecord): void {
    this.dataOptions.push(this.createOption(obj));
  }
  removeOption(index: number): void {
    this.dataOptions.removeAt(index);
  }
}
