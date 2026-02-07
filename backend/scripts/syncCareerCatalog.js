const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { buildCareerRecords } = require('../data/careerLibrary');

/**
 * Script để đồng bộ dữ liệu từ careers table (career_advisor.db)
 * sang jobs table (career_catalog.db) cho tab Explore
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

async function syncCareerCatalog() {
    console.log('🚀 Starting career catalog sync...');

    // Kết nối đến career_catalog.db
    const catalogDb = new sqlite3.Database(CATALOG_DB_PATH);

    try {
        // 1. Đảm bảo schema tồn tại
        await initCatalogSchema(catalogDb);
        console.log('✅ Catalog schema initialized');

        // 2. Lấy dữ liệu từ career library
        const careers = buildCareerRecords();
        console.log(`📊 Found ${careers.length} careers from library`);

        // 3. Clear existing data (optional - comment out nếu muốn giữ data cũ)
        await clearJobsTable(catalogDb);
        console.log('🗑️  Cleared existing jobs data');

        // 4. Insert careers vào jobs table
        await insertCareersToJobs(catalogDb, careers);
        console.log(`✅ Synced ${careers.length} careers to jobs table`);

        // 5. Verify
        const count = await getJobsCount(catalogDb);
        console.log(`✅ Total jobs in catalog: ${count}`);

        catalogDb.close();
        console.log('🎉 Sync completed successfully!');

    } catch (error) {
        console.error('❌ Error during sync:', error);
        catalogDb.close();
        process.exit(1);
    }
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

function getJobsCount(db) {
    return new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) as count FROM jobs', (err, row) => {
            if (err) return reject(err);
            resolve(row?.count || 0);
        });
    });
}

// Run if called directly
if (require.main === module) {
    syncCareerCatalog()
        .then(() => {
            console.log('✨ All done!');
            process.exit(0);
        })
        .catch((err) => {
            console.error('Fatal error:', err);
            process.exit(1);
        });
}

module.exports = { syncCareerCatalog };
