const express = require('express');
const router = express.Router();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// ... existing imports ...

// New debug endpoint
router.get('/db-info', (req, res) => {
    const dbPath = process.env.CAREER_CATALOG_DB_PATH
        || path.join(__dirname, '..', 'database', 'career_catalog.db');

    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            return res.json({
                status: 'error',
                path: dbPath,
                error: err.message
            });
        }

        db.get('SELECT COUNT(*) as count FROM jobs', (err, row) => {
            db.get('SELECT * FROM jobs WHERE title LIKE "%Toán STEM%"', (err2, STEMRow) => {
                db.close();
                res.json({
                    status: 'ok',
                    path: dbPath,
                    resolvedPath: path.resolve(dbPath),
                    jobCount: row?.count,
                    hasSTEM: !!STEMRow,
                    stemExample: STEMRow,
                    cwd: process.cwd(),
                    envVar: process.env.CAREER_CATALOG_DB_PATH
                });
            });
        });
    });
});

module.exports = router;
