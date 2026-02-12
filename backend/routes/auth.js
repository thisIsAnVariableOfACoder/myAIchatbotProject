// FILE: backend/routes/auth.js

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { JWT_SECRET, ADMIN_EMAIL } = require('../config');
const { requireAuth } = require('../middleware/auth');

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
    
    console.log('Registering user:', { email: normalizedEmail, username: normalizedUsername });
    
    // Check if user already exists by email or username
    const checkQuery = 'SELECT id FROM users WHERE email = ? OR username = ?';
    global.db.get(checkQuery, [normalizedEmail, normalizedUsername || normalizedEmail], async (err, existingUser) => {
      if (err) {
        console.log('Register check DB error:', err.message);
        return res.status(500).json({ success: false, error: 'Lỗi hệ thống' });
      }
      
      if (existingUser) {
        console.log('Register failed: User already exists');
        return res.status(400).json({ success: false, error: 'Tài khoản đã tồn tại' });
      }
      
      // Insert new user
      const insertQuery = 'INSERT INTO users (email, username, password_hash, user_type) VALUES (?, ?, ?, ?)';
      global.db.run(insertQuery, [normalizedEmail, normalizedUsername || normalizedEmail, passwordHash, userType], function(err) {
        if (err) {
          console.log('Register DB error:', err.message);
          return res.status(400).json({ success: false, error: 'Đăng ký thất bại' });
        }
        
        const token = jwt.sign({ 
          user_id: this.lastID, 
          username: normalizedUsername || normalizedEmail, 
          email: normalizedEmail, 
          user_type: userType 
        }, JWT_SECRET, { expiresIn: '7d' });
        
        console.log('User registered successfully:', this.lastID);
        
        res.json({
          success: true,
          data: { 
            user_id: this.lastID, 
            username: normalizedUsername || normalizedEmail, 
            email: normalizedEmail, 
            user_type: userType, 
            token 
          }
        });
      });
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
    
    if (!identifier) {
      return res.status(400).json({ success: false, error: 'Username hoặc email là bắt buộc' });
    }
    
    if (!password || typeof password !== 'string' || password.trim() === '') {
      return res.status(400).json({ success: false, error: 'Mật khẩu là bắt buộc' });
    }
    
    // First try to find user by email
    global.db.get('SELECT * FROM users WHERE email = ?', [identifier], async (err, user) => {
      if (err) {
        console.log('Login DB error:', err.message);
        return res.status(500).json({ success: false, error: 'Lỗi hệ thống khi tìm kiếm tài khoản' });
      }
      
      // If not found by email, try username field
      if (!user) {
        global.db.get('SELECT * FROM users WHERE username = ?', [identifier], async (err2, userByName) => {
          if (err2) {
            console.log('Login by username DB error:', err2.message);
            return res.status(500).json({ success: false, error: 'Lỗi hệ thống khi tìm kiếm tài khoản' });
          }
          
          if (!userByName) {
            return res.status(401).json({ success: false, error: 'Tài khoản không tồn tại. Vui lòng đăng ký trước.' });
          }
          
          // Verify password
          const valid = await bcrypt.compare(password, userByName.password_hash);
          if (!valid) {
            return res.status(401).json({ success: false, error: 'Sai mật khẩu' });
          }
          
          // Generate token
          const token = jwt.sign({ 
            user_id: userByName.id, 
            username: userByName.username || userByName.email, 
            email: userByName.email, 
            user_type: userByName.user_type 
          }, JWT_SECRET, { expiresIn: '7d' });
          
          console.log('Login successful for user:', userByName.email);
          
          res.json({ 
            success: true, 
            data: { 
              user_id: userByName.id, 
              username: userByName.username || userByName.email, 
              email: userByName.email, 
              user_type: userByName.user_type, 
              token 
            } 
          });
        });
        return;
      }
      
      // User found by email - verify password
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ success: false, error: 'Sai mật khẩu' });
      }
      
      const token = jwt.sign({ 
        user_id: user.id, 
        username: user.username || user.email, 
        email: user.email, 
        user_type: user.user_type 
      }, JWT_SECRET, { expiresIn: '7d' });
      
      console.log('Login successful for user:', user.email);
      
      res.json({ 
        success: true, 
        data: { 
          user_id: user.id, 
          username: user.username || user.email, 
          email: user.email, 
          user_type: user.user_type, 
          token 
        } 
      });
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
