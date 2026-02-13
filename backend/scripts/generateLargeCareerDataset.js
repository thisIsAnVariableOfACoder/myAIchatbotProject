const fs = require('fs');
const path = require('path');
const https = require('https');
const readline = require('readline');

const TARGET_MIN = Number(process.env.CAREER_TARGET_MIN || 5000);
const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'generatedCareerDataset.js');

// Open datasets (all public). Keep a few mirrors/fallbacks to maximize success rate.
const DATA_SOURCES = [
  {
    name: 'ESCO (Tabiya mirror)',
    type: 'csv',
    urls: [
      process.env.ESCO_CSV_URL,
      'https://raw.githubusercontent.com/tabiya-tech/tabiya-livelihoods-classifier/main/inference/files/occupations_augmented.csv'
    ].filter(Boolean)
  },
  {
    name: 'O*NET Occupation Data',
    type: 'txt',
    urls: [
      process.env.ONET_OCCUPATION_TXT_URL,
      'https://www.onetcenter.org/dl_files/database/db_30_1_text/Occupation%20Data.txt'
    ].filter(Boolean)
  },
  {
    name: 'O*NET Alternate Titles',
    type: 'txt_onet_alt',
    urls: [
      process.env.ONET_ALT_TITLES_URL,
      'https://www.onetcenter.org/dl_files/database/db_30_1_text/Alternate%20Titles.txt'
    ].filter(Boolean)
  },
  {
    name: 'US BLS SOC occupations',
    type: 'csv',
    urls: [
      process.env.SOC_OCCUPATION_URL,
      'https://raw.githubusercontent.com/datasets/soc-occupations/master/data/occupations.csv'
    ].filter(Boolean)
  },
  {
    name: 'ESCO Search API (paginated)',
    type: 'esco_api',
    urls: [
      process.env.ESCO_API_URL,
      'https://ec.europa.eu/esco/api/search?type=occupation&language=en&limit=100&offset=0'
    ].filter(Boolean)
  }
];

