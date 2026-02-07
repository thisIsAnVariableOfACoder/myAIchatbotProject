const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const advisorDbPath = path.join(__dirname, '../database/career_advisor.db');
const { buildCareerRecords } = require('../data/careerLibrary');

console.log('🧹 Cleaning up career_advisor.db to match careerLibrary...\n');

const db = new sqlite3.Database(advisorDbPath, (err) => {
    if (err) {
        console.error('❌ Cannot open database:', err.message);
        process.exit(1);
    }
});

const careers = buildCareerRecords();
console.log(`📊 Career library has ${careers.length} careers\n`);

// Clear existing careers
db.run('DELETE FROM careers', (err) => {
    if (err) {
        console.error('❌ Error clearing careers:', err.message);
        db.close();
        process.exit(1);
    }

    console.log('✅ Cleared existing careers');

    // Insert new careers
    const stmt = db.prepare(`
    INSERT INTO careers (name, category, required_skills, salary_range, job_outlook, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

    let inserted = 0;
    for (const career of careers) {
        stmt.run(
            career.name,
            career.category,
            JSON.stringify(career.required_skills || []),
            career.salary_range || 'Negotiable',
            career.job_outlook || 'good',
            career.description || ''
        );
        inserted++;
    }

    stmt.finalize(() => {
        db.get('SELECT COUNT(*) as count FROM careers', (err, row) => {
            if (err) {
                console.error('❌ Error counting:', err.message);
            } else {
                console.log(`✅ Inserted ${inserted} careers`);
                console.log(`✅ Final count: ${row.count} careers`);
            }
            db.close();
        });
    });
});
