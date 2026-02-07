const fs = require('fs');
const path = require('path');
const https = require('https');
const readline = require('readline');
const { initCatalogSchema, getCatalogDb } = require('../services/careerCatalog');

const CSV_URL = process.env.ESCO_CSV_URL
  || 'https://raw.githubusercontent.com/tabiya-tech/tabiya-livelihoods-classifier/main/inference/files/occupations_augmented.csv';
const CSV_PATH = process.env.ESCO_CSV_PATH;
const TMP_CSV = path.join(__dirname, '..', 'database', 'esco_occupations.csv');

const CATEGORY_RULES = [
  { category: 'Dữ liệu & AI', icon: '/career-icons/tech.svg', keywords: ['data scientist', 'data analyst', 'analytics', 'machine learning', 'artificial intelligence', 'ai', 'data mining'] },
  { category: 'Công nghệ', icon: '/career-icons/tech.svg', keywords: ['software', 'developer', 'programmer', 'web', 'mobile', 'cloud', 'devops', 'cyber', 'network', 'database', 'systems', 'it', 'information technology', 'frontend', 'backend', 'full stack', 'qa', 'testing'] },
  { category: 'Tài chính', icon: '/career-icons/business.svg', keywords: ['finance', 'financial', 'accountant', 'accounting', 'audit', 'bank', 'investment', 'tax', 'insurance', 'treasury', 'broker'] },
  { category: 'Marketing', icon: '/career-icons/business.svg', keywords: ['marketing', 'brand', 'seo', 'social media', 'content marketing', 'advertising', 'public relations', 'pr'] },
  { category: 'Kinh doanh', icon: '/career-icons/business.svg', keywords: ['business', 'sales', 'commercial', 'retail', 'merchandising', 'account manager', 'client', 'customer', 'commerce'] },
  { category: 'Y tế', icon: '/career-icons/health.svg', keywords: ['medical', 'health', 'doctor', 'physician', 'nurse', 'clinical', 'pharmacy', 'dentist', 'patient', 'hospital', 'surgery', 'therapy'] },
  { category: 'Pháp lý', icon: '/career-icons/legal.svg', keywords: ['legal', 'law', 'lawyer', 'attorney', 'compliance', 'contract'] },
  { category: 'Giáo dục', icon: '/career-icons/education.svg', keywords: ['teacher', 'education', 'school', 'lecturer', 'professor', 'trainer', 'tutor', 'teaching'] },
  { category: 'Thiết kế', icon: '/career-icons/creative.svg', keywords: ['designer', 'design', 'ux', 'ui', 'graphic', 'visual', 'illustration', 'fashion', 'interior'] },
  { category: 'Truyền thông', icon: '/career-icons/creative.svg', keywords: ['media', 'journalist', 'editor', 'producer', 'broadcast', 'film', 'video', 'content creator'] },
  { category: 'Khoa học', icon: '/career-icons/science.svg', keywords: ['scientist', 'research', 'laboratory', 'lab', 'biologist', 'chemist', 'physicist', 'researcher'] },
  { category: 'Kỹ thuật', icon: '/career-icons/engineering.svg', keywords: ['engineer', 'engineering', 'mechanical', 'electrical', 'automation', 'robot', 'manufacturing', 'maintenance', 'industrial'] },
  { category: 'Xây dựng', icon: '/career-icons/construction.svg', keywords: ['construction', 'architect', 'architecture', 'building', 'civil', 'bim', 'survey'] },
  { category: 'Logistics', icon: '/career-icons/transport.svg', keywords: ['logistics', 'supply chain', 'warehouse', 'transport', 'shipping', 'freight', 'procurement'] },
  { category: 'Nông nghiệp', icon: '/career-icons/agri.svg', keywords: ['agriculture', 'farming', 'farm', 'agribusiness', 'livestock', 'fisheries'] },
  { category: 'Du lịch & Dịch vụ', icon: '/career-icons/hospitality.svg', keywords: ['tourism', 'hospitality', 'hotel', 'travel', 'restaurant', 'chef', 'waiter', 'customer service'] },
  { category: 'Hành chính', icon: '/career-icons/admin.svg', keywords: ['administration', 'administrative', 'office', 'secretary', 'clerk', 'public administration'] },
  { category: 'An ninh', icon: '/career-icons/security.svg', keywords: ['security', 'police', 'military', 'firefighter', 'guard'] },
  { category: 'Dịch vụ cộng đồng', icon: '/career-icons/community.svg', keywords: ['community', 'social worker', 'ngo', 'counsellor', 'counselor', 'social services'] }
];

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function detectDelimiter(line) {
  const candidates = [',', ';', '\t'];
  let best = { char: ',', count: -1 };
  for (const char of candidates) {
    const count = line.split(char).length - 1;
    if (count > best.count) best = { char, count };
  }
  return best.char;
}

