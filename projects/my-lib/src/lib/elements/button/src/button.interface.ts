export interface NzButton {
  id?: string;
  type?: 'button' | 'submit' | 'clear';
  label?: string;
  style?: 'default' | 'primary' | 'secondary' | 'back-button' | 'sign-in' | 'create-card';
  onclick(data?: any): void;
  styleClass?: string;
  tooltip?: string;
  icon?: string;
  isFullWidth?: boolean;
  disabled?: (rowData?: Record<string, any>) => boolean; // Dynamic disable based on row data
  visible?: (rowData?: Record<string, any>) => boolean; // Dynamic disable based on row data
}
