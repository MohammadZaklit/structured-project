export interface inputInterface {
  id: string;
  type?: 'email' | 'password';
  label: string;
  textstyle?: 'email' | 'password' | 'text-details';
  value?: string;
}
