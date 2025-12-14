import { NzAutoComplete } from '@zak-lib/ui-library/elements/form-fields/autocomplete';
import { NzInput } from '@zak-lib/ui-library/elements/form-fields/input';
import { NzCheckBox } from '@zak-lib/ui-library/elements/form-fields/checkbox';
import { NzDatePicker } from '@zak-lib/ui-library/elements/form-fields/date-picker';
import { NzTextarea } from '@zak-lib/ui-library/elements/form-fields/textarea';
import { NzToggleSwitch } from '@zak-lib/ui-library/elements/form-fields/toggle-switch';

export type NzFieldComponentType =
  | NzAutoComplete
  | NzInput
  | NzToggleSwitch
  | NzCheckBox
  | NzDatePicker
  | NzTextarea;

export type NzFieldType =
  | NzFieldTypeEnum.AutoComplete
  | NzFieldTypeEnum.CascadeSelect
  | NzFieldTypeEnum.Checkbox
  | NzFieldTypeEnum.ColorPicker
  | NzFieldTypeEnum.DatePicker
  | NzFieldTypeEnum.FloatLabel
  | NzFieldTypeEnum.IconField
  | NzFieldTypeEnum.InputGroup
  | NzFieldTypeEnum.InputText
  | NzFieldTypeEnum.InputMask
  | NzFieldTypeEnum.InputNumber
  | NzFieldTypeEnum.InputOtp
  | NzFieldTypeEnum.KeyFilter
  | NzFieldTypeEnum.Knob
  | NzFieldTypeEnum.Listbox
  | NzFieldTypeEnum.MultiSelect
  | NzFieldTypeEnum.Password
  | NzFieldTypeEnum.RadioButtonDB
  | NzFieldTypeEnum.RadioButtonOptions
  | NzFieldTypeEnum.Rating
  | NzFieldTypeEnum.SelectButton
  | NzFieldTypeEnum.Slider
  | NzFieldTypeEnum.Textarea
  | NzFieldTypeEnum.ToggleButton
  | NzFieldTypeEnum.ToggleSwitch
  | NzFieldTypeEnum.TreeSelectDB
  | NzFieldTypeEnum.TreeSelectOptions
  | NzFieldTypeEnum.Button
  | NzFieldTypeEnum.SpeedDial
  | NzFieldTypeEnum.SplitButton
  | NzFieldTypeEnum.PickListDB
  | NzFieldTypeEnum.PickListOptions
  | NzFieldTypeEnum.FileUploadDragDrop
  | NzFieldTypeEnum.FileUploadBrowse
  | NzFieldTypeEnum.FormGroup
  | NzFieldTypeEnum.FormArray
  | NzFieldTypeEnum.FormComponent;

export enum NzFieldTypeEnum {
  AutoComplete = 'AutoComplete',
  CascadeSelect = 'CascadeSelect',
  Checkbox = 'Checkbox',
  ColorPicker = 'ColorPicker',
  DatePicker = 'DatePicker',
  FloatLabel = 'FloatLabel',
  IconField = 'IconField',
  InputGroup = 'InputGroup',
  InputText = 'InputText',
  InputMask = 'InputMask',
  InputNumber = 'InputNumber',
  InputOtp = 'InputOtp',
  KeyFilter = 'KeyFilter',
  Knob = 'Knob',
  Listbox = 'Listbox',
  MultiSelect = 'MultiSelect',
  Password = 'Password',
  RadioButtonDB = 'RadioButtonDB',
  RadioButtonOptions = 'RadioButtonOptions',
  Rating = 'Rating',
  SelectButton = 'SelectButton',
  Slider = 'Slider',
  Textarea = 'Textarea',
  ToggleButton = 'ToggleButton',
  ToggleSwitch = 'ToggleSwitch',
  TreeSelectDB = 'TreeSelectDB',
  TreeSelectOptions = 'TreeSelectOptions',
  Button = 'Button',
  SpeedDial = 'SpeedDial',
  SplitButton = 'SplitButton',
  PickListDB = 'PickListDB',
  PickListOptions = 'PickListOptions',
  FileUploadDragDrop = 'FileUploadDragDrop',
  FileUploadBrowse = 'FileUploadBrowse',
  FormGroup = 'FormGroup',
  FormArray = 'FormArray',
  FormComponent = 'FormComponent',
}
