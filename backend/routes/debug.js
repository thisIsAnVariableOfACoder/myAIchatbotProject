const express = require('express');
const router = express.Router();
const {
    resolveSqliteCloudConnectionString,
    sanitizeConnectionString
} = require('../services/dbAdapter');

// ... existing imports ...

// New debug endpoint
router.get('/db-info', (req, res) => {
    try {
        const connectionString = resolveSqliteCloudConnectionString();
        const safeConnection = sanitizeConnectionString(connectionString);

        if (!global.db) {
            return res.status(500).json({
                status: 'error',
                provider: 'sqlitecloud',
                connection: safeConnection,
                error: 'Database is not initialized'
            });
        }

        global.db.get('SELECT COUNT(*) as count FROM jobs', (err, row) => {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    provider: 'sqlitecloud',
                    connection: safeConnection,
                    error: err.message
                });
            }

            global.db.get('SELECT * FROM jobs WHERE title LIKE "%Toán STEM%"', (err2, STEMRow) => {
                if (err2) {
                    return res.status(500).json({
                        status: 'error',
                        provider: 'sqlitecloud',
                        connection: safeConnection,
                        error: err2.message
                    });
                }

                res.json({
                    status: 'ok',
                    provider: 'sqlitecloud',
                    connection: safeConnection,
                    jobCount: row?.count,
                    hasSTEM: !!STEMRow,
                    stemExample: STEMRow,
                    cwd: process.cwd()
                });
            });
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            provider: 'sqlitecloud',
            error: error.message
        });
    }
});

module.exports = router;
