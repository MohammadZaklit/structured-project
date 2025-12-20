import { NZ_BASE_URL_CONFIG } from '../tokens/base.token';

export interface NzBaseConfig {
  apiBaseUrl: string;
}

export function provideNzBaseConfig(config: NzBaseConfig) {
  return [
    {
      provide: NZ_BASE_URL_CONFIG,
      useValue: config.apiBaseUrl,
    },
  ];
}
