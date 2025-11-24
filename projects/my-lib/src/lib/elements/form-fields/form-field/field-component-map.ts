export const NzFormFieldComponents: Record<string, () => Promise<any>> = {
  AutoComplete: () => import('../autocomplete').then((m) => m.NzAutocomplete),
  InputText: () => import('../input').then((m) => m.NzInputComponent),
};
