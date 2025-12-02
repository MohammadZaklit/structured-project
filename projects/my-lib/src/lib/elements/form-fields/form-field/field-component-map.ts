export const NzFormFieldComponents: Record<string, () => Promise<any>> = {
  AutoComplete: () => import('../autocomplete').then((m) => m.NzAutocomplete),
  InputText: () => import('../input').then((m) => m.NzInputComponent),
  ToggleSwitch: () => import('../toggle-switch').then((m) => m.NzToggleSwitchComponent),
};
