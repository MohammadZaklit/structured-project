export const NzFormFieldComponents: Record<string, () => Promise<any>> = {
  AutoComplete: () => import('../autocomplete').then((m) => m.NzAutocomplete),
  InputText: () => import('../input').then((m) => m.NzInputComponent),
  ToggleSwitch: () => import('../toggle-switch').then((m) => m.NzToggleSwitchComponent),
  MultiSelect: () => import('../multiselect').then((m) => m.NzMultiSelectComponent),
  DatePicker: () => import('../date-picker').then((m) => m.NzDatePickerComponent),
  CheckBox: () => import('../checkbox').then((m) => m.NzCheckBoxComponent),
  TextArea: () => import('../textarea').then((m) => m.NzTextAreaComponent),
  ColorPicker: () => import('../color-picker').then((m) => m.NzColorPickerComponent),
};
