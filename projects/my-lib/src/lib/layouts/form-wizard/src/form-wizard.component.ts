import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  inject,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StepperModule } from 'primeng/stepper';
import { NzStepConfig, NzStepperConfig } from './form-wizard.interface';
import {
  DIALOG_MESSAGES,
  NzFormGroup,
  NzGenericRecord,
  NzHttpService,
  NzModuleConfig,
  NzUiTypeEnum,
} from '@zak-lib/ui-library/shared';
import { NzConfirmDialogService } from '@zak-lib/ui-library/elements/ui/confirm-dialog';
import { FluidModule } from 'primeng/fluid';
import { NzFormFieldRendererComponent } from '@zak-lib/ui-library/elements/form-fields/form-field';
import { take } from 'rxjs';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'nz-form-wizard',
  standalone: true,
  imports: [
    CommonModule,
    StepperModule,
    ReactiveFormsModule,
    FluidModule,
    ButtonModule,
    NzFormFieldRendererComponent,
  ],
  templateUrl: './form-wizard.component.html',
  styleUrls: ['./form-wizard.component.scss'],
})
export class NzFormWizardComponent implements OnInit, OnChanges {
  @Input({ required: true }) form!: NzFormGroup;
  @Input({ required: true }) stepperConfig!: NzStepperConfig;
  @Input({ required: true }) module!: NzModuleConfig;
  @Input() public data?: NzGenericRecord;
  @Output() successSubmit = new EventEmitter<any>();
  private httpService = inject(NzHttpService);
  private confirmDialogService = inject(NzConfirmDialogService);
  activeStep = 0;
  public isEdit = false;
  uiTypes = NzUiTypeEnum;

  constructor() {}

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
    this.buildForm();
    //this.handleDynamicLogic();
  }

  get steps(): NzStepConfig[] {
    return this.stepperConfig?.steps;
  }

  private fillForm(data: NzGenericRecord): void {
    this.form.patchValue(data);
  }

  buildForm() {
    //const group: any = {};
    // this.fields.forEach((f) => {
    //   group[f.name] = [{ value: f.value ?? '', disabled: false }, []];
    //   if (typeof f.required === 'boolean' && f.required) group[f.name][1].push(Validators.required);
    //   if (f.pattern) group[f.name][1].push(Validators.pattern(f.pattern));
    // });
    // this.form = this.fb.group(group);
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
    return this.steps[stepIndex].components;
  }

  save(event: Event): void {
    if (this.form.valid) {
      this.confirmDialogService.open(event, {
        title: DIALOG_MESSAGES.CONFIRM.TITLE,
        message: DIALOG_MESSAGES.CONFIRM.MESSAGE,
        accept: () => {
          if (this.data && this.data.id) {
            this.httpService
              .put(this.module.name, this.data.id, this.form.getRawValue())
              .pipe(take(1))
              .subscribe((_response) => {
                this.successSubmit.emit(this.form.value);
              });
          } else {
            this.httpService
              .post(this.module.name, this.form.getRawValue())
              .pipe(take(1))
              .subscribe((_response) => {
                this.successSubmit.emit(this.form.value);
              });
          }
        },
        cancel: () => {
          return;
        },
      });
    }
  }
}
