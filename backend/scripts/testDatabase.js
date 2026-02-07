const sqlite3 = require('sqlite3').verbose();
const path = require('path');

console.log('🔍 Testing Database Schema Changes\n');

// Test 1: Check careers table schema
const advisorDb = new sqlite3.Database(path.join(__dirname, '..', 'database', 'career_advisor.db'));

advisorDb.all('PRAGMA table_info(careers)', (err, rows) => {
    if (err) {
        console.error('❌ Error checking careers table:', err.message);
        return;
    }

    console.log('✅ Careers table columns:');
    rows.forEach(col => {
        console.log(`   - ${col.name} (${col.type})`);
    });

    // Check for new tracking fields
    const hasTracking = rows.some(c => c.name === 'mention_frequency');
    if (hasTracking) {
        console.log('\n✅ Tracking fields found!');
    } else {
        console.log('\n⚠️  Warning: Tracking fields not found. Database may need migration.');
    }

    // Test 2: Count careers
    advisorDb.get('SELECT COUNT(*) as count FROM careers', (err2, row) => {
        if (err2) {
            console.error('❌ Error counting careers:', err2.message);
        } else {
            console.log(`\n📊 Total careers in advisor DB: ${row.count}`);
        }

        advisorDb.close();

        // Test 3: Check catalog DB
        const catalogDb = new sqlite3.Database(path.join(__dirname, '..', 'database', 'career_catalog.db'));

        catalogDb.get('SELECT COUNT(*) as count FROM jobs', (err3, row2) => {
            if (err3) {
                console.error('❌ Error checking catalog DB:', err3.message);
                catalogDb.close();
                return;
            }

            console.log(`\n📊 Total jobs in catalog: ${row2.count}`);

            catalogDb.all('SELECT DISTINCT category FROM jobs ORDER BY category LIMIT 15', (err4, categories) => {
                if (err4) {
                    console.error('❌ Error fetching categories:', err4.message);
                } else {
                    console.log('\n📂 Sample categories:');
                    categories.forEach(c => {
                        console.log(`   - ${c.category}`);
                    });
                }

                catalogDb.close();
                console.log('\n✨ Database verification complete!');
            });
        });
    });
});
