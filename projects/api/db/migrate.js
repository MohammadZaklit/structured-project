import db from "./db.js";
const args = process.argv.slice(2); // get CLI args
const command = args[0] || "up"; // default is "up"
var processStartMsg = "🚀 Running migrations on DB...";
var processErrorMsg = "❌ Migration failed:";
console.log(command);
if (command === "rollback") {
  var processStartMsg = "🚀 Running migrations rollback on DB...";
  var processErrorMsg = "❌ Migration rollback failed:";
}

if (command === "rollbackall") {
  var processStartMsg = "🚀 Running migrations rollback all on DB...";
  var processErrorMsg = "❌ Migration rollback all failed:";
}

async function runMigrations() {
  try {
    console.log(processStartMsg);

    if (command === "rollback" || command === "rollbackall") {
      const ifAll = command === "rollbackall" ? true : false;
      const res = await db.migrate.rollback(undefined, ifAll);
      var processDoneMsg = "✅ Migration rollback done successfully";
    } else {
      const [batchNo, log] = await db.migrate.latest();
      var processDoneMsg = `✅ Batch ${batchNo} run: ${log.length} migrations executed.`;
    }

    console.log(processDoneMsg);
  } catch (err) {
    console.error(processErrorMsg, err);
  } finally {
    await db.destroy();
  }
}

runMigrations();
