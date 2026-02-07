const sqlite3 = require('sqlite3').verbose();
const path = require('path');

console.log('🔍 Debugging Explore Tab Career Count\n');

const CATALOG_DB_PATH = path.join(__dirname, '..', 'database', 'career_catalog.db');
const catalogDb = new sqlite3.Database(CATALOG_DB_PATH);

catalogDb.get('SELECT COUNT(*) as total FROM jobs', (err, row) => {
    if (err) {
        console.error('Error:', err.message);
        catalogDb.close();
        return;
    }

    console.log(`📊 Total rows in jobs table: ${row.total}`);

    catalogDb.get('SELECT COUNT(DISTINCT title) as unique_titles FROM jobs', (err2, row2) => {
        if (err2) {
            console.error('Error:', err2.message);
            catalogDb.close();
            return;
        }

        console.log(`📊 Unique job titles: ${row2.unique_titles}`);

        // Check for duplicates
        catalogDb.all('SELECT title, COUNT(*) as cnt FROM jobs GROUP BY title HAVING cnt > 1 ORDER BY cnt DESC LIMIT 10', (err3, duplicates) => {
            if (err3) {
                console.error('Error:', err3.message);
                catalogDb.close();
                return;
            }

            if (duplicates && duplicates.length > 0) {
                console.log(`\n⚠️  Found ${duplicates.length} duplicate titles (showing first 10):`);
                duplicates.forEach(d => {
                    console.log(`   - "${d.title}": ${d.cnt} times`);
                });
            } else {
                console.log('\n✅ No duplicates found');
            }

            // Sample data
            catalogDb.all('SELECT id, title, category FROM jobs LIMIT 5', (err4, samples) => {
                if (!err4) {
                    console.log('\n📋 Sample jobs:');
                    samples.forEach(s => {
                        console.log(`   ${s.id}. ${s.title} (${s.category})`);
                    });
                }

                catalogDb.close();
                console.log('\n✨ Debug complete!');
            });
        });
    });
});
