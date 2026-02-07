const sqlite3 = require('sqlite3').verbose();

/**
 * Service để track career interactions và cập nhật mention frequency
 */

/**
 * Ghi nhận một lần mention của career
 * @param {sqlite3.Database} db - Database instance
 * @param {number} careerId - Career ID
 * @param {string} type - 'question' | 'answer' | 'result'
 */
function recordCareerMention(db, careerId, type = 'answer') {
    return new Promise((resolve, reject) => {
        if (!db) return reject(new Error('Database not initialized'));

        const field = type === 'question' ? 'question_count' : 'answer_count';
        const sql = `UPDATE careers SET ${field} = ${field} + 1 WHERE id = ?`;

        db.run(sql, [careerId], (err) => {
            if (err) return reject(err);

            // Sau khi update count, tính lại frequency
            updateMentionFrequency(db, careerId)
                .then(resolve)
                .catch(reject);
        });
    });
}

/**
 * Cập nhật mention frequency cho một career
 * Frequency = (question_count + answer_count * 2) / total_interactions
 * @param {sqlite3.Database} db
 * @param {number} careerId
 */
function updateMentionFrequency(db, careerId) {
    return new Promise((resolve, reject) => {
        if (!db) return reject(new Error('Database not initialized'));

        // Lấy total interactions từ tất cả careers
        db.get(
            'SELECT SUM(question_count + answer_count * 2) as total FROM careers',
            (err, row) => {
                if (err) return reject(err);

                const total = row?.total || 0;
                if (total === 0) {
                    return resolve(); // Không có data nào
                }

                // Tính frequency cho career này
                db.get(
                    'SELECT question_count, answer_count FROM careers WHERE id = ?',
                    [careerId],
                    (err2, career) => {
                        if (err2) return reject(err2);
                        if (!career) return resolve();

                        const score = (career.question_count || 0) + (career.answer_count || 0) * 2;
                        const frequency = score / total;

                        db.run(
                            'UPDATE careers SET mention_frequency = ?, weighted_score = ? WHERE id = ?',
                            [frequency, score, careerId],
                            (err3) => {
                                if (err3) return reject(err3);
                                resolve();
                            }
                        );
                    }
                );
            }
        );
    });
}

/**
 * Lấy popularity score của career (dựa trên mention_frequency)
 * @param {sqlite3.Database} db
 * @param {number} careerId
 * @returns {Promise<number>}
 */
function getCareerPopularityScore(db, careerId) {
    return new Promise((resolve, reject) => {
        if (!db) return reject(new Error('Database not initialized'));

        db.get(
            'SELECT mention_frequency, weighted_score FROM careers WHERE id = ?',
            [careerId],
            (err, row) => {
                if (err) return reject(err);
                if (!row) return resolve(0);
                resolve(row.mention_frequency || 0);
            }
        );
    });
}

/**
 * Lấy career ID từ tên nghề
 * @param {sqlite3.Database} db
 * @param {string} careerName
 * @returns {Promise<number|null>}
 */
function getCareerIdByName(db, careerName) {
    return new Promise((resolve, reject) => {
        if (!db) return reject(new Error('Database not initialized'));

        db.get(
            'SELECT id FROM careers WHERE name = ?',
            [careerName],
            (err, row) => {
                if (err) return reject(err);
                resolve(row?.id || null);
            }
        );
    });
}

/**
 * Batch update mention frequency cho nhiều careers
 * @param {sqlite3.Database} db
 * @param {Array<{careerName: string, type: string}>} mentions
 */
async function batchRecordMentions(db, mentions) {
    if (!Array.isArray(mentions) || mentions.length === 0) return;

    for (const mention of mentions) {
        try {
            const careerId = await getCareerIdByName(db, mention.careerName);
            if (careerId) {
                await recordCareerMention(db, careerId, mention.type || 'answer');
            }
        } catch (err) {
            console.error(`Error recording mention for ${mention.careerName}:`, err.message);
        }
    }
}

/**
 * Lấy top careers theo popularity
 * @param {sqlite3.Database} db
 * @param {number} limit
 * @returns {Promise<Array>}
 */
function getTopPopularCareers(db, limit = 10) {
    return new Promise((resolve, reject) => {
        if (!db) return reject(new Error('Database not initialized'));

        db.all(
            'SELECT id, name, category, mention_frequency, weighted_score FROM careers WHERE mention_frequency > 0 ORDER BY mention_frequency DESC LIMIT ?',
            [limit],
            (err, rows) => {
                if (err) return reject(err);
                resolve(rows || []);
            }
        );
    });
}

module.exports = {
    recordCareerMention,
    updateMentionFrequency,
    getCareerPopularityScore,
    getCareerIdByName,
    batchRecordMentions,
    getTopPopularCareers
};
