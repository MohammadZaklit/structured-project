// run-knex.js

import knex from "knex";
import config from "./db/knexfile.js";
const env = process.env.NODE_ENV || "development";
const db = knex(config[env]);

async function runSeeds() {
  try {
    console.log(`🚀 Running seeds for environment: ${env}`);

    // Run all seeds in your configured directory
    await db.seed.run({
      directory: "./seeds",
      //specific: "03-fields.js",
    });

    console.log("✅ Seeds completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error running seeds:", err);
    process.exit(1);
  }
}

runSeeds();
