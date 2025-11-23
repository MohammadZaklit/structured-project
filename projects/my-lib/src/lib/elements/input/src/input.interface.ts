export interface NzInput {
  id: string;
  type?: 'email' | 'password' | 'text';
  label: string;
  textstyle?: 'email' | 'password' | 'text-details';
  value?: string;
}
