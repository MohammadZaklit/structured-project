export default () => ({
  port: parseInt(process.env['PORT'] || '3000', 10),
  nodeEnv: process.env['NODE_ENV'] || 'development',

  jwt: {
    secret: process.env['JWT_SECRET'],
    expiresIn: '7d',
  },

  authProvider: process.env['AUTH_PROVIDER'] || 'custom',

  supabase: {
    url: process.env['SUPABASE_URL'],
    serviceRoleKey: process.env['SUPABASE_SERVICE_ROLE_KEY'],
    sessionDbUrl: process.env['SUPABASE_SESSION_DB_URL'],
  },

  app: {
    url: process.env['APP_URL'],
  },

  mailer: {
    host: process.env['MAILER_SMTP_HOST'],
    port: parseInt(process.env['MAILER_SMTP_PORT'] || '587', 10),
    user: process.env['MAILER_SMTP_USER'],
    pass: process.env['MAILER_SMTP_PASS'],
    from: process.env['MAILER_SMTP_FROM'],
  },

  database: {
    dev: {
      hostname: process.env['DEV_DB_HOSTNAME'],
      username: process.env['DEV_DB_USERNAME'],
      password: process.env['DEV_DB_PASSWORD'],
      database: process.env['DEV_DB_DATABASE'],
    },
    test: {
      hostname: process.env['TEST_DB_HOSTNAME'],
      username: process.env['TEST_DB_USERNAME'],
      password: process.env['TEST_DB_PASSWORD'],
      database: process.env['TEST_DB_DATABASE'],
    },
    live: {
      hostname: process.env['LIVE_DB_HOSTNAME'],
      username: process.env['LIVE_DB_USERNAME'],
      password: process.env['LIVE_DB_PASSWORD'],
      database: process.env['LIVE_DB_DATABASE'],
    },
  },
});