const CATEGORY_RULES = [
  { category: 'Technology', keywords: ['software', 'developer', 'programmer', 'it ', 'information technology', 'cloud', 'devops', 'cyber', 'data engineer', 'site reliability', 'database', 'network', 'frontend', 'backend', 'full stack', 'qa engineer'] },
  { category: 'Data', keywords: ['data', 'analytics', 'statistic', 'machine learning', 'ai ', 'business intelligence', 'bi '] },
  { category: 'Design', keywords: ['designer', 'ux', 'ui', 'graphic', 'visual', 'illustrator', 'motion', '3d ', 'interior design', 'fashion design'] },
  { category: 'Business', keywords: ['business', 'operations', 'manager', 'account executive', 'account manager', 'sales', 'commercial', 'partnership', 'strategy', 'consultant'] },
  { category: 'Marketing', keywords: ['marketing', 'seo', 'sem', 'brand', 'growth', 'media buyer', 'content marketing', 'social media', 'performance marketing', 'pr '] },
  { category: 'Finance', keywords: ['finance', 'financial', 'accountant', 'audit', 'tax', 'investment', 'banker', 'treasury', 'controller', 'credit analyst'] },
  { category: 'Banking', keywords: ['bank', 'banking', 'teller', 'loan officer', 'relationship manager', 'credit officer'] },
  { category: 'Insurance', keywords: ['insurance', 'underwriter', 'claims', 'actuary', 'bancassurance'] },
  { category: 'HumanResources', keywords: ['human resources', 'hr ', 'recruiter', 'talent acquisition', 'payroll', 'compensation', 'employee relations', 'l&d'] },
  { category: 'CustomerService', keywords: ['customer service', 'customer support', 'customer success', 'call center', 'contact center', 'help desk'] },
  { category: 'Education', keywords: ['teacher', 'education', 'lecturer', 'professor', 'tutor', 'trainer', 'instructor'] },
  { category: 'Healthcare', keywords: ['doctor', 'physician', 'nurse', 'clinical', 'hospital', 'pharmacy', 'dentist', 'therapist', 'healthcare', 'medical'] },
  { category: 'Engineering', keywords: ['engineer', 'engineering', 'mechanical', 'electrical', 'automation', 'industrial engineer', 'civil engineer', 'chemical engineer'] },
  { category: 'Legal', keywords: ['legal', 'lawyer', 'attorney', 'paralegal', 'compliance officer', 'contract specialist'] },
  { category: 'Hospitality', keywords: ['hotel', 'hospitality', 'restaurant', 'chef', 'cook', 'barista', 'front desk', 'tour'] },
  { category: 'Logistics', keywords: ['logistics', 'supply chain', 'warehouse', 'freight', 'shipping', 'procurement', 'inventory'] },
  { category: 'Media', keywords: ['media', 'journalist', 'editor', 'video', 'producer', 'content creator', 'broadcast', 'podcast'] },
  { category: 'Government', keywords: ['government', 'public administration', 'policy', 'municipal', 'civil servant', 'tax officer'] },
  { category: 'PublicService', keywords: ['public service', 'community service', 'social worker', 'public officer', 'civil service', 'administrative officer'] },
  { category: 'CivilService', keywords: ['civil service', 'civil servant', 'public clerk', 'public affairs', 'government officer'] },
  { category: 'Science', keywords: ['scientist', 'research', 'laboratory', 'lab technician', 'biologist', 'chemist', 'physicist'] },
  { category: 'Trades', keywords: ['technician', 'electrician', 'plumber', 'welder', 'carpenter', 'repair', 'maintenance worker', 'mechanic'] },
  { category: 'Agriculture', keywords: ['agriculture', 'farm', 'farming', 'agronomy', 'livestock', 'fisheries', 'horticulture'] },
  { category: 'RealEstate', keywords: ['real estate', 'property', 'realtor', 'leasing', 'broker', 'appraiser', 'estate agent'] },
  { category: 'Retail', keywords: ['retail', 'store', 'merchandise', 'cashier', 'shop assistant', 'inventory clerk'] },
  { category: 'Beauty', keywords: ['beauty', 'cosmetologist', 'makeup', 'hair stylist', 'esthetician', 'spa'] },
  { category: 'Sports', keywords: ['sports', 'athletic', 'coach', 'trainer', 'fitness'] },
  { category: 'Transportation', keywords: ['transport', 'driver', 'pilot', 'air traffic', 'rail', 'bus', 'truck', 'maritime'] },
  { category: 'Construction', keywords: ['construction', 'architect', 'building', 'survey', 'site supervisor', 'bim'] },
  { category: 'Manufacturing', keywords: ['manufacturing', 'production', 'assembly', 'quality control', 'qa qc', 'factory'] },
  { category: 'Environment', keywords: ['environment', 'environmental', 'sustainability', 'esg', 'waste', 'recycling', 'climate', 'sanitation'] },
  { category: 'Administration', keywords: ['administration', 'administrative', 'office', 'clerk', 'secretary', 'assistant', 'document', 'records'] },
  { category: 'SecurityDefense', keywords: ['security', 'police', 'military', 'firefighter', 'guard', 'defense'] },
  { category: 'ECommerce', keywords: ['e-commerce', 'ecommerce', 'marketplace', 'online store', 'merchandising online'] },
  { category: 'Product', keywords: ['product owner', 'product manager', 'product operations', 'product analyst'] },
  { category: 'Consulting', keywords: ['consultant', 'consulting', 'advisory'] },
  { category: 'InternationalBusiness', keywords: ['international trade', 'import export', 'global sourcing', 'trade compliance'] }
];

