import { NzAutoComplete } from '@zak-lib/ui-library/elements/form-fields/autocomplete';
import { NzInput } from '@zak-lib/ui-library/elements/form-fields/input';
import { NzCheckBox } from '@zak-lib/ui-library/elements/form-fields/checkbox';
import { NzDatePicker } from '@zak-lib/ui-library/elements/form-fields/date-picker';
import { NzTextarea } from '@zak-lib/ui-library/elements/form-fields/textarea';
import { NzToggleSwitch } from '@zak-lib/ui-library/elements/form-fields/toggle-switch';
import { NzColorPicker } from '@zak-lib/ui-library/elements/form-fields/color-picker';
import { NzMultiSelect } from '@zak-lib/ui-library/elements/form-fields/multiselect';
import { NzPickList } from '@zak-lib/ui-library/elements/form-fields/picklist';
import { NzRadioButton } from '@zak-lib/ui-library/elements/form-fields/radiobutton';
import { NzListBox } from '@zak-lib/ui-library/elements/form-fields/listbox';
import { NzSlider } from '@zak-lib/ui-library/elements/form-fields/slider';

export type NzFieldComponentType =
  | NzAutoComplete
  | NzInput
  | NzToggleSwitch
  | NzCheckBox
  | NzDatePicker
  | NzTextarea
  | NzColorPicker
  | NzMultiSelect
  | NzPickList
  | NzRadioButton
  | NzListBox
  | NzSlider;

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
  | NzFieldTypeEnum.PickList
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
  PickList = 'PickList',
  FileUploadDragDrop = 'FileUploadDragDrop',
  FileUploadBrowse = 'FileUploadBrowse',
  FormGroup = 'FormGroup',
  FormArray = 'FormArray',
  FormComponent = 'FormComponent',
}

export const isSelectComponent = (type: NzFieldType): boolean => {
  return [
    NzFieldTypeEnum.AutoComplete,
    NzFieldTypeEnum.CascadeSelect,
    NzFieldTypeEnum.Checkbox,
    NzFieldTypeEnum.Listbox,
    NzFieldTypeEnum.MultiSelect,
    NzFieldTypeEnum.PickList,
    NzFieldTypeEnum.TreeSelectDB,
    NzFieldTypeEnum.TreeSelectOptions,
    NzFieldTypeEnum.RadioButtonDB,
    NzFieldTypeEnum.RadioButtonOptions,
  ].includes(type);
};

export const isMultiSelectComponent = (type: NzFieldType): boolean => {
  return [
    NzFieldTypeEnum.CascadeSelect,
    NzFieldTypeEnum.Checkbox,
    NzFieldTypeEnum.Listbox,
    NzFieldTypeEnum.MultiSelect,
    NzFieldTypeEnum.PickList,
    NzFieldTypeEnum.TreeSelectDB,
    NzFieldTypeEnum.TreeSelectOptions,
    NzFieldTypeEnum.RadioButtonDB,
    NzFieldTypeEnum.RadioButtonOptions,
  ].includes(type);
};
