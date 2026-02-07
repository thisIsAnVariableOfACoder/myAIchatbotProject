const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database/career_advisor.db');
const db = new sqlite3.Database(dbPath);

console.log('Checking DB at:', dbPath);

db.get('SELECT count(*) as count FROM careers', (err, row) => {
    if (err) {
        console.error('Error:', err.message);
    } else {
        console.log(`Backend DB Count: ${row.count}`);
    }
    db.close();
});
