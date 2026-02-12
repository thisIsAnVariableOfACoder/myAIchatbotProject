const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { buildCareerRecords } = require('../data/careerLibrary');
const { ADMIN_EMAIL, ADMIN_PASSWORD } = require('../config');

function execSql(db, sql) {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => (err ? reject(err) : resolve()));
  });
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
  
  // Run migrations before seeding
  await runMigrations(db);

  await seedCareerLibrary(db);

  const userCount = await getCount(db, 'users');
  let seeded = false;
  if (userCount === 0) {
    await execSql(db, seedSql);
    seeded = true;
  }

  await ensureAdminAccount(db);
  return { seeded, userCount };
}

async function seedCareerLibrary(db) {
  const careers = buildCareerRecords();
  const stmt = db.prepare(
    'INSERT OR IGNORE INTO careers (name, category, required_skills, salary_range, job_outlook, description) VALUES (?, ?, ?, ?, ?, ?)'
  );
  await new Promise((resolve, reject) => {
    db.serialize(() => {
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
      stmt.finalize((err) => (err ? reject(err) : resolve()));
    });
  });
}

async function runMigrations(db) {
  console.log('🔧 Running migrations...');
  
  // Migration: Add username column to users table
  await new Promise((resolve, reject) => {
    db.get("SELECT sql FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
      if (err) return reject(err);
      
      const hasUsername = row && row.sql && row.sql.includes('username');
      
      if (hasUsername) {
        console.log('✅ Username column already exists');
        return resolve();
      }
      
      console.log('📝 Adding username column to users table...');
      db.run('ALTER TABLE users ADD COLUMN username VARCHAR(255)', (err) => {
        if (err) return reject(err);
        
        db.run('CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)', (err) => {
          if (err) console.warn('⚠️ Warning: Failed to create username index:', err.message);
          console.log('✅ Username column added successfully');
          resolve();
        });
      });
    });
  });
  
  console.log('✅ Migrations complete');
}

async function ensureAdminAccount(db) {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return;
  await new Promise((resolve, reject) => {
    db.run(
      "UPDATE users SET user_type = 'professional' WHERE user_type = 'admin' AND email != ?",
      [ADMIN_EMAIL],
      (err) => (err ? reject(err) : resolve())
    );
  });
  const admin = await new Promise((resolve) => {
    db.get('SELECT id FROM users WHERE email = ?', [ADMIN_EMAIL], (err, row) => {
      if (err) return resolve(null);
      resolve(row || null);
    });
  });

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  if (!admin) {
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (email, username, password_hash, user_type) VALUES (?, ?, ?, ?)',
        [ADMIN_EMAIL, 'admin', passwordHash, 'admin'],
        (err) => (err ? reject(err) : resolve())
      );
    });
    return;
  }

  await new Promise((resolve, reject) => {
    db.run(
      'UPDATE users SET password_hash = ?, user_type = ?, username = ? WHERE email = ?',
      [passwordHash, 'admin', 'admin', ADMIN_EMAIL],
      (err) => (err ? reject(err) : resolve())
    );
  });
}

module.exports = { initDbIfNeeded };
