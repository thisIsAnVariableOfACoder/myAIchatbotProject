// FILE: backend/routes/admin.js

const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');

router.use(requireAdmin);

router.post('/scenario', (req, res) => {
  const { name, target_user_type, nodes, edges, is_active } = req.body;
  if (!name || !nodes || !edges) {
    return res.status(400).json({ success: false, error: 'name, nodes, edges are required' });
  }
  
  const query = `INSERT INTO scenarios (name, target_user_type, nodes, edges, is_active) VALUES (?, ?, ?, ?, ?)`;
  
  global.db.run(query, [name, target_user_type || null, JSON.stringify(nodes), JSON.stringify(edges), is_active ?? 1],
    function(err) {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      res.json({ success: true, data: { scenario_id: this.lastID } });
    }
  );
});

router.get('/scenarios', (req, res) => {
  global.db.all('SELECT * FROM scenarios WHERE is_active = 1', (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, data: rows });
  });
});

router.get('/scenario/:id', (req, res) => {
  const { id } = req.params;
  global.db.get('SELECT * FROM scenarios WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, data: row });
  });
});

router.put('/scenario/:id', (req, res) => {
  const { id } = req.params;
  const { name, target_user_type, nodes, edges, is_active } = req.body;
  if (!name || !nodes || !edges) {
    return res.status(400).json({ success: false, error: 'name, nodes, edges are required' });
  }

  const query = `UPDATE scenarios SET name = ?, target_user_type = ?, nodes = ?, edges = ?, is_active = ? WHERE id = ?`;
  global.db.run(
    query,
    [name, target_user_type || null, JSON.stringify(nodes), JSON.stringify(edges), is_active ?? 1, id],
    function(err) {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      res.json({ success: true, data: { updated: this.changes > 0 } });
    }
  );
});

router.delete('/scenario/:id', (req, res) => {
  const { id } = req.params;
  global.db.run('DELETE FROM scenarios WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, data: { deleted: this.changes > 0 } });
  });
});

module.exports = router;
