export const FIELD_COMPONENTS: Record<string, () => Promise<any>> = {
  AutoComplete: () => import('../autocomplete').then((m) => m.NzAutocomplete),
};
