export interface NzBaseInput {
  type?: NzBaseInputType;
}

export type NzBaseInputType = 'text' | 'number' | 'email' | 'password';
