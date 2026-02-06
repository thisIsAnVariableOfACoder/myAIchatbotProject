// FILE: backend/routes/analytics.js

const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');

router.get('/summary', requireAdmin, (req, res) => {
  const { start_date, end_date } = req.query;
  
  Promise.all([
    getCount('users', start_date, end_date),
    getConversationCount(start_date, end_date),
    getTopCareers(start_date, end_date)
  ]).then(([totalUsers, totalConversations, topCareers]) => {
    res.json({
      success: true,
      data: { total_users: totalUsers, total_conversations: totalConversations, top_careers: topCareers }
    });
  }).catch(err => {
    res.status(500).json({ success: false, error: err.message });
  });
});

function getCount(table, start, end) {
  return new Promise((resolve, reject) => {
    const query = `SELECT COUNT(*) as count FROM ${table} WHERE created_at BETWEEN ? AND ?`;
    global.db.get(query, [start || '2020-01-01', end || '2030-12-31'], (err, row) => {
      if (err) reject(err);
      else resolve(row.count);
    });
  });
}

function getConversationCount(start, end) {
  return new Promise((resolve, reject) => {
    const query = `SELECT COUNT(DISTINCT conversation_id) as count FROM chat_messages 
                   WHERE created_at BETWEEN ? AND ?`;
    global.db.get(query, [start || '2020-01-01', end || '2030-12-31'], (err, row) => {
      if (err) reject(err);
      else resolve(row.count);
    });
  });
}

function getTopCareers(start, end) {
  return new Promise((resolve, reject) => {
    const query = `SELECT career_name, COUNT(*) as count FROM recommendations 
                   WHERE created_at BETWEEN ? AND ?
                   GROUP BY career_name ORDER BY count DESC LIMIT 5`;
    global.db.all(query, [start || '2020-01-01', end || '2030-12-31'], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

module.exports = router;
