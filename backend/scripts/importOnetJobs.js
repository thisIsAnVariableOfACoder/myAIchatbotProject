const fs = require('fs');
const path = require('path');
const https = require('https');
const AdmZip = require('adm-zip');
const sqlite3 = require('sqlite3').verbose();
const { initCatalogSchema, getCatalogDb } = require('../services/careerCatalog');

const ZIP_URL = process.env.ONET_ZIP_URL || 'https://www.onetcenter.org/dl_files/database/db_30_1_text.zip';
const TMP_ZIP = path.join(__dirname, '..', 'database', 'onet_text.zip');

const SOC_MAJOR_GROUPS = {
  '11': 'Management',
  '13': 'Business & Finance',
  '15': 'Computer & Mathematics',
  '17': 'Architecture & Engineering',
  '19': 'Science',
  '21': 'Community & Social Services',
  '23': 'Legal',
  '25': 'Education',
  '27': 'Arts & Media',
  '29': 'Healthcare',
  '31': 'Healthcare Support',
  '33': 'Protective Services',
  '35': 'Food Services',
  '37': 'Building & Grounds',
  '39': 'Personal Services',
  '41': 'Sales',
  '43': 'Office & Admin',
  '45': 'Agriculture',
  '47': 'Construction',
  '49': 'Maintenance & Repair',
  '51': 'Production',
  '53': 'Transportation'
};

const CATEGORY_ICON = {
  'Management': '/career-icons/management.svg',
  'Business & Finance': '/career-icons/business.svg',
  'Computer & Mathematics': '/career-icons/tech.svg',
  'Architecture & Engineering': '/career-icons/engineering.svg',
  'Science': '/career-icons/science.svg',
  'Community & Social Services': '/career-icons/community.svg',
  'Legal': '/career-icons/legal.svg',
  'Education': '/career-icons/education.svg',
  'Arts & Media': '/career-icons/creative.svg',
  'Healthcare': '/career-icons/health.svg',
  'Healthcare Support': '/career-icons/health.svg',
  'Protective Services': '/career-icons/security.svg',
  'Food Services': '/career-icons/hospitality.svg',
  'Building & Grounds': '/career-icons/construction.svg',
  'Personal Services': '/career-icons/service.svg',
  'Sales': '/career-icons/business.svg',
  'Office & Admin': '/career-icons/admin.svg',
  'Agriculture': '/career-icons/agri.svg',
  'Construction': '/career-icons/construction.svg',
  'Maintenance & Repair': '/career-icons/engineering.svg',
  'Production': '/career-icons/industry.svg',
  'Transportation': '/career-icons/transport.svg'
};

async function main() {
  const reset = process.argv.includes('--reset');
  await initCatalogSchema();
  const db = getCatalogDb();
  if (reset) {
    await run(db, 'DELETE FROM jobs');
  }

  const zipBuffer = await download(ZIP_URL);
  fs.writeFileSync(TMP_ZIP, zipBuffer);

  const zip = new AdmZip(TMP_ZIP);
  const entry = zip.getEntry('Occupation Data.txt');
  if (!entry) {
    throw new Error('Occupation Data.txt not found in zip');
  }
  const content = entry.getData().toString('utf8');
  const lines = content.split(/\r?\n/);
  lines.shift(); // header

  const insert = db.prepare('INSERT OR IGNORE INTO jobs (title, category, tags, image_url, source) VALUES (?, ?, ?, ?, ?)');
  let count = 0;

  for (const line of lines) {
    if (!line.trim()) continue;
    const [code, title, description] = line.split('\t');
    if (!title) continue;
    const major = (code || '').slice(0, 2);
    const category = SOC_MAJOR_GROUPS[major] || 'Other';
    const tags = buildTags(title, description);
    const imageUrl = CATEGORY_ICON[category] || '/career-icons/default.svg';
    insert.run([title.trim(), category, JSON.stringify(tags), imageUrl, 'O*NET 30.1']);
    count += 1;
  }

  insert.finalize();
  console.log(`Imported ${count} jobs into career_catalog.db`);
}

function buildTags(title, description) {
  const tokens = `${title} ${description || ''}`
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  const unique = Array.from(new Set(tokens));
  return unique.slice(0, 6);
}

function run(db, sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => (err ? reject(err) : resolve()));
  });
}

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download: ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', (d) => chunks.push(d));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
