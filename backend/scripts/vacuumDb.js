const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const catalogPath = path.join(__dirname, '../database/career_catalog.db');
const advisorPath = path.join(__dirname, '../database/career_advisor.db');

function vacuum(name, dbPath) {
    const db = new sqlite3.Database(dbPath);
    console.log(`Vacuuming ${name}...`);
    db.run('VACUUM;', (err) => {
        if (err) console.error(err);
        else console.log(`✅ ${name} vacuumed.`);
        db.close();
    });
}

vacuum('Catalog DB', catalogPath);
vacuum('Advisor DB', advisorPath);
