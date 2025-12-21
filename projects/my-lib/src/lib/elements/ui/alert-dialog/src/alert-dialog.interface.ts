export interface NzAlertDialog {
  title: string;
  message: string;
  type: NzAlertDialogType;
  customData?: Record<string, any>;
}

export type NzAlertDialogType = 'success' | 'warning' | 'error';