function parseCsvLine(line, delimiter) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === delimiter && !inQuotes) {
      result.push(current);
      current = '';
      continue;
    }
    current += char;
  }
  result.push(current);
  return result;
}

function normalizeHeader(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function pickIndex(normalized, candidates) {
  for (const keys of candidates) {
    const idx = normalized.findIndex((h) => keys.every((k) => h.includes(k)));
    if (idx >= 0) return idx;
  }
  return -1;
}

function buildHeaderIndex(header) {
  const normalized = header.map(normalizeHeader);
  return {
    preferred: pickIndex(normalized, [
      ['preferred', 'label'],
      ['preferredlabel'],
      ['preferredtitle'],
      ['preffered', 'label'],
      ['prefferedlabel'],
      ['prefferedtitle']
    ]),
    occupation: pickIndex(normalized, [
      ['occupation', 'label'],
      ['occupationlabel'],
      ['occupation', 'title'],
      ['occupationtitle'],
      ['occupation']
    ]),
    alt: pickIndex(normalized, [
      ['alt', 'label'],
      ['alternativelabel'],
      ['altlabel']
    ]),
    group: pickIndex(normalized, [
      ['esco', 'group', 'title'],
      ['escogroup', 'title'],
      ['isco', 'group', 'title'],
      ['iscogroup', 'title'],
      ['group', 'title']
    ])
  };
}

function pickCategory(title, groupTitle) {
  const text = normalize(`${title} ${groupTitle || ''}`);
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((k) => text.includes(k))) {
      return { category: rule.category, icon: rule.icon };
    }
  }
  return { category: 'Khác', icon: '/career-icons/default.svg' };
}

function buildTags(title, groupTitle) {
  const tokens = normalize(`${title} ${groupTitle || ''}`)
    .split(' ')
    .filter(Boolean);
  return Array.from(new Set(tokens)).slice(0, 8);
}

function run(db, sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => (err ? reject(err) : resolve()));
  });
}

function finalize(stmt) {
  return new Promise((resolve, reject) => {
    stmt.finalize((err) => (err ? reject(err) : resolve()));
  });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, { headers: { 'user-agent': 'career-advisor-importer' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download: ${res.statusCode}`));
        return;
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    });
    request.on('error', reject);
  });
}

function ensureRealCsv(csvPath) {
  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV not found: ${csvPath}`);
  }
  const size = fs.statSync(csvPath).size;
  if (size < 64) {
    throw new Error('Downloaded CSV is empty or too small.');
  }
  const firstLine = fs.readFileSync(csvPath, 'utf8').split(/\r?\n/)[0].trim();
  if (firstLine.startsWith('version https://git-lfs.github.com/spec/v1')) {
    throw new Error(
      'CSV URL returned a Git LFS pointer, not real data. ' +
      'Please download the actual CSV with git-lfs and set ESCO_CSV_PATH, ' +
      'or provide a direct CSV URL via ESCO_CSV_URL.'
    );
  }
}

async function main() {
  const reset = process.argv.includes('--reset');
  await initCatalogSchema();
  const db = getCatalogDb();
  if (reset) {
    await run(db, 'DELETE FROM jobs');
  }

  const csvPath = CSV_PATH || TMP_CSV;
  if (!CSV_PATH) {
    await download(CSV_URL, TMP_CSV);
  }
  ensureRealCsv(csvPath);

  const stream = fs.createReadStream(csvPath);
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  let delimiter = null;
  let header = null;
  let idx = {};
  let count = 0;
  const insert = db.prepare('INSERT OR IGNORE INTO jobs (title, category, tags, image_url, source) VALUES (?, ?, ?, ?, ?)');

  await run(db, 'BEGIN TRANSACTION');
  for await (const line of rl) {
    if (!line.trim()) continue;
    if (line.startsWith('sep=')) {
      delimiter = line.replace('sep=', '').trim()[0] || ',';
      continue;
    }
    if (!header) {
      delimiter = delimiter || detectDelimiter(line);
      header = parseCsvLine(line, delimiter);
      idx = buildHeaderIndex(header);
      console.log('Detected CSV headers:', header.slice(0, 10).join(' | '));
      console.log('Header indexes:', idx);
      continue;
    }
    const row = parseCsvLine(line, delimiter || ',');
    const title = (row[idx.preferred] || row[idx.occupation] || row[idx.alt] || '').trim();
    if (!title) continue;
    const groupTitle = idx.group >= 0 ? (row[idx.group] || '').trim() : '';
    const { category, icon } = pickCategory(title, groupTitle);
    const tags = buildTags(title, groupTitle);
    insert.run([title, category, JSON.stringify(tags), icon, 'ESCO v1.1.1 (Tabiya)']);
    count += 1;
    if (count % 2000 === 0) {
      console.log(`Imported ${count} occupations...`);
    }
  }

  await finalize(insert);
  await run(db, 'COMMIT');
  console.log(`Imported ${count} ESCO occupations into career_catalog.db`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
