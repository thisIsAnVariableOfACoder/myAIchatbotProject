const sqlite3 = require('sqlite3').verbose();
const path = require('path');

/**
 * Migration script để thêm tracking fields vào careers table
 */

const DB_PATH = path.join(__dirname, '..', 'database', 'career_advisor.db');

async function migrateDatabase() {
    console.log('🔧 Starting database migration...\n');

    const db = new sqlite3.Database(DB_PATH);

    try {
        // Check if columns already exist
        const hasColumns = await checkTrackingColumns(db);

        if (hasColumns) {
            console.log('✅ Tracking columns already exist. No migration needed.');
            db.close();
            return;
        }

        // Add new columns
        console.log('📝 Adding tracking columns to careers table...');

        await execSql(db, 'ALTER TABLE careers ADD COLUMN question_count INTEGER DEFAULT 0');
        console.log('   ✅ Added question_count');

        await execSql(db, 'ALTER TABLE careers ADD COLUMN answer_count INTEGER DEFAULT 0');
        console.log('   ✅ Added answer_count');

        await execSql(db, 'ALTER TABLE careers ADD COLUMN mention_frequency REAL DEFAULT 0.0');
        console.log('   ✅ Added mention_frequency');

        await execSql(db, 'ALTER TABLE careers ADD COLUMN weighted_score REAL DEFAULT 0.0');
        console.log('   ✅ Added weighted_score');

        // Create indexes
        console.log('\n📝 Creating indexes...');
        await execSql(db, 'CREATE INDEX IF NOT EXISTS idx_careers_category ON careers(category)');
        console.log('   ✅ Created category index');

        await execSql(db, 'CREATE INDEX IF NOT EXISTS idx_careers_frequency ON careers(mention_frequency)');
        console.log('   ✅ Created frequency index');

        console.log('\n🎉 Migration completed successfully!');

        db.close();

    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        db.close();
        process.exit(1);
    }
}

function checkTrackingColumns(db) {
    return new Promise((resolve, reject) => {
        db.all('PRAGMA table_info(careers)', (err, rows) => {
            if (err) return reject(err);
            const hasFrequency = rows.some(r => r.name === 'mention_frequency');
            resolve(hasFrequency);
        });
    });
}

function execSql(db, sql) {
    return new Promise((resolve, reject) => {
        db.run(sql, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}

// Run if called directly
if (require.main === module) {
    migrateDatabase()
        .then(() => {
            console.log('\n✨ Done!');
            process.exit(0);
        })
        .catch((err) => {
            console.error('Fatal error:', err);
            process.exit(1);
        });
}

module.exports = { migrateDatabase };
