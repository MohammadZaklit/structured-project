export const NzFormFieldComponents: Record<string, () => Promise<any>> = {
  AutoComplete: () => import('../autocomplete').then((m) => m.NzAutocomplete),
  InputText: () => import('../input').then((m) => m.NzInputComponent),
  ToggleSwitch: () => import('../toggle-switch').then((m) => m.NzToggleSwitchComponent),
  MultiSelect: () => import('../multiselect').then((m) => m.NzMultiSelectComponent),
  DatePicker: () => import('../date-picker').then((m) => m.NzDatePickerComponent),
  CheckBox: () => import('../checkbox').then((m) => m.NzCheckBoxComponent),
  TextArea: () => import('../textarea').then((m) => m.NzTextAreaComponent),
  ColorPicker: () => import('../color-picker').then((m) => m.NzColorPickerComponent),
  PickList: () => import('../picklist').then((m) => m.NzPickListComponent),
  FileUploader: () => import('../fileuploader').then((m) => m.NzUploadFileComponent),
  RadioButton: () => import('../radiobutton').then((m) => m.NzRadioButtonComponent),
  listbox: () => import('../listbox').then((m) => m.NzListboxComponent),
};
