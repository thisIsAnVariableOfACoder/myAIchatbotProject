#!/usr/bin/env node
/**
 * Migration script to add username column to users table
 * This fixes the issue where accounts couldn't be reused on login
 */

const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Database path
const dbFolder = path.join(__dirname, '..', 'database');
const DB_PATH = path.join(dbFolder, 'career_advisor.db');

async function migrate() {
  console.log('🔧 Starting migration: Add username column to users table');
  
  const db = new sqlite3.Database(DB_PATH, async (err) => {
    if (err) {
      console.error('❌ Failed to connect to database:', err.message);
      process.exit(1);
    }
    
    try {
      // Check if username column already exists
      db.get("SELECT sql FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
        if (err) {
          console.error('❌ Error checking schema:', err.message);
          process.exit(1);
        }
        
        const hasUsername = row && row.sql && row.sql.includes('username');
        
        if (hasUsername) {
          console.log('✅ Username column already exists');
          process.exit(0);
        }
        
        // Add username column
        console.log('📝 Adding username column...');
        db.run('ALTER TABLE users ADD COLUMN username VARCHAR(255)', (err) => {
          if (err) {
            console.error('❌ Failed to add username column:', err.message);
            process.exit(1);
          }
          
          console.log('✅ Username column added successfully');
          
          // Create index on username
          db.run('CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)', (err) => {
            if (err) {
              console.error('⚠️ Warning: Failed to create username index:', err.message);
            }
            
            console.log('✅ Migration complete!');
            process.exit(0);
          });
        });
      });
    } catch (e) {
      console.error('❌ Migration error:', e.message);
      process.exit(1);
    }
  });
}

migrate();
