import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'projects/api/.env',
      load: [configuration],
      isGlobal: true,
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class AppConfigModule {}
