require('dotenv').config();

const {
  createDatabaseAdapter,
  sanitizeConnectionString,
  resolveSqliteCloudConnectionString
} = require('../services/dbAdapter');
const {
  syncCareersFromCareerLibrary,
  syncJobsFromCareerLibrary
} = require('../services/dbInit');

function parseArgs(argv) {
  const args = new Set(argv || []);
  return {
    force: args.has('--force'),
    careersOnly: args.has('--careers-only'),
    jobsOnly: args.has('--jobs-only')
  };
}

function getCount(db, table) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT COUNT(*) as count FROM ${table}`, (err, row) => {
      if (err) return reject(err);
      resolve(row?.count || 0);
    });
  });
}

function getSampleJobs(db) {
  const sql = `
    SELECT title, category, source
    FROM jobs
    WHERE lower(title) IN (
      'sanitation worker',
      'cleaner',
      'waste management specialist',
      'real estate agent',
      'sales representative',
      'marketing specialist'
    )
    ORDER BY title ASC
  `;
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) return reject(err);
      resolve(rows || []);
    });
  });
}

function logProgress(prefix) {
  let lastLogged = 0;
  return ({ processed, expected }) => {
    const pct = expected > 0 ? Math.floor((processed / expected) * 100) : 100;
    if (pct >= lastLogged + 5 || processed === expected) {
      lastLogged = pct;
      console.log(`${prefix}: ${processed}/${expected} (${pct}%)`);
    }
  };
}

async function main() {
  const { force, careersOnly, jobsOnly } = parseArgs(process.argv.slice(2));
  const shouldSyncCareers = !jobsOnly;
  const shouldSyncJobs = !careersOnly;

  if (!shouldSyncCareers && !shouldSyncJobs) {
    throw new Error('Invalid options: both --careers-only and --jobs-only provided');
  }

  const connection = resolveSqliteCloudConnectionString();
  console.log('🌐 SQLiteCloud target:', sanitizeConnectionString(connection));
  console.log(`⚙️  options: force=${force} careers=${shouldSyncCareers} jobs=${shouldSyncJobs}`);

  const db = await createDatabaseAdapter();
  try {
    const beforeCareers = await getCount(db, 'careers').catch(() => 0);
    const beforeJobs = await getCount(db, 'jobs').catch(() => 0);
    console.log(`📊 before: careers=${beforeCareers} jobs=${beforeJobs}`);

    let careerResult = null;
    let jobsResult = null;

    if (shouldSyncCareers) {
      careerResult = await syncCareersFromCareerLibrary(db, {
        force,
        batchSize: Number(process.env.CAREER_SYNC_BATCH_SIZE || 500),
        onProgress: logProgress('📌 careers sync')
      });
      console.log('📌 careers result:', careerResult);
    }

    if (shouldSyncJobs) {
      jobsResult = await syncJobsFromCareerLibrary(db, {
        force,
        batchSize: Number(process.env.JOBS_SYNC_BATCH_SIZE || 500),
        onProgress: logProgress('📚 jobs sync')
      });
      console.log('📚 jobs result:', jobsResult);
    }

    const afterCareers = await getCount(db, 'careers').catch(() => 0);
    const afterJobs = await getCount(db, 'jobs').catch(() => 0);
    const sample = await getSampleJobs(db).catch(() => []);

    console.log(`✅ after: careers=${afterCareers} jobs=${afterJobs}`);
    console.log('🧪 sample jobs:', sample);
  } finally {
    if (typeof db.close === 'function') {
      await new Promise((resolve) => db.close(() => resolve()));
    }
  }
}

main().catch((err) => {
  console.error('❌ remote sync failed:', err.message || err);
  process.exit(1);
});

