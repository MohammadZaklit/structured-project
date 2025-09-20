export interface inputInterface {
  id: string;
  type?: 'email' | 'password' | 'text';
  label: string;
  textstyle?: 'email' | 'password' | 'text-details';
  value?: string;
}
