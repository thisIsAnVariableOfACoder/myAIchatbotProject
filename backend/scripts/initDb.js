const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const {
  createDatabaseAdapter,
  resolveSqliteCloudConnectionString,
  sanitizeConnectionString
} = require('../services/dbAdapter');
const { initDbIfNeeded } = require('../services/dbInit');

const force = process.argv.includes('--force');

if (force) {
  console.warn('⚠️ --force is not supported in ONLINE-only mode. Drop/reset tables directly in SQLiteCloud dashboard if needed.');
}

async function main() {
  try {
    const connectionString = resolveSqliteCloudConnectionString();
    console.log('🌐 Initializing ONLINE database:', sanitizeConnectionString(connectionString));

    const db = await createDatabaseAdapter();
    const result = await initDbIfNeeded(db);
    if (result.seeded) {
      console.log('DB initialized and seeded');
    } else {
      console.log('DB already initialized, skip seed');
    }

    if (typeof db.close === 'function') {
      db.close(() => {});
    }
  } catch (e) {
    console.error('DB init failed:', e.message);
    process.exit(1);
  }
}

main();
