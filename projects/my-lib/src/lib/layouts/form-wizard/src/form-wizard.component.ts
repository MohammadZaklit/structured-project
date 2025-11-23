import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  OnInit,
  inject,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, take } from 'rxjs/operators';

import { StepperModule } from 'primeng/stepper';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AutoCompleteModule } from 'primeng/autocomplete';
//import { EditorModule } from 'primeng/editor';
import { PasswordModule } from 'primeng/password';
import { SliderModule } from 'primeng/slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RatingModule } from 'primeng/rating';
import { ColorPickerModule } from 'primeng/colorpicker';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { KnobModule } from 'primeng/knob';
import { ListboxModule } from 'primeng/listbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PickListModule } from 'primeng/picklist';
import { SpeedDialModule } from 'primeng/speeddial';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { KeyFilterModule } from 'primeng/keyfilter';
import { InputOtpModule } from 'primeng/inputotp';
import { TreeSelectModule } from 'primeng/treeselect';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { NzFormFieldConfig, NzStepperConfig } from './form-wizard.interface';
import { DatePickerModule } from 'primeng/datepicker';
import { NzGenericRecord, NzHttpService, NzModuleConfig } from '@zak-lib/ui-library/shared';
import {
  NzConfirmDialogComponent,
  NzConfirmDialog,
} from '@zak-lib/ui-library/elements/ui/confirm-dialog';
import { FluidModule } from 'primeng/fluid';
import { CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { NzAutocomplete } from '@zak-lib/ui-library/elements/form-fields/autocomplete';

@Component({
  selector: 'nz-form-wizard',
  standalone: true,
  imports: [
    CommonModule,
    StepperModule,

    ReactiveFormsModule,
    InputTextModule,
    CheckboxModule,
    RadioButtonModule,
    //EditorModule,
    PasswordModule,
    SliderModule,
    MultiSelectModule,
    FileUploadModule,
    ButtonModule,
    ToggleButtonModule,
    RatingModule,
    ColorPickerModule,
    CascadeSelectModule,
    KnobModule,
    ListboxModule,
    SelectButtonModule,
    PickListModule,
    SpeedDialModule,
    SplitButtonModule,
    InputNumberModule,
    InputMaskModule,
    KeyFilterModule,
    InputOtpModule,
    TreeSelectModule,
    FloatLabelModule,
    IconFieldModule,
    InputGroupModule,
    DatePickerModule,
    NzConfirmDialogComponent,
    FluidModule,
    CdkDragPlaceholder,
    NzAutocomplete,
  ],
  templateUrl: './form-wizard.component.html',
  styleUrls: ['./form-wizard.component.scss'],
})
export class NzFormWizardComponent implements OnInit, OnChanges {
  @Input() fields: NzFormFieldConfig[] = [];
  @Input() stepperConfig!: NzStepperConfig;
  @Input() module!: NzModuleConfig;
  @Input() public data?: NzGenericRecord;
  @Output() successSubmit = new EventEmitter<any>();
  private httpService = inject(NzHttpService);
  form!: FormGroup;
  steps: any[] = [];
  activeStep = 0;
  public isEdit = false;

  public SubmitConfirmDialogConfig!: NzConfirmDialog;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes && changes['data']) {
      if (changes['data'].currentValue) {
        this.fillForm(changes['data'].currentValue);
        this.isEdit = true;
      } else {
        this.isEdit = false;
      }
    }
  }

  ngOnInit() {
    this.steps = this.stepperConfig?.steps || [{ label: 'Form' }];
    this.buildForm();
    //this.handleDynamicLogic();

    this.SubmitConfirmDialogConfig = {
      title: 'Submit Confirmation',
      message: 'Are you sure you want to submit your information?',
    };
  }

  private fillForm(data: NzGenericRecord): void {
    this.form.patchValue(data);
  }

  buildForm() {
    const group: any = {};
    // this.fields.forEach((f) => {
    //   group[f.name] = [{ value: f.value ?? '', disabled: false }, []];
    //   if (typeof f.required === 'boolean' && f.required) group[f.name][1].push(Validators.required);
    //   if (f.pattern) group[f.name][1].push(Validators.pattern(f.pattern));
    // });
    this.form = this.fb.group(group);
  }

  // handleDynamicLogic() {
  //   this.form.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
  //     this.fields.forEach((f) => {
  //       const control = this.form.get(f.name);

  //       if (typeof f.disabled === 'function') {
  //         const disabled = f.disabled(value);
  //         disabled ? control?.disable({ emitEvent: false }) : control?.enable({ emitEvent: false });
  //       }

  //       f.visible = typeof f.visible === 'function' ? f.visible(value) : true;

  //       if (typeof f.required === 'function') {
  //         const required = f.required(value);
  //         if (required && !control?.hasValidator(Validators.required))
  //           control?.addValidators(Validators.required);
  //         else if (!required && control?.hasValidator(Validators.required))
  //           control?.removeValidators(Validators.required);
  //         control?.updateValueAndValidity({ emitEvent: false });
  //       }
  //     });
  //     this.cdr.detectChanges();
  //   });
  // }

  // async validateAPI(field: NzFormFieldConfig) {
  //   if (field.apiValidate) {
  //     const isValid = await field.apiValidate(this.form.get(field.name)?.value);
  //     if (!isValid) this.form.get(field.name)?.setErrors({ api: true });
  //   }
  // }

  getFieldsForStep(stepIndex: number) {
    //return this.fields.filter((f) => f.step === stepIndex && f.visible !== false);
    return this.fields;
  }

  onCreate(event: Event): void {
    if (this.form.valid) {
      this.SubmitConfirmDialogConfig.accept = () => {
        this.httpService
          .post(this.module.name, this.form.getRawValue())
          .pipe(take(1))
          .subscribe((response) => {
            this.successSubmit.emit(this.form.value);
          });
      };
      this.SubmitConfirmDialogConfig.cancel = () => {
        return;
      };
      this.SubmitConfirmDialogConfig.confirm?.(event);
    }
  }

  onUpdate(event: Event): void {
    if (this.form.valid) {
      this.SubmitConfirmDialogConfig.accept = () => {
        if (this.data && this.data.id) {
          this.httpService
            .put(this.module.name, this.data.id, this.form.getRawValue())
            .pipe(take(1))
            .subscribe((_response) => {
              this.successSubmit.emit(this.form.value);
            });
        }
      };
      this.SubmitConfirmDialogConfig.cancel = () => {
        return;
      };

      this.SubmitConfirmDialogConfig.confirm?.(event);
    }
  }
}
