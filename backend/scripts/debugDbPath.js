const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { buildCareerRecords } = require('../data/careerLibrary');

// Check if env var is set
const envDbPath = process.env.CAREER_CATALOG_DB_PATH;
const defaultDbPath = path.join(__dirname, '../database/career_catalog.db');
const dbPath = envDbPath || defaultDbPath;

console.log('🔍 Debugging DB Path...');
console.log(`Msg from script: Env var CAREER_CATALOG_DB_PATH is: ${envDbPath}`);
console.log(`Msg from script: Using DB Path: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Cannot open DB:', err.message);
        return;
    }

    db.get('SELECT COUNT(*) as count FROM jobs', (err, row) => {
        if (err) {
            console.error('❌ Error querying jobs:', err.message);
        } else {
            console.log(`✅ Job count in this DB: ${row.count}`);
        }

        // Check for specific role
        db.get('SELECT * FROM jobs WHERE title LIKE "%Toán STEM%"', (err, row) => {
            if (row) {
                console.log('⚠️ Found "Giáo viên Toán STEM" in this DB!');
            } else {
                console.log('✅ "Giáo viên Toán STEM" NOT found in this DB.');
            }
            db.close();
        });
    });
});
