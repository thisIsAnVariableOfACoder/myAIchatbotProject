/**
 * Migration Script: Add username column to users table
 * Run this script to update existing databases
 */

const db = require('../database/connection');

async function migrate() {
  console.log('Starting migration: Add username column to users table...');
  
  return new Promise((resolve, reject) => {
    // Check if username column exists
    db.get("SELECT sql FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
      if (err) {
        console.error('Error checking users table:', err.message);
        return reject(err);
      }
      
      console.log('Current users table schema:', row?.sql);
      
      if (row?.sql?.includes('username')) {
        console.log('Username column already exists. Skipping migration.');
        return resolve(true);
      }
      
      // Add username column
      const alterQuery = `ALTER TABLE users ADD COLUMN username VARCHAR(100)`;
      db.run(alterQuery, (err) => {
        if (err) {
          console.error('Error adding username column:', err.message);
          return reject(err);
        }
        
        console.log('Username column added successfully.');
        
        // Create index for username
        const createIndex = `CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`;
        db.run(createIndex, (err) => {
          if (err) {
            console.error('Error creating username index:', err.message);
            // Continue anyway, the column was added
          }
          console.log('Username index created.');
          resolve(true);
        });
      });
    });
  });
}

// Run migration
migrate()
  .then(() => {
    console.log('Migration completed successfully.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Migration failed:', err.message);
    process.exit(1);
  });
