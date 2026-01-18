import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './shared/database/database.module';
import { AppConfigModule } from './shared/config/config.module';
import { SupabaseModule } from './infrastructure/supabase/supabase.module';
import { MailerModule } from './infrastructure/messaging/mailer.module';
import { StorageModule } from './infrastructure/storage/storage.module';
import { AuthModule } from './modules/auth/auth.module';
import { AccountModule } from './modules/account/account.module';
import { BuilderModule } from './modules/builder/builder.module';
import { CrudModule } from './modules/crud/crud.module';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AppConfigModule,
    DatabaseModule,

    // Infrastructure
    SupabaseModule,
    MailerModule,
    StorageModule,

    // Feature modules
    AuthModule,
    AccountModule,
    BuilderModule,
    CrudModule,
  ],
})
export class AppModule {}