const CATEGORY_SKILLS = {
  Technology: ['coding', 'problem_solving', 'sql'],
  Data: ['statistics', 'sql', 'python'],
  Design: ['design', 'creativity', 'user_research'],
  Business: ['communication', 'analysis', 'management'],
  Marketing: ['communication', 'creativity', 'analytics'],
  Finance: ['analysis', 'excel', 'finance'],
  Banking: ['finance', 'compliance', 'analysis'],
  Insurance: ['risk_assessment', 'communication', 'analysis'],
  HumanResources: ['communication', 'evaluation', 'organization'],
  CustomerService: ['service', 'communication', 'problem_solving'],
  Education: ['teaching', 'communication', 'subject_knowledge'],
  Healthcare: ['care', 'communication', 'medical'],
  Engineering: ['math', 'physics', 'design'],
  Legal: ['writing', 'analysis', 'research'],
  Hospitality: ['service', 'communication', 'organization'],
  Logistics: ['analysis', 'process', 'organization'],
  Media: ['storytelling', 'editing', 'creativity'],
  Government: ['policy', 'communication', 'analysis'],
  PublicService: ['policy', 'community', 'administration'],
  CivilService: ['administration', 'policy', 'community'],
  Science: ['research', 'analysis', 'lab'],
  Trades: ['hands_on', 'precision', 'safety'],
  Agriculture: ['biology', 'process', 'care'],
  RealEstate: ['sales', 'communication', 'negotiation'],
  Retail: ['service', 'sales', 'organization'],
  Beauty: ['aesthetics', 'service', 'communication'],
  Sports: ['discipline', 'training', 'teamwork'],
  Transportation: ['safety', 'operations', 'navigation'],
  Construction: ['planning', 'safety', 'execution'],
  Manufacturing: ['operations', 'quality', 'safety'],
  Environment: ['sustainability', 'analysis', 'field_work'],
  Administration: ['organization', 'documentation', 'communication'],
  SecurityDefense: ['discipline', 'safety', 'operations'],
  ECommerce: ['analytics', 'sales', 'operations'],
  Product: ['analysis', 'roadmapping', 'communication'],
  Consulting: ['analysis', 'communication', 'problem_solving'],
  InternationalBusiness: ['communication', 'trade', 'negotiation']
};

const EXTRA_SANITATION_ROLES = [
  'Nhân viên Quét rác',
  'Nhân viên Thu gom rác thải',
  'Nhân viên Vệ sinh công nghiệp',
  'Nhân viên Dọn vệ sinh tòa nhà',
  'Nhân viên Làm sạch môi trường',
  'Nhân viên Vận hành xử lý rác thải',
  'Nhân viên Vận hành nhà máy xử lý nước thải',
  'Công nhân môi trường đô thị',
  'Công nhân vệ sinh đường phố',
  'Kỹ thuật viên xử lý chất thải',
  'Kỹ thuật viên quan trắc môi trường',
  'Giám sát vệ sinh môi trường',
  'Chuyên viên quản lý chất thải rắn',
  'Nhân viên tái chế',
  'Kỹ sư môi trường đô thị',
  'Nhân viên kiểm soát côn trùng',
  'Nhân viên khử khuẩn',
  'Nhân viên vệ sinh bệnh viện',
  'Nhân viên vệ sinh trường học',
  'Nhân viên quản lý nhà vệ sinh công cộng'
];

const CLEANER_WORDS = new Set([
  'occupation', 'occupations', 'label', 'title', 'esco', 'onet', 'soc', 'code', 'group', 'major',
  'and', 'or', 'of', 'the', 'for', 'with', 'without', 'to', 'in', 'on', 'at', 'by', 'from'
]);

