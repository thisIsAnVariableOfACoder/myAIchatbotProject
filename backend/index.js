require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const { initDbIfNeeded } = require('./services/dbInit');
const { initCatalogSchema } = require('./services/careerCatalog');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const chatRoutes = require('./routes/chat');
const adminRoutes = require('./routes/admin');
const analyticsRoutes = require('./routes/analytics');
const exploreRoutes = require('./routes/explore');
const chatbotRoutes = require('./routes/chatbot');

const app = express();

/* =========================
   ENV + BASIC CONFIG
========================= */

const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || "*";

/* =========================
   MIDDLEWARE
========================= */

// CORS fix cho production
// Note: credentials=true cannot be used with Access-Control-Allow-Origin: '*'
const allowAnyOrigin = String(FRONTEND_URL).trim() === '*';
app.use(cors({
  origin: allowAnyOrigin ? true : FRONTEND_URL,
  credentials: !allowAnyOrigin
}));
app.options('*', cors({
  origin: allowAnyOrigin ? true : FRONTEND_URL,
  credentials: !allowAnyOrigin
}));

app.use(express.json());

/* =========================
   DATABASE SETUP
========================= */

// Đảm bảo thư mục database tồn tại
const dbFolder = path.join(__dirname, 'database');
if (!fs.existsSync(dbFolder)) {
  fs.mkdirSync(dbFolder, { recursive: true });
  console.log("📁 Created database folder");
}

const DB_PATH = process.env.DB_PATH || path.join(dbFolder, 'career_advisor.db');

console.log("📦 Using DB at:", DB_PATH);

global.db = new sqlite3.Database(DB_PATH, async (err) => {
  if (err) {
    console.error('❌ DB connect error:', err.message);
    process.exit(1);
  }

  console.log('✅ DB connected');

  try {
    const result = await initDbIfNeeded(global.db);
    if (result?.seeded) {
      console.log('🌱 DB seeded with sample data');
    }

    await initCatalogSchema();
    console.log('📚 Catalog schema ready');

  } catch (e) {
    console.error('❌ DB init failed:', e.message);
  } finally {
    startServer();
  }
});

/* =========================
   ROUTES
========================= */

app.get('/health', (req, res) => {
  res.json({ 
    status: "ok",
    time: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/explore', exploreRoutes);
app.use('/api/chatbot', chatbotRoutes);

/* =========================
   FRONTEND SERVE (OPTIONAL)
========================= */

const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');

const disableFrontendServe = String(process.env.DISABLE_FRONTEND_SERVE || '').trim().toLowerCase() === 'true';
const shouldServeFrontend = !disableFrontendServe;

if (shouldServeFrontend && fs.existsSync(frontendDist)) {
  console.log("🌐 Serving frontend build");

  app.use(express.static(frontendDist));

  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ success: false, error: 'API not found' });
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });

} else {
  console.log("ℹ️ Frontend build not served (use Vite dev server)");

  app.get('/', (_req, res) => {
    res.status(200).send(
      [
        'Backend is running.',
        '',
        'UI is not served from this port in dev mode.',
        'Open the Vite dev server at: http://localhost:5173/',
        'API health check: http://localhost:3001/health'
      ].join('\n')
    );
  });

  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ success: false, error: 'API not found' });
    }
    return res.status(404).send('Not found. In dev mode, open UI at http://localhost:5173/');
  });
}

/* =========================
   START SERVER
========================= */

function startServer() {
  app.listen(PORT, () => {
    console.log('🚀 ===============================');
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔗 Health check: /health`);
    console.log('🚀 ===============================');
  });
}

/* =========================
   ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});
