export interface NzTypography {
  id: string;
  label: string;
  style: NzTypographyStyle;
  looksLike?: NzTypographyStyle;
}

export type NzTypographyStyle = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'small' | 'span';