function normalizeName(name) {
  return String(name || '')
    .replace(/[\u0000-\u001F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitCandidateText(value) {
  const raw = normalizeName(value);
  if (!raw) return [];
  const parts = raw
    .split(/[;|\u2022]/)
    .map((p) => normalizeName(p))
    .filter(Boolean);
  return parts.length ? parts : [raw];
}

function normalizeKey(name) {
  return String(name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function titleCaseEnglish(name) {
  const words = normalizeName(name).split(' ').filter(Boolean);
  if (!words.length) return '';
  return words.map((w) => {
    const lower = w.toLowerCase();
    if (CLEANER_WORDS.has(lower)) return lower;
    if (/^[A-Z0-9\-\/]+$/.test(w) && w.length <= 5) return w;
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }).join(' ');
}

function categorize(name) {
  const key = normalizeKey(name);
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((kw) => key.includes(normalizeKey(kw)))) {
      return rule.category;
    }
  }
  return 'Business';
}

function buildRecord(name) {
  const cleanName = titleCaseEnglish(name);
  const category = categorize(cleanName);
  return {
    name: cleanName,
    category,
    required_skills: CATEGORY_SKILLS[category] || ['communication', 'analysis'],
    salary_range: 'Thỏa thuận',
    job_outlook: 'good',
    description: `${cleanName} thuộc nhóm ${category}`
  };
}

function httpGet(url, timeoutMs = 45000) {
  return new Promise((resolve, reject) => {
    if (!url) return reject(new Error('Missing URL'));
    const req = https.get(url, { headers: { 'user-agent': 'career-dataset-generator' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(httpGet(res.headers.location, timeoutMs));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on('data', (d) => chunks.push(d));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error(`Timeout fetching ${url}`));
    });
    req.on('error', reject);
  });
}

function parseCsvLine(line, delimiter) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === delimiter && !inQuotes) {
      out.push(cur);
      cur = '';
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

function detectDelimiter(line) {
  const options = [',', ';', '\t'];
  let best = ',';
  let bestCount = -1;
  for (const d of options) {
    const c = line.split(d).length - 1;
    if (c > bestCount) {
      bestCount = c;
      best = d;
    }
  }
  return best;
}

function normalizedHeader(v) {
  return String(v || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function pickColumn(headers, candidates) {
  const list = headers.map(normalizedHeader);
  for (const candidateSet of candidates) {
    const idx = list.findIndex((h) => candidateSet.every((k) => h.includes(k)));
    if (idx >= 0) return idx;
  }
  return -1;
}

function extractNamesFromCsv(text) {
  const lines = String(text || '').split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const delimiter = detectDelimiter(lines[0]);
  const header = parseCsvLine(lines[0], delimiter);

  const idxPreferred = pickColumn(header, [
    ['preferred', 'label'],
    ['preferredlabel'],
    ['occupation', 'label'],
    ['occupation'],
    ['title'],
    ['job', 'title'],
    ['name']
  ]);
  const idxAlt = pickColumn(header, [
    ['alt', 'label'],
    ['alternative', 'label'],
    ['description']
  ]);

  const names = [];
  for (let i = 1; i < lines.length; i += 1) {
    const row = parseCsvLine(lines[i], delimiter);
    const primary = row[idxPreferred] || '';
    const secondary = row[idxAlt] || '';

    for (const p of splitCandidateText(primary)) {
      if (p && p.length >= 3 && !/^\d+$/.test(p)) names.push(p);
    }
    for (const s of splitCandidateText(secondary)) {
      if (s && s.length >= 3 && !/^\d+$/.test(s)) names.push(s);
    }
  }
  return names;
}

function extractNamesFromOnetTxt(text) {
  const lines = String(text || '').split(/\r?\n/);
  const names = [];
  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line || !line.trim()) continue;
    const cols = line.split('\t');
    const title = normalizeName(cols[1] || '');
    if (title && title.length >= 3) names.push(title);
  }
  return names;
}

function extractNamesFromOnetAlternateTitles(text) {
  const lines = String(text || '').split(/\r?\n/);
  const names = [];
  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line || !line.trim()) continue;

    // Format: code<TAB>alternate_title<TAB>short_title<TAB>source
    const cols = line.split('\t');
    const alt = normalizeName(cols[1] || '');
    const shortTitle = normalizeName(cols[2] || '');

    if (alt && alt.length >= 3) names.push(alt);
    if (shortTitle && shortTitle.length >= 3 && shortTitle.toLowerCase() !== 'n/a') names.push(shortTitle);
  }
  return names;
}

async function extractNamesFromEscoApi(baseUrl) {
  const names = [];

  // Use paginated ESCO search API: ~2942 occupations as observed.
  const pageLimit = Number(process.env.ESCO_PAGE_LIMIT || 100);
  const maxPages = Number(process.env.ESCO_MAX_PAGES || 60);

  const makeUrl = (offset) => {
    const root = String(baseUrl || 'https://ec.europa.eu/esco/api/search?type=occupation&language=en&limit=100&offset=0');
    const clean = root.includes('?') ? root : `${root}?type=occupation&language=en&limit=${pageLimit}&offset=0`;
    const withLimit = clean.replace(/([?&]limit=)\d+/i, `$1${pageLimit}`);
    const withOffset = withLimit.match(/([?&]offset=)\d+/i)
      ? withLimit.replace(/([?&]offset=)\d+/i, `$1${offset}`)
      : `${withLimit}&offset=${offset}`;
    return withOffset;
  };

  for (let page = 0; page < maxPages; page += 1) {
    const offset = page * pageLimit;
    const url = makeUrl(offset);
    const content = await httpGet(url);

    let parsed = null;
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = null;
    }
    if (!parsed) break;

    const rows = Array.isArray(parsed?._embedded?.results) ? parsed._embedded.results : [];
    if (!rows.length) break;

    for (const row of rows) {
      const title = normalizeName(row?.title || '');
      if (title) names.push(title);

      const labels = row?.preferredLabel;
      if (labels && typeof labels === 'object') {
        for (const value of Object.values(labels)) {
          const label = normalizeName(value);
          if (label && label.length >= 3 && label.length <= 120) {
            names.push(label);
          }
        }
      }
    }

    const total = Number(parsed?.total || 0);
    if (total > 0 && offset + pageLimit >= total) break;
  }

  return names;
}

