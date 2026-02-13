const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { buildCareerRecords } = require('../data/careerLibrary');
const { ADMIN_EMAIL, ADMIN_PASSWORD } = require('../config');

const CATEGORY_ICON_MAP = {
  Technology: '/career-icons/tech.svg',
  Data: '/career-icons/tech.svg',
  Business: '/career-icons/business.svg',
  Marketing: '/career-icons/business.svg',
  Finance: '/career-icons/business.svg',
  Banking: '/career-icons/business.svg',
  Insurance: '/career-icons/business.svg',
  HumanResources: '/career-icons/business.svg',
  CustomerService: '/career-icons/service.svg',
  Design: '/career-icons/creative.svg',
  Media: '/career-icons/creative.svg',
  Education: '/career-icons/education.svg',
  Healthcare: '/career-icons/health.svg',
  Engineering: '/career-icons/engineering.svg',
  Legal: '/career-icons/legal.svg',
  Hospitality: '/career-icons/hospitality.svg',
  Logistics: '/career-icons/transport.svg',
  Government: '/career-icons/admin.svg',
  PublicService: '/career-icons/community.svg',
  CivilService: '/career-icons/admin.svg',
  Science: '/career-icons/science.svg',
  Trades: '/career-icons/industry.svg',
  Agriculture: '/career-icons/agri.svg',
  RealEstate: '/career-icons/business.svg',
  Retail: '/career-icons/business.svg',
  Beauty: '/career-icons/creative.svg',
  Sports: '/career-icons/health.svg',
  Transportation: '/career-icons/transport.svg',
  Construction: '/career-icons/construction.svg',
  Manufacturing: '/career-icons/industry.svg',
  Environment: '/career-icons/community.svg',
  Administration: '/career-icons/admin.svg',
  SecurityDefense: '/career-icons/security.svg',
  ECommerce: '/career-icons/business.svg',
  Product: '/career-icons/management.svg',
  Consulting: '/career-icons/management.svg',
  InternationalBusiness: '/career-icons/business.svg'
};

const JOBS_SCHEMA_SQL = `
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

function getIconForCategory(category) {
  return CATEGORY_ICON_MAP[String(category || '').trim()] || '/career-icons/default.svg';
}

function execSql(db, sql) {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => (err ? reject(err) : resolve()));
  });
}

function runSql(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err) => (err ? reject(err) : resolve()));
  });
}

function clampBatchSize(value, fallback = 500) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(50, Math.min(2000, Math.floor(n)));
}

async function upsertInBatches({ db, rows, query, mapParams, batchSize, onProgress, tableName }) {
  const expected = rows.length;
  if (!expected) return;

  for (let index = 0; index < expected; index += batchSize) {
    const batch = rows.slice(index, index + batchSize);
    await execSql(db, 'BEGIN TRANSACTION');
    try {
      for (const row of batch) {
        await runSql(db, query, mapParams(row));
      }
      await execSql(db, 'COMMIT');
    } catch (error) {
      await execSql(db, 'ROLLBACK').catch(() => {});
      throw error;
    }

    if (typeof onProgress === 'function') {
      onProgress({
        table: tableName,
        processed: Math.min(expected, index + batch.length),
        expected
      });
    }
  }
}

async function ensureJobsTable(db) {
  await execSql(db, JOBS_SCHEMA_SQL);
}

function getCount(db, table) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT COUNT(*) as count FROM ${table}`, (err, row) => {
      if (err) reject(err);
      else resolve(row?.count || 0);
    });
  });
}

