export interface Button {
  id?: string;
  type?: 'button' | 'submit' | 'clear';
  label?: string;
  style?: 'default' | 'primary' | 'secondary' | 'back-button' | 'sign-in' | 'create-card';
  onclick(): void;
  styleClass?: string;
  tooltip?: string;
  disabled?: (rowData: any) => boolean; // Dynamic disable based on row data
  visible?: (rowData: any) => boolean; // Dynamic visibility based on row data
}