async function collectSourceNames() {
  const allNames = [];
  for (const source of DATA_SOURCES) {
    let ok = false;
    for (const url of source.urls) {
      try {
        let names = [];
        if (source.type === 'esco_api') {
          names = await extractNamesFromEscoApi(url);
        } else {
          const content = await httpGet(url);
          if (source.type === 'csv') names = extractNamesFromCsv(content);
          if (source.type === 'txt') names = extractNamesFromOnetTxt(content);
          if (source.type === 'txt_onet_alt') names = extractNamesFromOnetAlternateTitles(content);
        }
        if (names.length > 0) {
          allNames.push(...names);
          ok = true;
          break;
        }
      } catch (err) {
        // continue fallback
      }
    }
    if (!ok) {
      console.warn(`[dataset-generator] Source unavailable: ${source.name}`);
    }
  }
  return allNames;
}

function dedupeNames(names) {
  const map = new Map();
  for (const raw of names) {
    const clean = titleCaseEnglish(raw);
    const key = normalizeKey(clean);
    if (!clean || clean.length < 3) continue;
    if (key.length < 3) continue;
    if (key.includes('occupation data')) continue;
    if (key.includes('major group')) continue;
    if (!map.has(key)) map.set(key, clean);
  }
  return Array.from(map.values());
}

function toJsModule(records) {
  return `// GENERATED FILE - DO NOT EDIT MANUALLY\n// Source: open occupation datasets + controlled expansion\n// Generated at: ${new Date().toISOString()}\n\nconst GENERATED_CAREER_RECORDS = ${JSON.stringify(records, null, 2)};\n\nmodule.exports = { GENERATED_CAREER_RECORDS };\n`;
}

async function main() {
  const sourceNames = await collectSourceNames();

  const combined = [
    ...sourceNames,
    ...EXTRA_SANITATION_ROLES,
    // Explicit VN-friendly common jobs to ensure broad local coverage.
    'Nhân viên Bán hàng',
    'Nhân viên Thu ngân',
    'Nhân viên Giao hàng',
    'Nhân viên Bảo vệ',
    'Nhân viên Tạp vụ',
    'Nhân viên Dọn phòng',
    'Nhân viên Chăm sóc cảnh quan',
    'Nhân viên Thu gom tái chế',
    'Nhân viên Trồng cây xanh đô thị',
    'Công nhân Công trình công ích',
    'Nhân viên Vận hành hệ thống thoát nước'
  ];

  const uniqueNames = dedupeNames(combined);

  if (uniqueNames.length < TARGET_MIN) {
    console.warn(`[dataset-generator] collected ${uniqueNames.length} real occupations (< target ${TARGET_MIN}). Add more sources/URLs to increase.`);
  }

  const records = uniqueNames.map(buildRecord);
  const content = toJsModule(records);

  fs.writeFileSync(OUTPUT_PATH, content, 'utf8');
  console.log(`[dataset-generator] wrote ${records.length} records to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error('[dataset-generator] failed:', err.message);
  process.exit(1);
});

