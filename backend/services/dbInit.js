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
  
  // Run migrations after schema is applied (for existing databases)
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
  
  // Check if username column exists
  const columnInfo = await new Promise((resolve, reject) => {
    db.all("PRAGMA table_info(users)", (err, rows) => {
      if (err) return reject(err);
      resolve(rows || []);
    });
  });
  
  const hasUsername = columnInfo.some(col => col.name === 'username');
  
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
    if (hasUsername) {
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO users (email, username, password_hash, user_type) VALUES (?, ?, ?, ?)',
          [ADMIN_EMAIL, 'admin', passwordHash, 'admin'],
          (err) => (err ? reject(err) : resolve())
        );
      });
    } else {
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO users (email, password_hash, user_type) VALUES (?, ?, ?)',
          [ADMIN_EMAIL, passwordHash, 'admin'],
          (err) => (err ? reject(err) : resolve())
        );
      });
    }
    return;
  }

  if (hasUsername) {
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET password_hash = ?, user_type = ?, username = ? WHERE email = ?',
        [passwordHash, 'admin', 'admin', ADMIN_EMAIL],
        (err) => (err ? reject(err) : resolve())
      );
    });
  } else {
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET password_hash = ?, user_type = ? WHERE email = ?',
        [passwordHash, 'admin', ADMIN_EMAIL],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }
}

module.exports = { initDbIfNeeded };
