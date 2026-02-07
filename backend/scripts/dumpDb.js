const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const catalogPath = path.join(__dirname, '../database/career_catalog.db');
const advisorPath = path.join(__dirname, '../database/career_advisor.db');

console.log('🔍 Dumping DB Content...');

function dumpDb(name, path, table, col) {
    const db = new sqlite3.Database(path, sqlite3.OPEN_READONLY);
    console.log(`\n📂 Database: ${name}`);

    db.get(`SELECT COUNT(*) as count FROM ${table}`, (err, row) => {
        if (err) console.error(err);
        console.log(`✅ Total records: ${row?.count}`);
    });

    db.all(`SELECT ${col} as name FROM ${table} LIMIT 5`, (err, rows) => {
        if (err) console.error(err);
        console.log('📋 First 5 records:');
        rows.forEach(r => console.log(`   - ${r.name}`));
    });

    // Check specifically for "Giáo viên Toán STEM"
    db.get(`SELECT COUNT(*) as count FROM ${table} WHERE ${col} LIKE '%Toán STEM%'`, (err, row) => {
        console.log(`⚠️  Found "Toán STEM": ${row?.count}`);
    });
}

dumpDb('Catalog', catalogPath, 'jobs', 'title');
setTimeout(() => dumpDb('Advisor', advisorPath, 'careers', 'name'), 1000);
