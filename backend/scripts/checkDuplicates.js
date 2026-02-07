const sqlite3 = require('sqlite3').verbose();
const path = require('path');

console.log('🔍 Checking for duplicates in career_advisor.db\n');

const ADVISOR_DB = path.join(__dirname, '..', 'database', 'career_advisor.db');
const db = new sqlite3.Database(ADVISOR_DB);

db.get('SELECT COUNT(*) as total FROM careers', (err, row) => {
    if (err) {
        console.error('Error:', err.message);
        db.close();
        return;
    }

    console.log(`📊 Total careers in advisor DB: ${row.total}`);

    db.get('SELECT COUNT(DISTINCT name) as unique_names FROM careers', (err2, row2) => {
        if (err2) {
            console.error('Error:', err2.message);
            db.close();
            return;
        }

        console.log(`📊 Unique career names: ${row2.unique_names}`);

        const diff = row.total - row2.unique_names;
        if (diff > 0) {
            console.log(`⚠️  Found ${diff} duplicate entries!\n`);

            // Show duplicates
            db.all(
                'SELECT name, COUNT(*) as cnt FROM careers GROUP BY name HAVING cnt > 1 ORDER BY cnt DESC',
                (err3, dups) => {
                    if (!err3 && dups.length > 0) {
                        console.log(`📋 Duplicate careers (showing first 20):`);
                        dups.slice(0, 20).forEach(d => {
                            console.log(`   - "${d.name}": ${d.cnt} times`);
                        });
                    }

                    db.close();
                    console.log('\n✨ Done!');
                }
            );
        } else {
            console.log('✅ No duplicates found in advisor DB');
            db.close();
        }
    });
});
