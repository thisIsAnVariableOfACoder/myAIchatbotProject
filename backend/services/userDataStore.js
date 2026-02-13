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

function resolveUserDataConnectionString() {
  return readEnv('SQLITECLOUD_URL', 'SQLITECLOUD_USERDATA_URL', 'USERDATA_SQLITECLOUD_URL');
}

let cachedDb = null;
let initPromise = null;
let detectedMode = null;

function quoteSqlString(value) {
  return String(value || '').replace(/'/g, "''");
}

function sqlLiteral(value) {
  if (value === null || typeof value === 'undefined') return 'NULL';
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (typeof value === 'boolean') return value ? '1' : '0';
  return `'${quoteSqlString(value)}'`;
}

function compileSql(sql, params = []) {
  let out = String(sql || '');
  for (const param of params || []) {
    out = out.replace(/\?/, sqlLiteral(param));
  }
  return out;
}

async function resolveMode(db) {
  if (detectedMode) return detectedMode;
  if (typeof db.sql === 'function') {
    try {
      const probe = db.sql`SELECT 1 as healthcheck;`;
      if (probe && typeof probe.then === 'function') await probe;
      detectedMode = 'sql';
      return detectedMode;
    } catch {
      // fallback to callback
    }
  }
  detectedMode = 'callback';
  return detectedMode;
}

function run(db, sql, params = []) {
  return resolveMode(db).then((mode) => {
    if (mode === 'sql') {
      const statement = compileSql(sql, params);
      const result = db.sql(statement);
      if (result && typeof result.then === 'function') {
        return result.then(() => ({ changes: 1 }));
      }
      return { changes: 1 };
    }

    return new Promise((resolve, reject) => {
      db.run(sql, params, function onRun(err) {
        if (err) return reject(err);
        resolve(this);
      });
    });
  });
}

function get(db, sql, params = []) {
  return resolveMode(db).then((mode) => {
    if (mode === 'sql') {
      const statement = compileSql(sql, params);
      return Promise.resolve(db.sql(statement))
        .then((rows) => (Array.isArray(rows) && rows.length > 0 ? rows[0] : null));
    }

    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) return reject(err);
        resolve(row || null);
      });
    });
  });
}

async function createUserDataDb() {
  const connectionString = resolveUserDataConnectionString();
  if (!connectionString) return null;
  if (!connectionString.toLowerCase().startsWith('sqlitecloud://')) {
    throw new Error('Invalid SQLiteCloud URL: must start with sqlitecloud://');
  }

  const db = new Database(connectionString);
  const mode = await resolveMode(db);

  if (mode === 'callback') {
    await new Promise((resolve, reject) => {
      db.get('SELECT 1 as healthcheck', (err) => (err ? reject(err) : resolve()));
    });
  }

  return db;
}

