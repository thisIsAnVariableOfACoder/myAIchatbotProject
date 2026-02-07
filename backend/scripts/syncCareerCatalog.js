const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { buildCareerRecords } = require('../data/careerLibrary');

/**
 * Script cleaned version - sync từ careerLibrary sang cả 2 databases
 */

const ADVISOR_DB_PATH = path.join(__dirname, '..', 'database', 'career_advisor.db');
const CATALOG_DB_PATH = process.env.CAREER_CATALOG_DB_PATH ||
    path.join(__dirname, '..', 'database', 'career_catalog.db');

const CATEGORY_ICON_MAP = {
    Technology: '/career-icons/tech.svg',
    Data: '/career-icons/tech.svg',
    Business: '/career-icons/business.svg',
    Design: '/career-icons/creative.svg',
    Education: '/career-icons/education.svg',
    Healthcare: '/career-icons/health.svg',
    Engineering: '/career-icons/engineering.svg',
    Media: '/career-icons/creative.svg',
    Finance: '/career-icons/business.svg',
    Marketing: '/career-icons/business.svg',
    Legal: '/career-icons/business.svg',
    Hospitality: '/career-icons/business.svg',
    Logistics: '/career-icons/business.svg',
    Government: '/career-icons/business.svg',
    Science: '/career-icons/engineering.svg',
    Trades: '/career-icons/engineering.svg',
    Agriculture: '/career-icons/engineering.svg',
    RealEstate: '/career-icons/business.svg',
    Retail: '/career-icons/business.svg',
    Beauty: '/career-icons/creative.svg',
    Sports: '/career-icons/health.svg',
    Transportation: '/career-icons/engineering.svg',
    Construction: '/career-icons/engineering.svg',
    Energy: '/career-icons/engineering.svg',
    Research: '/career-icons/engineering.svg'
};

function getIconForCategory(category) {
    return CATEGORY_ICON_MAP[category] || '/career-icons/default.svg';
}

async function fullSync() {
    console.log('🚀 Starting FULL career sync to both databases...\n');

    // 1. Get careers from library
    const careers = buildCareerRecords();
    console.log(`📊 Found ${careers.length} careers from careerLibrary`);

    // 2. Sync to catalog DB (for Explore tab)
    await syncToCatalogDB(careers);

    // 3. Sync to advisor DB (for recommendations)
    await syncToAdvisorDB(careers);

    console.log('\n🎉 Full sync completed!');
}

async function syncToCatalogDB(careers) {
    console.log('\n📝 Syncing to career_catalog.db...');
    const catalogDb = new sqlite3.Database(CATALOG_DB_PATH);

    try {
        await initCatalogSchema(catalogDb);
        await clearJobsTable(catalogDb);
        await insertCareersToJobs(catalogDb, careers);

        const count = await getCount(catalogDb, 'jobs');
        console.log(`✅ Synced ${count} jobs to catalog DB`);

        catalogDb.close();
    } catch (error) {
        console.error('❌ Error syncing to catalog DB:', error.message);
        catalogDb.close();
        throw error;
    }
}

async function syncToAdvisorDB(careers) {
    console.log('\n📝 Syncing to career_advisor.db...');
    const advisorDb = new sqlite3.Database(ADVISOR_DB_PATH);

    try {
        // Remove duplicates first
        await removeDuplicateCareers(advisorDb);

        // Insert careers with INSERT OR IGNORE to avoid duplicates
        const stmt = advisorDb.prepare(
            'INSERT OR IGNORE INTO careers (name, category, required_skills, salary_range, job_outlook, description) VALUES (?, ?, ?, ?, ?, ?)'
        );

        await new Promise((resolve, reject) => {
            advisorDb.serialize(() => {
                for (const c of careers) {
                    stmt.run([
                        c.name,
                        c.category,
                        JSON.stringify(c.required_skills || []),
                        c.salary_range,
                        c.job_outlook,
                        c.description
                    ]);
                }
                stmt.finalize((err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        });

        const count = await getCount(advisorDb, 'careers');
        console.log(`✅ Advisor DB now has ${count} careers`);

        advisorDb.close();
    } catch (error) {
        console.error('❌ Error syncing to advisor DB:', error.message);
        advisorDb.close();
        throw error;
    }
}

async function removeDuplicateCareers(db) {
    return new Promise((resolve, reject) => {
        // Keep only the first occurrence of each career name
        const sql = `
      DELETE FROM careers
      WHERE id NOT IN (
        SELECT MIN(id)
        FROM careers
        GROUP BY name
      )
    `;
        db.run(sql, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}

function initCatalogSchema(db) {
    const schema = `
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT,
      tags TEXT,
      image_url TEXT,
      source TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_jobs_title ON jobs(title);
    CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
  `;

    return new Promise((resolve, reject) => {
        db.exec(schema, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}

function clearJobsTable(db) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM jobs', (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}

function insertCareersToJobs(db, careers) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare(
            'INSERT OR REPLACE INTO jobs (title, category, tags, image_url, source) VALUES (?, ?, ?, ?, ?)'
        );

        db.serialize(() => {
            for (const career of careers) {
                const tags = JSON.stringify(career.required_skills || []);
                const imageUrl = getIconForCategory(career.category);

                stmt.run([
                    career.name,
                    career.category,
                    tags,
                    imageUrl,
                    'careerLibrary'
                ]);
            }

            stmt.finalize((err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    });
}

function getCount(db, table) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT COUNT(*) as count FROM ${table}`, (err, row) => {
            if (err) return reject(err);
            resolve(row?.count || 0);
        });
    });
}

// Run if called directly
if (require.main === module) {
    fullSync()
        .then(() => {
            console.log('\n✨ All done!');
            process.exit(0);
        })
        .catch((err) => {
            console.error('\nFatal error:', err);
            process.exit(1);
        });
}

module.exports = { fullSync };
