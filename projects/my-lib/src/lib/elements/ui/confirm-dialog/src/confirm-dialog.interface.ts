export interface ConfirmDialogConfig {
  title: string;
  message: string;
  confirm?(event: Event): void;
  cancel?(): void;
  accept?(): void;
}
