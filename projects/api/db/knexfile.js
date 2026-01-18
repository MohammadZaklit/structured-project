import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env") });

/**
 * @type { Record<string, import("knex").Knex.Config> }
 */
const config = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DEV_DB_HOSTNAME,
      user: process.env.DEV_DB_USERNAME,
      password: process.env.DEV_DB_PASSWORD,
      database: process.env.DEV_DB_DATABASE,
    },
    migrations: {
      directory: path.resolve(__dirname, "../migrations"),
    },
    seeds: {
      directory: path.resolve(__dirname, "../seeds"),
    },
  },

  supabase: {
    client: "pg",
    connection: {
      connectionString: process.env.SUPABASE_SESSION_DB_URL,
      ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync(path.resolve(__dirname, "prod-ca-2021.crt"), "utf8"),
      },
    },
    migrations: {
      directory: path.resolve(__dirname, "../migrations"),
    },
    seeds: {
      directory: path.resolve(__dirname, "../seeds"),
    },
  },

  staging: {
    client: "pg",
    connection: {
      host: process.env.TEST_DB_HOSTNAME,
      user: process.env.TEST_DB_USERNAME,
      password: process.env.TEST_DB_PASSWORD,
      database: process.env.TEST_DB_DATABASE,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: path.resolve(__dirname, "../migrations"),
    },
    seeds: {
      directory: path.resolve(__dirname, "../seeds"),
    },
  },

  production: {
    client: "pg",
    connection: {
      host: process.env.LIVE_DB_HOSTNAME,
      user: process.env.LIVE_DB_USERNAME,
      password: process.env.LIVE_DB_PASSWORD,
      database: process.env.LIVE_DB_DATABASE,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: path.resolve(__dirname, "../migrations"),
    },
    seeds: {
      directory: path.resolve(__dirname, "../seeds"),
    },
  },
};

// Export the config using ESM syntax
export default config;