async function initDbIfNeeded(db) {
  const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
  const seedPath = path.join(__dirname, '..', 'database', 'seed.sql');

  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Missing schema file: ${schemaPath}`);
  }
  if (!fs.existsSync(seedPath)) {
    throw new Error(`Missing seed file: ${seedPath}`);
  }

  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  const seedSql = fs.readFileSync(seedPath, 'utf8');

  await execSql(db, schemaSql);
  
  // Run migrations after schema is applied (for existing databases)
  await runMigrations(db);

  const careerSyncResult = await seedCareerLibrary(db);
  if (careerSyncResult?.synced) {
    console.log(`📌 Synced careers: ${careerSyncResult.total}/${careerSyncResult.expected}`);
  }

  // Keep Explore catalog in sync with careerLibrary (including generated large dataset).
  const jobsSyncResult = await syncJobsFromCareerLibrary(db);
  if (jobsSyncResult?.synced) {
    console.log(`📚 Synced jobs catalog: ${jobsSyncResult.total}/${jobsSyncResult.expected}`);
  }

  const userCount = await getCount(db, 'users');
  let seeded = false;
  if (userCount === 0) {
    await execSql(db, seedSql);
    seeded = true;
  }

  await ensureAdminAccount(db);
  return { seeded, userCount };
}

async function seedCareerLibrary(db, options = {}) {
  const force = Boolean(options.force);
  const onProgress = options.onProgress;
  const batchSize = clampBatchSize(options.batchSize, 500);
  const careers = buildCareerRecords();
  const currentCount = await getCount(db, 'careers').catch(() => 0);
  const expected = careers.length;

  if (!force && currentCount >= Math.floor(expected * 0.98)) {
    return { synced: false, total: currentCount, expected };
  }

  const query = `
    INSERT INTO careers (name, category, required_skills, salary_range, job_outlook, description)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(name) DO UPDATE SET
      category = excluded.category,
      required_skills = excluded.required_skills,
      salary_range = excluded.salary_range,
      job_outlook = excluded.job_outlook,
      description = excluded.description
  `;

  await upsertInBatches({
    db,
    rows: careers,
    query,
    batchSize,
    onProgress,
    tableName: 'careers',
    mapParams: (c) => [
      c.name,
      c.category,
      JSON.stringify(c.required_skills || []),
      c.salary_range,
      c.job_outlook,
      c.description
    ]
  });

  const total = await getCount(db, 'careers').catch(() => expected);
  return { synced: true, total, expected };
}

async function syncJobsFromCareerLibrary(db, options = {}) {
  const force = Boolean(options.force);
  const onProgress = options.onProgress;
  const batchSize = clampBatchSize(options.batchSize, 500);

  await ensureJobsTable(db);

  const careers = buildCareerRecords();
  const expected = careers.length;
  const currentCount = await getCount(db, 'jobs').catch(() => 0);

  if (!force && currentCount >= Math.floor(expected * 0.98)) {
    return { synced: false, total: currentCount, expected };
  }

  const query = `
    INSERT INTO jobs (title, category, tags, image_url, source)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(title) DO UPDATE SET
      category = excluded.category,
      tags = excluded.tags,
      image_url = excluded.image_url,
      source = excluded.source
  `;

  await upsertInBatches({
    db,
    rows: careers,
    query,
    batchSize,
    onProgress,
    tableName: 'jobs',
    mapParams: (c) => [
      c.name,
      c.category,
      JSON.stringify(c.required_skills || []),
      getIconForCategory(c.category),
      'careerLibrary'
    ]
  });

  const total = await getCount(db, 'jobs').catch(() => expected);
  return { synced: true, total, expected };
}

async function syncCareersFromCareerLibrary(db, options = {}) {
  return seedCareerLibrary(db, options);
}

async function runMigrations(db) {
  console.log('🔧 Running migrations...');
  
  // Migration: Add username column to users table
  // Check if username column exists using PRAGMA table_info
  const columnInfo = await new Promise((resolve, reject) => {
    db.all("PRAGMA table_info(users)", (err, rows) => {
      if (err) return reject(err);
      resolve(rows || []);
    });
  });
  
  const hasUsername = columnInfo.some(col => col.name === 'username');
  
  if (hasUsername) {
    console.log('✅ Username column already exists');
  } else {
    console.log('📝 Adding username column to users table...');
    await new Promise((resolve, reject) => {
      db.run('ALTER TABLE users ADD COLUMN username VARCHAR(100)', (err) => {
        if (err) return reject(err);
        
        db.run('CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)', (err) => {
          if (err) console.warn('⚠️ Warning: Failed to create username index:', err.message);
          console.log('✅ Username column added successfully');
          resolve();
        });
      });
    });
  }
  
  // Migration: Add last_login column if not exists
  const hasLastLogin = columnInfo.some(col => col.name === 'last_login');
  if (!hasLastLogin) {
    console.log('📝 Adding last_login column to users table...');
    await new Promise((resolve, reject) => {
      db.run('ALTER TABLE users ADD COLUMN last_login DATETIME', (err) => {
        if (err) return reject(err);
        console.log('✅ last_login column added successfully');
        resolve();
      });
    });
  }
  
  console.log('✅ Migrations complete');
}

async function ensureAdminAccount(db) {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return;

  const dbGet = (sql, params = []) => new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });

  const dbRun = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
  
  // Check if username column exists
  const columnInfo = await new Promise((resolve, reject) => {
    db.all("PRAGMA table_info(users)", (err, rows) => {
      if (err) return reject(err);
      resolve(rows || []);
    });
  });
  
  const hasUsername = columnInfo.some(col => col.name === 'username');
  
  await dbRun(
    "UPDATE users SET user_type = 'professional' WHERE user_type = 'admin' AND email != ?",
    [ADMIN_EMAIL]
  );
  
  let admin = null;
  try {
    admin = await dbGet('SELECT id FROM users WHERE email = ?', [ADMIN_EMAIL]);
  } catch {
    admin = null;
  }

  // If target admin email not found but username "admin" exists (e.g. seeded data), reuse that row.
  if (!admin && hasUsername) {
    try {
      const byUsername = await dbGet('SELECT id FROM users WHERE username = ?', ['admin']);
      if (byUsername?.id) {
        admin = { id: byUsername.id };
      }
    } catch {
      // ignore and continue with insert path
    }
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  
  if (!admin) {
    if (hasUsername) {
      await dbRun(
        'INSERT INTO users (email, username, password_hash, user_type) VALUES (?, ?, ?, ?)',
        [ADMIN_EMAIL, 'admin', passwordHash, 'admin']
      );
    } else {
      await dbRun(
        'INSERT INTO users (email, password_hash, user_type) VALUES (?, ?, ?)',
        [ADMIN_EMAIL, passwordHash, 'admin']
      );
    }
    return;
  }

  if (hasUsername) {
    await dbRun(
      'UPDATE users SET email = ?, password_hash = ?, user_type = ?, username = ? WHERE id = ?',
      [ADMIN_EMAIL, passwordHash, 'admin', 'admin', admin.id]
    );
  } else {
    await dbRun(
      'UPDATE users SET email = ?, password_hash = ?, user_type = ? WHERE id = ?',
      [ADMIN_EMAIL, passwordHash, 'admin', admin.id]
    );
  }
}

module.exports = { initDbIfNeeded, syncJobsFromCareerLibrary, syncCareersFromCareerLibrary };
