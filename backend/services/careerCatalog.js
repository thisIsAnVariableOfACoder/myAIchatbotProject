const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = process.env.CAREER_CATALOG_DB_PATH
  || path.join(__dirname, '..', 'database', 'career_catalog.db');

let catalogDb = null;

function getCatalogDb() {
  if (catalogDb) return catalogDb;
  catalogDb = new sqlite3.Database(DB_PATH);
  return catalogDb;
}

function initCatalogSchema() {
  const db = getCatalogDb();
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
    db.exec(schema, (err) => (err ? reject(err) : resolve()));
  });
}

function listJobs({ q, category, tag, limit = 24, offset = 0 }) {
  const db = getCatalogDb();
  const where = [];
  const params = [];

  if (q) {
    const normalized = normalizeQuery(q);
    const tokens = normalized.split(/\s+/).filter(Boolean);
    const terms = Array.from(new Set([normalized, ...tokens])).filter(Boolean);
    if (terms.length > 0) {
      const clauses = terms.map(() => 'title LIKE ?').join(' OR ');
      where.push(`(${clauses})`);
      for (const term of terms) {
        params.push(`%${term}%`);
      }
    }
  }
  if (category) {
    where.push('category = ?');
    params.push(category);
  }
  if (tag) {
    where.push('tags LIKE ?');
    params.push(`%${tag}%`);
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const query = `
    SELECT id, title, category, tags, image_url
    FROM jobs
    ${whereSql}
    ORDER BY title ASC
    LIMIT ? OFFSET ?
  `;
  const countQuery = `SELECT COUNT(*) as total FROM jobs ${whereSql}`;
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 24));
  const safeOffset = Math.max(0, Number(offset) || 0);

  return new Promise((resolve, reject) => {
    db.get(countQuery, params, (countErr, countRow) => {
      if (countErr) return reject(countErr);
      db.all(query, [...params, safeLimit, safeOffset], (err, rows) => {
        if (err) return reject(err);
        resolve({ total: countRow?.total || 0, rows: rows || [] });
      });
    });
  });
}

function listJobsFuzzy({ q, limit = 24, offset = 0 }) {
  const db = getCatalogDb();
  const query = normalizeQuery(q);
  if (!query) return Promise.resolve({ total: 0, rows: [] });
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 24));
  const safeOffset = Math.max(0, Number(offset) || 0);

  return new Promise((resolve, reject) => {
    db.all('SELECT id, title, category, tags, image_url FROM jobs LIMIT 3000', (err, rows) => {
      if (err) return reject(err);
      const scored = (rows || []).map((row) => {
        const score = fuzzyScore(query, normalizeQuery(row.title));
        return { ...row, _score: score };
      }).filter((r) => r._score >= 0.45);
      scored.sort((a, b) => b._score - a._score);
      const total = scored.length;
      const slice = scored.slice(safeOffset, safeOffset + safeLimit);
      resolve({ total, rows: slice });
    });
  });
}

function normalizeQuery(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function fuzzyScore(a, b) {
  if (!a || !b) return 0;
  if (a === b) return 1;
  if (a.includes(b) || b.includes(a)) return 0.9;
  const dist = levenshtein(a, b);
  const max = Math.max(a.length, b.length);
  if (!max) return 0;
  return 1 - dist / max;
}

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i += 1) dp[i][0] = i;
  for (let j = 0; j <= n; j += 1) dp[0][j] = j;
  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

function listFilters() {
  const db = getCatalogDb();
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as total FROM jobs', (err, row) => {
      if (err) return reject(err);
      const total = row?.total || 0;
      if (total > 0) {
        db.all('SELECT DISTINCT category FROM jobs WHERE category IS NOT NULL AND category != "" ORDER BY category', (err2, rows) => {
          if (err2) return reject(err2);
          db.all('SELECT tags FROM jobs WHERE tags IS NOT NULL AND tags != "" LIMIT 3000', (err3, tagRows) => {
            if (err3) return reject(err3);
            const tags = new Set();
            for (const r of tagRows || []) {
              try {
                const arr = JSON.parse(r.tags);
                if (Array.isArray(arr)) {
                  for (const t of arr) tags.add(String(t));
                }
              } catch {
                // ignore
              }
            }
            resolve({
              categories: (rows || []).map((r) => r.category).filter(Boolean),
              tags: Array.from(tags).filter(Boolean).sort()
            });
          });
        });
        return;
      }

      if (global.db) {
        global.db.all('SELECT DISTINCT category FROM careers WHERE category IS NOT NULL AND category != "" ORDER BY category', (err4, rows) => {
          if (err4) return reject(err4);
          global.db.all('SELECT required_skills FROM careers WHERE required_skills IS NOT NULL LIMIT 2000', (err5, skillRows) => {
            if (err5) return reject(err5);
            const tags = new Set();
            for (const r of skillRows || []) {
              try {
                const arr = JSON.parse(r.required_skills);
                if (Array.isArray(arr)) {
                  for (const t of arr) tags.add(String(t));
                }
              } catch {
                // ignore
              }
            }
            resolve({
              categories: (rows || []).map((r) => r.category).filter(Boolean),
              tags: Array.from(tags).filter(Boolean).sort()
            });
          });
        });
        return;
      }

      resolve({ categories: [], tags: [] });
    });
  });
}

module.exports = { getCatalogDb, initCatalogSchema, listJobs, listJobsFuzzy, listFilters };
