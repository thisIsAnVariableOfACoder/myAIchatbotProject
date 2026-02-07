const express = require('express');
const router = express.Router();
const { initCatalogSchema, listJobs, listJobsFuzzy, listFilters } = require('../services/careerCatalog');

const CATEGORY_FALLBACK_ICON = {
  Technology: '/career-icons/tech.svg',
  Business: '/career-icons/business.svg',
  Design: '/career-icons/creative.svg',
  Education: '/career-icons/education.svg',
  Healthcare: '/career-icons/health.svg',
  Engineering: '/career-icons/engineering.svg',
  Media: '/career-icons/creative.svg',
  Finance: '/career-icons/business.svg',
  Marketing: '/career-icons/business.svg'
};

router.get('/jobs', async (req, res) => {
  try {
    await initCatalogSchema();
    const { q, category, tag, limit, offset } = req.query;
    console.log(`[Explore] Request: limit=${limit}, offset=${offset}`);

    // FORCE DEBUG: Check DB path
    const dbPath = process.env.CAREER_CATALOG_DB_PATH || 'default';
    console.log(`[Explore] DB Path env: ${dbPath}`);

    // Force default limit to 120 if not specified
    const effectiveLimit = limit ? Number(limit) : 120;
    const effectiveOffset = offset ? Number(offset) : 0;

    let result = await listJobs({ q, category, tag, limit: effectiveLimit, offset: effectiveOffset });
    console.log(`[Explore] Found ${result.total} jobs in DB`);

    if (!result.total && q) {
      const fuzzy = await listJobsFuzzy({ q, limit, offset });
      if (fuzzy.total > 0) {
        const data = (fuzzy.rows || []).map((row) => ({
          ...row,
          tags: safeParse(row.tags, [])
        }));
        return res.json({ success: true, data, total: fuzzy.total, fuzzy: true });
      }
    }
    if (!result.total) {
      let fallback = await listFallbackCareers({ q, category, tag, limit, offset });
      if (!fallback.total && q) {
        fallback = await listFallbackCareersFuzzy({ q, limit, offset });
      }
      const data = (fallback.rows || []).map((row) => ({
        id: row.id,
        title: row.title,
        category: row.category || 'Other',
        tags: safeParse(row.tags, []),
        image_url: row.image_url
      }));
      return res.json({ success: true, data, total: fallback.total, fallback: true });
    }
    const data = (result.rows || []).map((row) => ({
      ...row,
      tags: safeParse(row.tags, [])
    }));
    res.json({ success: true, data, total: result.total });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/filters', async (req, res) => {
  try {
    await initCatalogSchema();
    const data = await listFilters();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

function safeParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function listFallbackCareers({ q, category, tag, limit = 120, offset = 0 }) {
  if (!global.db) return Promise.resolve({ total: 0, rows: [] });
  const where = [];
  const params = [];
  if (q) {
    where.push('name LIKE ?');
    params.push(`%${q}%`);
  }
  if (category) {
    where.push('category LIKE ?');
    params.push(`%${category}%`);
  }
  if (tag) {
    where.push('required_skills LIKE ?');
    params.push(`%${tag}%`);
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const countQuery = `SELECT COUNT(*) as total FROM careers ${whereSql}`;
  const query = `
    SELECT id, name as title, category, required_skills
    FROM careers
    ${whereSql}
    ORDER BY name ASC
    LIMIT ? OFFSET ?
  `;
  const safeLimit = Math.min(200, Math.max(1, Number(limit) || 120));
  const safeOffset = Math.max(0, Number(offset) || 0);

  return new Promise((resolve, reject) => {
    global.db.get(countQuery, params, (countErr, countRow) => {
      if (countErr) return reject(countErr);
      global.db.all(query, [...params, safeLimit, safeOffset], (err, rows) => {
        if (err) return reject(err);
        const mapped = (rows || []).map((row) => {
          const tags = safeParse(row.required_skills, []);
          return {
            id: row.id,
            title: row.title,
            category: row.category,
            tags: JSON.stringify(tags),
            image_url: CATEGORY_FALLBACK_ICON[row.category] || '/career-icons/default.svg'
          };
        });
        resolve({ total: countRow?.total || 0, rows: mapped });
      });
    });
  });
}

function listFallbackCareersFuzzy({ q, limit = 24, offset = 0 }) {
  if (!global.db) return Promise.resolve({ total: 0, rows: [] });
  const query = normalizeQuery(q);
  if (!query) return Promise.resolve({ total: 0, rows: [] });
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 24));
  const safeOffset = Math.max(0, Number(offset) || 0);
  return new Promise((resolve, reject) => {
    global.db.all('SELECT id, name as title, category, required_skills FROM careers LIMIT 3000', (err, rows) => {
      if (err) return reject(err);
      const scored = (rows || []).map((row) => {
        const score = fuzzyScore(query, normalizeQuery(row.title));
        return { ...row, _score: score };
      }).filter((r) => r._score >= 0.45);
      scored.sort((a, b) => b._score - a._score);
      const total = scored.length;
      const slice = scored.slice(safeOffset, safeOffset + safeLimit);
      const mapped = slice.map((row) => {
        const tags = safeParse(row.required_skills, []);
        return {
          id: row.id,
          title: row.title,
          category: row.category,
          tags: JSON.stringify(tags),
          image_url: CATEGORY_FALLBACK_ICON[row.category] || '/career-icons/default.svg'
        };
      });
      resolve({ total, rows: mapped });
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

module.exports = router;
