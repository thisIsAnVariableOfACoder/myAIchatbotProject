// FILE: backend/routes/auth.js

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { JWT_SECRET, ADMIN_EMAIL } = require('../config');
const { requireAuth } = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const { email, password, user_type } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email và mật khẩu là bắt buộc' });
    }
    const normalizedEmail = String(email).trim().toLowerCase();
    if (normalizedEmail === String(ADMIN_EMAIL || '').trim().toLowerCase()) {
      return res.status(400).json({ success: false, error: 'Tài khoản admin là cố định, không thể tạo mới' });
    }
    if (user_type === 'admin') {
      return res.status(400).json({ success: false, error: 'Không thể tạo tài khoản admin' });
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    const userType = user_type || 'high_school';
    
    const query = 'INSERT INTO users (email, password_hash, user_type) VALUES (?, ?, ?)';
    global.db.run(query, [email, passwordHash, userType], function(err) {
      if (err) {
        return res.status(400).json({ success: false, error: 'Email đã tồn tại' });
      }
      
      const token = jwt.sign({ user_id: this.lastID, email, user_type: userType }, JWT_SECRET, { expiresIn: '7d' });
      
      res.json({
        success: true,
        data: { user_id: this.lastID, email, user_type: userType, token }
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    global.db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err || !user) {
        return res.status(401).json({ success: false, error: 'Sai email hoặc mật khẩu' });
      }
      
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ success: false, error: 'Sai email hoặc mật khẩu' });
      }
      
      const token = jwt.sign({ user_id: user.id, email: user.email, user_type: user.user_type }, JWT_SECRET, { expiresIn: '7d' });
      
      res.json({ success: true, data: { user_id: user.id, email: user.email, user_type: user.user_type, token } });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ success: true, data: req.user });
});

module.exports = router;
