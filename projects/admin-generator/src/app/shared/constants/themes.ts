export const THEMES: Record<string, Promise<any>> = {
  default: import('../../themes/default/default.routes'),
  dark: import('../../themes/default/default.routes'),
};
