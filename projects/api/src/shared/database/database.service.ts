import { Injectable, OnModuleDestroy } from '@nestjs/common';
import knex, { Knex } from 'knex';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly knexInstance: Knex;

  constructor() {
    const env = process.env['NODE_ENV'] || 'development';
    const config = this.getConfig();
    this.knexInstance = knex(config[env]);
    console.log(`Database connected with environment: ${env}`);
  }

  private getConfig(): Record<string, Knex.Config> {
    return {
      development: {
        client: 'mysql2',
        connection: {
          host: process.env['DEV_DB_HOSTNAME'],
          user: process.env['DEV_DB_USERNAME'],
          password: process.env['DEV_DB_PASSWORD'],
          database: process.env['DEV_DB_DATABASE'],
        },
        migrations: {
          directory: './projects/api/migrations',
        },
        seeds: {
          directory: './projects/api/seeds',
        },
      },

      supabase: {
        client: 'pg',
        connection: {
          connectionString: process.env['SUPABASE_SESSION_DB_URL'],
          ssl: {
            rejectUnauthorized: true,
            ca: fs.readFileSync(path.resolve('projects/api/db/prod-ca-2021.crt'), 'utf8'),
          },
        },
        migrations: {
          directory: './projects/api/migrations',
        },
        seeds: {
          directory: './projects/api/seeds',
        },
      },

      staging: {
        client: 'pg',
        connection: {
          host: process.env['TEST_DB_HOSTNAME'],
          user: process.env['TEST_DB_USERNAME'],
          password: process.env['TEST_DB_PASSWORD'],
          database: process.env['TEST_DB_DATABASE'],
        },
        pool: {
          min: 2,
          max: 10,
        },
        migrations: {
          directory: './projects/api/migrations',
        },
        seeds: {
          directory: './projects/api/seeds',
        },
      },

      production: {
        client: 'pg',
        connection: {
          host: process.env['LIVE_DB_HOSTNAME'],
          user: process.env['LIVE_DB_USERNAME'],
          password: process.env['LIVE_DB_PASSWORD'],
          database: process.env['LIVE_DB_DATABASE'],
        },
        pool: {
          min: 2,
          max: 10,
        },
        migrations: {
          directory: './projects/api/migrations',
        },
        seeds: {
          directory: './projects/api/seeds',
        },
      },
    };
  }

  get db(): Knex {
    return this.knexInstance;
  }

  async onModuleDestroy() {
    await this.knexInstance.destroy();
  }
}
