const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const catalogDbPath = path.join(__dirname, '../database/career_catalog.db');
const advisorDbPath = path.join(__dirname, '../database/career_advisor.db');

console.log('📊 Checking database counts...\n');

// Check career_catalog.db
const catalogDb = new sqlite3.Database(catalogDbPath, (err) => {
    if (err) {
        console.error('❌ Cannot open career_catalog.db:', err.message);
        return;
    }

    catalogDb.get('SELECT COUNT(*) as count FROM jobs', (err, row) => {
        if (err) {
            console.error('❌ Error querying catalog:', err.message);
        } else {
            console.log(`✅ career_catalog.db (jobs table): ${row.count} records`);
        }
        catalogDb.close();
    });
});

// Check career_advisor.db
const advisorDb = new sqlite3.Database(advisorDbPath, (err) => {
    if (err) {
        console.error('❌ Cannot open career_advisor.db:', err.message);
        return;
    }

    advisorDb.get('SELECT COUNT(*) as count FROM careers', (err, row) => {
        if (err) {
            console.error('❌ Error querying advisor:', err.message);
        } else {
            console.log(`✅ career_advisor.db (careers table): ${row.count} records`);
        }

        // Check duplicates
        advisorDb.all(`
      SELECT name, COUNT(*) as count 
      FROM careers 
      GROUP BY name 
      HAVING count > 1
    `, (err, rows) => {
            if (err) {
                console.error('❌ Error checking duplicates:', err.message);
            } else if (rows.length > 0) {
                console.log(`\n⚠️  Found ${rows.length} duplicate careers`);
            } else {
                console.log('\n✅ No duplicates found');
            }
            advisorDb.close();
        });
    });
});
