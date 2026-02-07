const sqlite3 = require('sqlite3').verbose();
const path = require('path');

console.log('🧹 Cleaning up duplicate careers in advisor DB...\n');

const ADVISOR_DB = path.join(__dirname, '..', 'database', 'career_advisor.db');
const db = new sqlite3.Database(ADVISOR_DB);

// First check counts
db.get('SELECT COUNT(*) as total FROM careers', (err, row) => {
    if (err) {
        console.error('Error:', err.message);
        db.close();
        return;
    }

    const before = row.total;
    console.log(`📊 Before cleanup: ${before} careers`);

    // Remove duplicates - keep the row with lowest ID (first inserted)
    const sql = `
    DELETE FROM careers
    WHERE id NOT IN (
      SELECT MIN(id)
      FROM careers
      GROUP BY name
    )
  `;

    db.run(sql, function (err2) {
        if (err2) {
            console.error('Error removing duplicates:', err2.message);
            db.close();
            return;
        }

        const deleted = this.changes;
        console.log(`🗑️  Removed ${deleted} duplicate entries`);

        // Final count
        db.get('SELECT COUNT(*) as total FROM careers', (err3, row2) => {
            if (!err3) {
                console.log(`📊 After cleanup: ${row2.total} unique careers`);
            }
            db.close();
            console.log('\n✅ Cleanup complete!');
        });
    });
});
