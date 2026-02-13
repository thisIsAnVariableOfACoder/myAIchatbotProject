const { Database } = require('@sqlitecloud/drivers');

function readEnv(...keys) {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === 'string' && value.trim() !== '') {
      return value.trim();
    }
  }
  return '';
}

function normalizeHost(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  return raw
    .replace(/^https?:\/\//i, '')
    .replace(/^sqlitecloud:\/\//i, '')
    .split('/')[0]
    .replace(/\?.*$/, '')
    .trim();
}

function normalizeProvider(value) {
  return String(value || '').trim().toLowerCase();
}

function isRemoteDbEnabled() {
  const provider = normalizeProvider(readEnv('DB_PROVIDER', 'DATABASE_PROVIDER'));
  const hasDirectUrl = Boolean(
    readEnv('SQLITECLOUD_URL', 'SQLITECLOUD_CONNECTION_STRING')
  );
  const hasHostParts = Boolean(
    readEnv('SQLITECLOUD_HOST', 'SQLITECLOUD_SERVER', 'SQLITECLOUD_ENDPOINT')
    && readEnv('SQLITECLOUD_DATABASE', 'SQLITECLOUD_DB')
  );

  if (!provider) return hasDirectUrl || hasHostParts;
  return provider === 'sqlitecloud' || provider === 'sqlite-cloud';
}

function buildConnectionStringFromParts() {
  const hostRaw = readEnv('SQLITECLOUD_HOST', 'SQLITECLOUD_SERVER', 'SQLITECLOUD_ENDPOINT');
  const host = normalizeHost(hostRaw);
  const port = readEnv('SQLITECLOUD_PORT') || '8860';
  const database = readEnv('SQLITECLOUD_DATABASE', 'SQLITECLOUD_DB');
  const apiKey = readEnv('SQLITECLOUD_API_KEY', 'SQLITECLOUD_APIKEY', 'API_KEY');
  const token = readEnv('SQLITECLOUD_TOKEN');
  const username = readEnv('SQLITECLOUD_USERNAME', 'SQLITECLOUD_USER');
  const password = readEnv('SQLITECLOUD_PASSWORD', 'SQLITECLOUD_PASS');
  const insecure = normalizeProvider(readEnv('SQLITECLOUD_INSECURE'));

  if (!host || !database) return '';

  const hasUserPass = Boolean(username || password);
  const authModes = Number(Boolean(apiKey)) + Number(Boolean(token)) + Number(hasUserPass);
  if (authModes === 0) {
    throw new Error(
      'SQLiteCloud auth missing. Set one of: SQLITECLOUD_API_KEY, SQLITECLOUD_TOKEN, or SQLITECLOUD_USERNAME + SQLITECLOUD_PASSWORD.'
    );
  }
  if (authModes > 1) {
    throw new Error(
      'SQLiteCloud auth conflict. Use only one auth mode: API key OR token OR username/password.'
    );
  }

  const userInfo = hasUserPass
    ? `${encodeURIComponent(username)}:${encodeURIComponent(password)}@`
    : '';

  const queryParams = [];
  if (apiKey) queryParams.push(`apikey=${encodeURIComponent(apiKey)}`);
  if (token) queryParams.push(`token=${encodeURIComponent(token)}`);
  if (insecure === '1' || insecure === 'true') queryParams.push('insecure=1');

  const query = queryParams.length ? `?${queryParams.join('&')}` : '';
  return `sqlitecloud://${userInfo}${host}:${port}/${database}${query}`;
}

function resolveSqliteCloudConnectionString() {
  const direct = readEnv('SQLITECLOUD_URL', 'SQLITECLOUD_CONNECTION_STRING');
  if (direct) {
    if (!direct.toLowerCase().startsWith('sqlitecloud://')) {
      throw new Error(
        'SQLITECLOUD_URL must start with "sqlitecloud://". Dashboard links (https://dashboard.sqlitecloud.io/...) are not database connection strings.'
      );
    }
    return direct;
  }

  const fromParts = buildConnectionStringFromParts();
  if (fromParts) return fromParts;

  throw new Error(
    'SQLiteCloud is required. Set SQLITECLOUD_URL (or SQLITECLOUD_CONNECTION_STRING), or SQLITECLOUD_HOST/SQLITECLOUD_SERVER + SQLITECLOUD_DATABASE + auth env vars.'
  );
}

function sanitizeConnectionString(connectionString) {
  if (!connectionString) return '';
  let masked = String(connectionString);
  masked = masked.replace(/(apikey=)[^&]+/gi, '$1***');
  masked = masked.replace(/(token=)[^&]+/gi, '$1***');
  masked = masked.replace(/(password=)[^&]+/gi, '$1***');
  masked = masked.replace(/(sqlitecloud:\/\/[^:\/@]+):[^@\/]+@/i, '$1:***@');
  return masked;
}

async function createDatabaseAdapter(_options = {}) {
  const connectionString = resolveSqliteCloudConnectionString();
  const db = new Database(connectionString);

  await new Promise((resolve, reject) => {
    db.get('SELECT 1 as healthcheck', (err) => (err ? reject(err) : resolve()));
  });

  db.type = 'sqlitecloud';
  db.raw = db;
  return db;
}

module.exports = {
  isRemoteDbEnabled,
  createDatabaseAdapter,
  resolveSqliteCloudConnectionString,
  sanitizeConnectionString
};

