/**
 * Migration Script: Add username column to users table
 * Run this script to update existing databases
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'database', 'career_advisor.db');

async function migrate() {
  console.log('Starting migration: Add username column to users table...');
  
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, async (err) => {
      if (err) {
        console.error('DB connect error:', err.message);
        return reject(err);
      }
      
      console.log('DB connected');
      
      try {
        // Check if username column exists
        const columnInfo = await new Promise((resolve, reject) => {
          db.all("PRAGMA table_info(users)", (err, rows) => {
            if (err) return reject(err);
            resolve(rows || []);
          });
        });
        
        const hasUsername = columnInfo.some(col => col.name === 'username');
        const hasLastLogin = columnInfo.some(col => col.name === 'last_login');
        
        if (hasUsername) {
          console.log('✅ Username column already exists');
        } else {
          console.log('📝 Adding username column...');
          await new Promise((resolve, reject) => {
            db.run('ALTER TABLE users ADD COLUMN username VARCHAR(100)', (err) => {
              if (err) return reject(err);
              
              db.run('CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)', (err) => {
                if (err) console.warn('⚠️ Warning: Failed to create username index:', err.message);
                console.log('✅ Username column added successfully');
                resolve();
              });
            });
          });
        }
        
        if (!hasLastLogin) {
          console.log('📝 Adding last_login column...');
          await new Promise((resolve, reject) => {
            db.run('ALTER TABLE users ADD COLUMN last_login DATETIME', (err) => {
              if (err) return reject(err);
              console.log('✅ last_login column added successfully');
              resolve();
            });
          });
        }
        
        console.log('✅ Migration completed successfully.');
        resolve(true);
      } catch (e) {
        console.error('Migration error:', e.message);
        reject(e);
      } finally {
        db.close();
      }
    });
  });
}

// Run migration
migrate()
  .then(() => {
    console.log('Done.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Migration failed:', err.message);
    process.exit(1);
  });
