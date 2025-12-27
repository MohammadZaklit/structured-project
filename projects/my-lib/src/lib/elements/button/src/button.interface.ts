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
  disabled?: () => boolean; // Dynamic disable based on row data
  visible?: () => boolean;
}
