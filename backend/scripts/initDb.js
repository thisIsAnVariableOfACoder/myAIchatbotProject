const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { initDbIfNeeded } = require('../services/dbInit');

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'database', 'career_advisor.db');
const force = process.argv.includes('--force');

if (force && fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const db = new sqlite3.Database(dbPath, async (err) => {
  if (err) {
    console.error('DB connect error:', err.message);
    process.exit(1);
  }

  try {
    const result = await initDbIfNeeded(db);
    if (result.seeded) {
      console.log('DB initialized and seeded');
    } else {
      console.log('DB already initialized, skip seed');
    }
  } catch (e) {
    console.error('DB init failed:', e.message);
    process.exit(1);
  } finally {
    db.close();
  }
});
