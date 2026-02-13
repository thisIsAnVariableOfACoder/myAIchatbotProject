const express = require('express');
const router = express.Router();
const { initCatalogSchema, listJobs, listJobsFuzzy, listFilters } = require('../services/careerCatalog');
const { buildCareerRecords } = require('../data/careerLibrary');

const CATEGORY_FALLBACK_ICON = {
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
  Education: '/career-icons/education.svg',
  Healthcare: '/career-icons/health.svg',
  Engineering: '/career-icons/engineering.svg',
  Media: '/career-icons/creative.svg',
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
  InternationalBusiness: '/career-icons/business.svg',
  Procurement: '/career-icons/business.svg'
};

let LIBRARY_FALLBACK_ROWS = null;
let LIBRARY_FILTERS_CACHE = null;

function getLibraryFallbackRows() {
  if (Array.isArray(LIBRARY_FALLBACK_ROWS)) {
    return LIBRARY_FALLBACK_ROWS;
  }

  const records = buildCareerRecords();
  LIBRARY_FALLBACK_ROWS = records.map((record, idx) => ({
    id: idx + 1,
    title: String(record?.name || '').trim(),
    category: String(record?.category || 'Other').trim() || 'Other',
    tags: Array.isArray(record?.required_skills) ? record.required_skills.filter(Boolean) : [],
    image_url: CATEGORY_FALLBACK_ICON[String(record?.category || '').trim()] || '/career-icons/default.svg'
  })).filter((row) => row.title);

  return LIBRARY_FALLBACK_ROWS;
}

function getLibraryFilters() {
  if (LIBRARY_FILTERS_CACHE) {
    return LIBRARY_FILTERS_CACHE;
  }

  const rows = getLibraryFallbackRows();
  const categories = new Set();
  const tags = new Set();

  for (const row of rows) {
    if (row.category) categories.add(String(row.category));
    for (const tag of row.tags || []) {
      const value = String(tag || '').trim();
      if (value) tags.add(value);
    }
  }

  LIBRARY_FILTERS_CACHE = {
    categories: Array.from(categories).sort(),
    tags: Array.from(tags).sort()
  };
  return LIBRARY_FILTERS_CACHE;
}

router.get('/jobs', async (req, res) => {
  try {
    await initCatalogSchema();
    const { q, category, tag, limit, offset } = req.query;
    console.log(`[Explore] Request: limit=${limit}, offset=${offset}`);

    console.log('[Explore] Provider: SQLiteCloud');

    // Force default limit to 120 if not specified
    const effectiveLimit = limit ? Number(limit) : 120;
    const effectiveOffset = offset ? Number(offset) : 0;

    let result = await listJobs({ q, category, tag, limit: effectiveLimit, offset: effectiveOffset });
    console.log(`[Explore] Found ${result.total} jobs in DB`);

    const hasFilters = Boolean(q || category || tag);
    const libraryTotal = getLibraryFallbackRows().length;
    const catalogLikelyIncomplete =
      !hasFilters
      && Number(result.total || 0) > 0
      && Number(result.total || 0) < Math.floor(libraryTotal * 0.5);

    if (!result.total || catalogLikelyIncomplete) {
      const fallback = await listFallbackCareers({ q, category, tag, limit, offset });
      if (fallback.total > 0 || catalogLikelyIncomplete) {
        const data = (fallback.rows || []).map((row) => ({
          id: row.id,
          title: row.title,
          category: row.category || 'Other',
          tags: safeParse(row.tags, []),
          image_url: row.image_url
        }));
        return res.json({
          success: true,
          data,
          total: fallback.total,
          fallback: true,
          fallback_reason: catalogLikelyIncomplete ? 'catalog_incomplete' : 'catalog_empty'
        });
      }
    }

    if (!result.total && q) {
      const fallbackFuzzy = await listFallbackCareersFuzzy({ q, limit, offset });
      if (fallbackFuzzy.total > 0) {
        const data = (fallbackFuzzy.rows || []).map((row) => ({
          id: row.id,
          title: row.title,
          category: row.category || 'Other',
          tags: safeParse(row.tags, []),
          image_url: row.image_url
        }));
        return res.json({
          success: true,
          data,
          total: fallbackFuzzy.total,
          fallback: true,
          fuzzy: true,
          fallback_reason: 'catalog_empty'
        });
      }

      const fuzzy = await listJobsFuzzy({ q, limit, offset });
      if (fuzzy.total > 0) {
        const data = (fuzzy.rows || []).map((row) => ({
          ...row,
          tags: safeParse(row.tags, []),
          image_url: row.image_url || '/career-icons/default.svg'
        }));
        return res.json({ success: true, data, total: fuzzy.total, fuzzy: true });
      }
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
    const library = getLibraryFilters();
    const mergedCategories = new Set([...(data?.categories || []), ...(library.categories || [])]);
    const mergedTags = new Set([...(data?.tags || []), ...(library.tags || [])]);

    res.json({
      success: true,
      data: {
        categories: Array.from(mergedCategories).filter(Boolean).sort(),
        tags: Array.from(mergedTags).filter(Boolean).sort()
      }
    });
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
  const rows = getLibraryFallbackRows();
  const qNorm = normalizeQuery(q);
  const categoryNorm = normalizeQuery(category);
  const tagNorm = normalizeQuery(tag);
  const safeLimit = Math.min(200, Math.max(1, Number(limit) || 120));
  const safeOffset = Math.max(0, Number(offset) || 0);

  const filtered = rows.filter((row) => {
    const rowTitle = normalizeQuery(row.title);
    const rowCategory = normalizeQuery(row.category);
    const rowTags = (row.tags || []).map((t) => normalizeQuery(t)).filter(Boolean);

    if (qNorm && !rowTitle.includes(qNorm)) return false;
    if (categoryNorm && !rowCategory.includes(categoryNorm)) return false;
    if (tagNorm && !rowTags.some((t) => t.includes(tagNorm))) return false;
    return true;
  });

  filtered.sort((a, b) => String(a.title).localeCompare(String(b.title)));
  const total = filtered.length;
  const slice = filtered.slice(safeOffset, safeOffset + safeLimit);
  const mapped = slice.map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    tags: JSON.stringify(row.tags || []),
    image_url: row.image_url
  }));

  return Promise.resolve({ total, rows: mapped });
}

function listFallbackCareersFuzzy({ q, limit = 24, offset = 0 }) {
  const rows = getLibraryFallbackRows();
  const query = normalizeQuery(q);
  if (!query) return Promise.resolve({ total: 0, rows: [] });
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 24));
  const safeOffset = Math.max(0, Number(offset) || 0);

  const scored = rows.map((row) => {
    const score = fuzzyScore(query, normalizeQuery(row.title));
    return { ...row, _score: score };
  }).filter((r) => r._score >= 0.45);

  scored.sort((a, b) => b._score - a._score);
  const total = scored.length;
  const slice = scored.slice(safeOffset, safeOffset + safeLimit);
  const mapped = slice.map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    tags: JSON.stringify(row.tags || []),
    image_url: row.image_url
  }));

  return Promise.resolve({ total, rows: mapped });
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
