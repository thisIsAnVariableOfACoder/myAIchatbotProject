// FILE: backend/routes/profile.js

const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

router.get('/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  if (req.user.user_type !== 'admin' && String(req.user.user_id) !== String(id)) {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }
  
  global.db.get('SELECT * FROM profiles WHERE user_id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, data: row });
  });
});

router.put('/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const targetId = req.user.user_type === 'admin' ? id : req.user.user_id;
  const { skills, interests, education_level, current_grade, work_experience_years, preferred_work_style } = req.body;
  
  const query = `
    INSERT INTO profiles (user_id, skills, interests, education_level, current_grade, work_experience_years, preferred_work_style, updated_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(user_id) DO UPDATE SET
      skills = ?, interests = ?, education_level = ?, current_grade = ?, work_experience_years = ?, preferred_work_style = ?, updated_at = datetime('now')
  `;
  
  const skillsJson = JSON.stringify(parseArray(skills));
  const interestsJson = JSON.stringify(parseArray(interests));
  
  global.db.run(
    query,
    [
      targetId, skillsJson, interestsJson, education_level, current_grade || null, work_experience_years || null, preferred_work_style || null,
      skillsJson, interestsJson, education_level, current_grade || null, work_experience_years || null, preferred_work_style || null
    ],
    function(err) {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      res.json({ success: true, data: { updated: true } });
    }
  );
});

function parseArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : value.split(',').map(v => v.trim()).filter(Boolean);
    } catch {
      return value.split(',').map(v => v.trim()).filter(Boolean);
    }
  }
  return [];
}

module.exports = router;
