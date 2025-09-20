export interface typography {
  id: string;
  label: string;
  textstyle?:
    | 'email'
    | 'password'
    | 'h1'
    | 'signin-description'
    | 'display-congrats'
    | 'title'
    | 'subtitle';
}
