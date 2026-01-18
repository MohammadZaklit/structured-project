import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabaseClient: SupabaseClient | null = null;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const authProvider = this.configService.get<string>('authProvider');

    if (authProvider === 'supabase') {
      const supabaseUrl = this.configService.get<string>('supabase.url');
      const supabaseKey = this.configService.get<string>(
        'supabase.serviceRoleKey',
      );

      if (supabaseUrl && supabaseKey) {
        this.supabaseClient = createClient(supabaseUrl, supabaseKey);
        console.log('Supabase client initialized');
      }
    }
  }

  get client(): SupabaseClient | null {
    return this.supabaseClient;
  }

  get isEnabled(): boolean {
    return this.supabaseClient !== null;
  }
}
