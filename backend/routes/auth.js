// FILE: backend/routes/auth.js

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { JWT_SECRET, ADMIN_EMAIL } = require('../config');
const { requireAuth } = require('../middleware/auth');
const { mirrorUserAccount } = require('../services/userDataStore');

function hasColumn(tableName, columnName) {
  return new Promise((resolve) => {
    if (!global.db) return resolve(false);
    global.db.all(`PRAGMA table_info(${tableName})`, (err, rows) => {
      if (err || !Array.isArray(rows)) return resolve(false);
      resolve(rows.some((col) => col?.name === columnName));
    });
  });
}

function updateLastLogin(userId) {
  if (!global.db || !userId) return;
  global.db.run(
    "UPDATE users SET last_login = datetime('now') WHERE id = ?",
    [userId],
    () => {}
  );
}

function dbGet(query, params = []) {
  return new Promise((resolve, reject) => {
    if (!global.db) return resolve(null);
    global.db.get(query, params, (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
}

function dbRun(query, params = []) {
  return new Promise((resolve, reject) => {
    if (!global.db) return reject(new Error('Database not initialized'));
    global.db.run(query, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function getEmailLocalPart(value) {
  const email = String(value || '').trim().toLowerCase();
  if (!email) return '';
  const atIndex = email.indexOf('@');
  if (atIndex <= 0) return email;
  return email.slice(0, atIndex);
}

async function findUserForLogin(identifier, usernameExists) {
  let user = await dbGet('SELECT * FROM users WHERE lower(email) = ?', [identifier]);

  if (!user && usernameExists) {
    user = await dbGet('SELECT * FROM users WHERE lower(username) = ?', [identifier]);
  }

  // Legacy fallback: allow login by email local-part (before @) for old accounts without username
  if (!user && !identifier.includes('@')) {
    user = await dbGet(
      `SELECT *
       FROM users
       WHERE lower(
         substr(
           email,
           1,
           CASE
             WHEN instr(email, '@') > 0 THEN instr(email, '@') - 1
             ELSE length(email)
           END
         )
       ) = ?
       LIMIT 1`,
      [identifier]
    );
  }

  return user || null;
}

router.post('/register', async (req, res) => {
  try {
    console.log('Register request body:', JSON.stringify(req.body));
    const { username, email, password, user_type } = req.body;
    
    // Determine primary identifier and email
    let primaryIdentifier = username || email;
    let normalizedEmail = email ? String(email).trim().toLowerCase() : null;
    
    // If no email provided, use username as email (for backward compatibility)
    if (!normalizedEmail) {
      normalizedEmail = String(primaryIdentifier).trim().toLowerCase();
    }
    
    const normalizedUsername = username ? String(username).trim() : null;
    
    if (!primaryIdentifier || typeof primaryIdentifier !== 'string' || primaryIdentifier.trim() === '') {
      console.log('Register failed: identifier missing');
      return res.status(400).json({ success: false, error: 'Username hoặc email là bắt buộc' });
    }
    
    if (!password || typeof password !== 'string' || password.trim() === '') {
      console.log('Register failed: password missing');
      return res.status(400).json({ success: false, error: 'Mật khẩu là bắt buộc' });
    }
    
    if (normalizedEmail === String(ADMIN_EMAIL || '').trim().toLowerCase()) {
      console.log('Register failed: admin email');
      return res.status(400).json({ success: false, error: 'Tài khoản admin là cố định, không thể tạo mới' });
    }
    
    if (user_type === 'admin') {
      console.log('Register failed: user_type is admin');
      return res.status(400).json({ success: false, error: 'Không thể tạo tài khoản admin' });
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    const userType = user_type || 'high_school';
    const usernameExists = await hasColumn('users', 'username');

    let loginName = normalizedUsername || getEmailLocalPart(normalizedEmail) || normalizedEmail;
    if (!loginName) {
      loginName = normalizedEmail;
    }
    
    console.log('Registering user:', { email: normalizedEmail, username: normalizedUsername });

    // Check duplicates (case-insensitive)
    const existingUser = usernameExists
      ? await dbGet('SELECT id FROM users WHERE lower(email) = ? OR lower(username) = ?', [normalizedEmail, loginName.toLowerCase()])
      : await dbGet('SELECT id FROM users WHERE lower(email) = ?', [normalizedEmail]);

    if (existingUser) {
      console.log('Register failed: User already exists');
      return res.status(400).json({ success: false, error: 'Tài khoản đã tồn tại' });
    }

    // Insert new user (fallback if username column chưa có trên production DB)
    const insertQuery = usernameExists
      ? 'INSERT INTO users (email, username, password_hash, user_type) VALUES (?, ?, ?, ?)'
      : 'INSERT INTO users (email, password_hash, user_type) VALUES (?, ?, ?)';
    const insertParams = usernameExists
      ? [normalizedEmail, loginName, passwordHash, userType]
      : [normalizedEmail, passwordHash, userType];

    const result = await dbRun(insertQuery, insertParams);

    if (!result || !result.lastID) {
      throw new Error('Đăng ký thất bại: không nhận được user_id từ database');
    }

    // Verify persistence to online DB immediately (defensive for cloud drivers)
    const insertedUser = await dbGet('SELECT id, email, username, user_type FROM users WHERE id = ? LIMIT 1', [result.lastID]);
    if (!insertedUser) {
      throw new Error('Đăng ký thất bại: user chưa được lưu vào database');
    }

    if (String(insertedUser.email || '').toLowerCase() !== normalizedEmail) {
      throw new Error('Đăng ký thất bại: dữ liệu email lưu không khớp');
    }

    await mirrorUserAccount({
      appUserId: result.lastID,
      username: loginName,
      email: normalizedEmail,
      passwordHash,
      userType,
      source: 'auth_register'
    });

    const token = jwt.sign({
      user_id: result.lastID,
      username: loginName,
      email: normalizedEmail,
      user_type: userType
    }, JWT_SECRET, { expiresIn: '7d' });

    console.log('User registered successfully:', result.lastID);

    res.json({
      success: true,
      data: {
        user_id: result.lastID,
        username: loginName,
        email: normalizedEmail,
        user_type: userType,
        token
      }
    });
  } catch (error) {
    console.log('Register error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Normalize identifier - accept both username and email
    const identifier = (username || email || '').trim().toLowerCase();
    const usernameExists = await hasColumn('users', 'username');
    
    if (!identifier) {
      return res.status(400).json({ success: false, error: 'Username hoặc email là bắt buộc' });
    }
    
    if (!password || typeof password !== 'string' || password.trim() === '') {
      return res.status(400).json({ success: false, error: 'Mật khẩu là bắt buộc' });
    }
    
    const user = await findUserForLogin(identifier, usernameExists);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Tài khoản không tồn tại. Vui lòng đăng ký trước.' });
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.password_hash || '');
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Sai mật khẩu' });
    }

    updateLastLogin(user.id);

    const resolvedUsername = (usernameExists ? user.username : null) || getEmailLocalPart(user.email) || user.email;

    try {
      await mirrorUserAccount({
        appUserId: user.id,
        username: resolvedUsername,
        email: user.email,
        passwordHash: user.password_hash || '',
        userType: user.user_type,
        source: 'auth_login'
      });
    } catch (mirrorError) {
      console.warn('Login mirror warning:', mirrorError.message);
    }

    const token = jwt.sign({
      user_id: user.id,
      username: resolvedUsername,
      email: user.email,
      user_type: user.user_type
    }, JWT_SECRET, { expiresIn: '7d' });

    console.log('Login successful for user:', user.email);

    res.json({
      success: true,
      data: {
        user_id: user.id,
        username: resolvedUsername,
        email: user.email,
        user_type: user.user_type,
        token
      }
    });
  } catch (error) {
    console.log('Login error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/me', requireAuth, (req, res) => {
  const user = req.user || {};
  res.json({
    success: true,
    data: {
      ...user,
      username: user.username || user.email
    }
  });
});

module.exports = router;
