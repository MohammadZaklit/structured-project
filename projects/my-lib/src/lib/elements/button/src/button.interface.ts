export interface Button {
  id?: string;
  type?: 'button' | 'submit' | 'clear';
  label?: string;
  style?: 'default' | 'primary' | 'secondary' | 'back-button';
  onclick(): void;
}
