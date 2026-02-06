const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { initDbIfNeeded } = require('./services/dbInit');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const chatRoutes = require('./routes/chat');
const adminRoutes = require('./routes/admin');
const analyticsRoutes = require('./routes/analytics');
const exploreRoutes = require('./routes/explore');
const { initCatalogSchema } = require('./services/careerCatalog');

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'database', 'career_advisor.db');
function startServer() {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
}

global.db = new sqlite3.Database(DB_PATH, async (err) => {
  if (err) {
    console.error('DB connect error:', err.message);
    process.exit(1);
  }
  console.log('DB connected:', DB_PATH);
  try {
    const result = await initDbIfNeeded(global.db);
    if (result.seeded) {
      console.log('DB seeded with sample data');
    }
    await initCatalogSchema();
  } catch (e) {
    console.error('DB init failed:', e.message);
  } finally {
    startServer();
  }
});

app.get('/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/explore', exploreRoutes);

const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ success: false, error: 'Not found' });
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  console.warn('Frontend build not found. Run: npm --prefix frontend run build');
}