async function ensureUserDataSchema(db) {
  if (!db) return;

  await run(db, `
    CREATE TABLE IF NOT EXISTS user_accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      app_user_id INTEGER,
      username VARCHAR(100),
      email VARCHAR(255) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      user_type VARCHAR(50) NOT NULL,
      source VARCHAR(50) DEFAULT 'auth_register',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(email)
    )
  `);

  await run(db, 'CREATE INDEX IF NOT EXISTS idx_user_accounts_email ON user_accounts(email)');
  await run(db, 'CREATE INDEX IF NOT EXISTS idx_user_accounts_app_user_id ON user_accounts(app_user_id)');

  await run(db, `
    CREATE TABLE IF NOT EXISTS user_chat_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      app_user_id INTEGER,
      conversation_id VARCHAR(100) NOT NULL,
      message_id INTEGER,
      sender VARCHAR(20) NOT NULL,
      message TEXT NOT NULL,
      node_id VARCHAR(50),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(db, 'CREATE INDEX IF NOT EXISTS idx_user_chat_history_user ON user_chat_history(app_user_id)');
  await run(db, 'CREATE INDEX IF NOT EXISTS idx_user_chat_history_conv ON user_chat_history(conversation_id)');

  await run(db, `
    CREATE TABLE IF NOT EXISTS user_career_probabilities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      app_user_id INTEGER,
      conversation_id VARCHAR(100) NOT NULL,
      career_name VARCHAR(255) NOT NULL,
      match_score FLOAT NOT NULL DEFAULT 0,
      probability FLOAT NOT NULL DEFAULT 0,
      reasons TEXT,
      learning_path TEXT,
      rank_order INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(db, 'CREATE INDEX IF NOT EXISTS idx_user_career_probabilities_user ON user_career_probabilities(app_user_id)');
  await run(db, 'CREATE INDEX IF NOT EXISTS idx_user_career_probabilities_conv ON user_career_probabilities(conversation_id)');
}

async function getUserDataDb() {
  if (cachedDb) return cachedDb;
  if (!initPromise) {
    initPromise = (async () => {
      const db = await createUserDataDb();
      if (!db) return null;
      await ensureUserDataSchema(db);
      cachedDb = db;
      return cachedDb;
    })().finally(() => {
      initPromise = null;
    });
  }
  return initPromise;
}

async function mirrorUserAccount({ appUserId, username, email, passwordHash, userType, source = 'auth_sync' }) {
  const db = await getUserDataDb();
  if (!db) return;

  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedUsername = String(username || '').trim() || null;
  const normalizedType = String(userType || 'high_school').trim().toLowerCase();
  const normalizedSource = String(source || 'auth_sync').trim().toLowerCase() || 'auth_sync';

  await run(
    db,
    `
      INSERT INTO user_accounts (app_user_id, username, email, password_hash, user_type, source, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(email) DO UPDATE SET
        app_user_id = excluded.app_user_id,
        username = excluded.username,
        password_hash = excluded.password_hash,
        user_type = excluded.user_type,
        source = excluded.source,
        updated_at = datetime('now')
    `,
    [appUserId || null, normalizedUsername, normalizedEmail, passwordHash, normalizedType, normalizedSource]
  );

  const persisted = await get(db, 'SELECT id FROM user_accounts WHERE lower(email) = ? LIMIT 1', [normalizedEmail]);
  if (!persisted?.id) {
    throw new Error('Mirror user_accounts failed for userDATA database');
  }
}

async function mirrorChatMessage({ appUserId, conversationId, messageId, sender, message, nodeId, createdAt }) {
  const db = await getUserDataDb();
  if (!db) return;
  if (!conversationId || !sender || typeof message === 'undefined' || message === null) return;

  await run(
    db,
    `
      INSERT INTO user_chat_history (app_user_id, conversation_id, message_id, sender, message, node_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      appUserId || null,
      String(conversationId),
      Number.isFinite(Number(messageId)) ? Number(messageId) : null,
      String(sender),
      String(message),
      nodeId || null,
      createdAt || new Date().toISOString()
    ]
  );
}

async function mirrorCareerProbabilities({ appUserId, conversationId, recommendations }) {
  const db = await getUserDataDb();
  if (!db) return;

  const normalizedConversationId = String(conversationId || '').trim();
  if (!normalizedConversationId) return;

  if (appUserId) {
    await run(
      db,
      'DELETE FROM user_career_probabilities WHERE conversation_id = ? AND app_user_id = ?',
      [normalizedConversationId, appUserId]
    );
  } else {
    await run(
      db,
      'DELETE FROM user_career_probabilities WHERE conversation_id = ?',
      [normalizedConversationId]
    );
  }

  if (!Array.isArray(recommendations) || recommendations.length === 0) return;

  for (let idx = 0; idx < recommendations.length; idx += 1) {
    const rec = recommendations[idx] || {};
    const careerName = String(rec.career_name || '').trim();
    if (!careerName) continue;

    const matchScore = Number(rec.match_score);
    const probability = Number(rec.probability);

    await run(
      db,
      `
        INSERT INTO user_career_probabilities
          (app_user_id, conversation_id, career_name, match_score, probability, reasons, learning_path, rank_order, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `,
      [
        appUserId || null,
        normalizedConversationId,
        careerName,
        Number.isFinite(matchScore) ? matchScore : 0,
        Number.isFinite(probability) ? probability : 0,
        JSON.stringify(Array.isArray(rec.reasons) ? rec.reasons : []),
        rec.learning_path || null,
        idx + 1
      ]
    );
  }
}

async function deleteMirroredConversationData({ appUserId, conversationId }) {
  const db = await getUserDataDb();
  if (!db) return;

  const normalizedConversationId = String(conversationId || '').trim();
  if (!normalizedConversationId) return;

  if (appUserId) {
    await run(
      db,
      'DELETE FROM user_chat_history WHERE conversation_id = ? AND app_user_id = ?',
      [normalizedConversationId, appUserId]
    );
    await run(
      db,
      'DELETE FROM user_career_probabilities WHERE conversation_id = ? AND app_user_id = ?',
      [normalizedConversationId, appUserId]
    );
    return;
  }

  await run(db, 'DELETE FROM user_chat_history WHERE conversation_id = ?', [normalizedConversationId]);
  await run(db, 'DELETE FROM user_career_probabilities WHERE conversation_id = ?', [normalizedConversationId]);
}

async function deleteMirroredUserHistory({ appUserId }) {
  const db = await getUserDataDb();
  if (!db) return;
  if (!appUserId) return;

  await run(db, 'DELETE FROM user_chat_history WHERE app_user_id = ?', [appUserId]);
  await run(db, 'DELETE FROM user_career_probabilities WHERE app_user_id = ?', [appUserId]);
}

module.exports = {
  resolveUserDataConnectionString,
  ensureUserDataSchema,
  getUserDataDb,
  mirrorUserAccount,
  mirrorChatMessage,
  mirrorCareerProbabilities,
  deleteMirroredConversationData,
  deleteMirroredUserHistory
};

