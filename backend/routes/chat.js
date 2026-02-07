const express = require('express');
const https = require('https');
const router = express.Router();
const { matchCareerAsync } = require('../services/matcher');
const { optionalAuth, requireAuth } = require('../middleware/auth');
const { getConversationState, recordAnswer, getNextQuestion, isEnoughInfo } = require('../services/questionEngine');
const { scoreCareersWithLLM, mergeScores, isEnabled: isLlmEnabled } = require('../services/llmScorer');

const MEMORY_MESSAGES = [];
const MIN_CONF_SCORE = 65;
const MIN_CONF_COUNT = 4;
const MAX_QUESTIONS = 36;
 
function safeParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function buildProfileFromState(profile, state, fallbackEducationLevel) {
  const safeProfile = profile || {};
  if (!state) {
    return {
      ...safeProfile,
      education_level: safeProfile.education_level || fallbackEducationLevel || 'high_school'
    };
  }
  const baseSkills = safeParse(safeProfile?.skills, []);
  const baseInterests = safeParse(safeProfile?.interests, []);
  const skillSet = new Set([...(baseSkills || []), ...(state.collectedSkills || [])]);
  const interestSet = new Set([...(baseInterests || []), ...(state.collectedInterests || [])]);
  return {
    ...safeProfile,
    skills: JSON.stringify(Array.from(skillSet)),
    interests: JSON.stringify(Array.from(interestSet)),
    education_level: safeProfile.education_level || fallbackEducationLevel || 'high_school'
  };
}

function buildAnswersText(state, latestMessage) {
  const parts = [];
  if (latestMessage) parts.push(latestMessage);
  if (Array.isArray(state?.answers)) {
    for (const item of state.answers) {
      if (item?.a) parts.push(item.a);
    }
  }
  return parts.join(' ');
}


router.post('/message', optionalAuth, async (req, res) => {
  try {
    const { conversation_id, message, current_node, user_type, request_more } = req.body;
    const authUser = req.user;
    const userId = authUser?.user_id || null;
    const effectiveUserType = authUser?.user_type || user_type || null;
    const wantsMore = Boolean(request_more);

    const convId = conversation_id || `conv_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    if (userId) {
      await ensureConversation(convId, userId, message);
      await saveMessage(convId, userId, 'user', message || '', current_node || null);
      if (!current_node) {
        await logEvent('conversation_started', userId, { conversation_id: convId, user_type: effectiveUserType });
      }
    }

    const conceptReply = await explainConceptIfRequested(message);
    if (conceptReply) {
      if (userId) {
        await saveMessage(convId, userId, 'bot', conceptReply, current_node || null);
      }
      return res.json({
        success: true,
        data: {
          bot_reply: conceptReply,
          options: [],
          next_node: current_node || null,
          conversation_id: convId
        }
      });
    }

    const state = getConversationState(convId, effectiveUserType);
    if (message) recordAnswer(state, message);

    if (isEnoughInfo(state) && !wantsMore) {
      const profile = await getProfile(userId);
      const mergedProfile = buildProfileFromState(profile, state, effectiveUserType);
      const answersText = buildAnswersText(state, message);
      let recommendations = await matchCareerAsync(mergedProfile, {
        message,
        answers: state.answers,
        answersText,
        tags: state.tags
      });
      if (isLlmEnabled()) {
        const candidates = recommendations.map((r) => r.career_name);
        const llmScores = await scoreCareersWithLLM({ profile: mergedProfile, answersText, candidates });
        recommendations = mergeScores(recommendations, llmScores);
      }

      if (shouldAskMore(recommendations, state)) {
        const followUp = getNextQuestion(state, { force: true });
        if (followUp) {
          if (userId) {
            await saveMessage(convId, userId, 'bot', followUp.text, followUp.id);
          }
          return res.json({
            success: true,
            data: {
              bot_reply: followUp.text,
              options: followUp.options,
              next_node: followUp.id,
              conversation_id: convId
            }
          });
        }
      }

      if (userId) {
        await saveMessage(convId, userId, 'bot', 'Tôi đã gợi ý nghề nghiệp phù hợp cho bạn.', null);
        await saveRecommendations(convId, userId, recommendations);
        await logEvent('conversation_completed', userId, { conversation_id: convId });
      }

      return res.json({
        success: true,
        data: {
          bot_reply: 'Đây là gợi ý nghề nghiệp phù hợp:',
          recommendations,
          next_node: null,
          completed: true,
          conversation_id: convId
        }
      });
    }

    let nextQuestion = getNextQuestion(state, { force: wantsMore });
    let finished = false;
    let recommendations = [];
    let answersText = buildAnswersText(state, message);
    const profile = await getProfile(userId);
    const mergedProfile = buildProfileFromState(profile, state, effectiveUserType);
    // Lặp hỏi thêm cho đến khi xác suất nghề nghiệp đủ rõ ràng (ví dụ: nghề top 1 > 40% và chênh lệch với top 2 > 15%)
    while (!nextQuestion && !finished) {
      recommendations = await matchCareerAsync(mergedProfile, {
        message,
        answers: state.answers,
        answersText,
        tags: state.tags
      });
      if (isLlmEnabled()) {
        const candidates = recommendations.map((r) => r.career_name);
        const llmScores = await scoreCareersWithLLM({ profile: mergedProfile, answersText, candidates });
        recommendations = mergeScores(recommendations, llmScores);
      }
      const sorted = recommendations.sort((a, b) => b.probability - a.probability);
      if (sorted.length > 1 && sorted[0].probability > 0.4 && (sorted[0].probability - sorted[1].probability) > 0.15) {
        finished = true;
        break;
      }
      // Nếu chưa đủ rõ ràng, hỏi thêm câu hỏi
      nextQuestion = getNextQuestion(state, { force: true });
      if (nextQuestion) {
        if (userId) {
          await saveMessage(convId, userId, 'bot', nextQuestion.text, nextQuestion.id);
        }
        return res.json({
          success: true,
          data: {
            bot_reply: nextQuestion.text,
            options: nextQuestion.options,
            next_node: nextQuestion.id,
            conversation_id: convId
          }
        });
      }
    }
    // Nếu đã đủ xác suất rõ ràng hoặc hết câu hỏi
    if (finished || !nextQuestion) {
      if (userId) {
        await saveMessage(convId, userId, 'bot', 'Tôi đã gợi ý nghề nghiệp phù hợp cho bạn.', null);
        await saveRecommendations(convId, userId, recommendations);
        await logEvent('conversation_completed', userId, { conversation_id: convId });
      }
      return res.json({
        success: true,
        data: {
          bot_reply: 'Đây là gợi ý nghề nghiệp phù hợp:',
          recommendations,
          next_node: null,
          completed: true,
          conversation_id: convId
        }
      });
    }
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/history/:userId', requireAuth, async (req, res) => {
  const { userId } = req.params;
  if (req.user.user_type !== 'admin' && String(req.user.user_id) !== String(userId)) {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }
  const query = `
    SELECT m.conversation_id,
           COALESCE(c.title, m.conversation_id) as title,
           MIN(m.created_at) as created_at,
           COUNT(*) as message_count,
           COALESCE(MAX(c.updated_at), MAX(m.created_at)) as updated_at
    FROM chat_messages m
    LEFT JOIN conversations c ON c.id = m.conversation_id
    WHERE m.user_id = ?
    GROUP BY m.conversation_id
    ORDER BY updated_at DESC
  `;
  global.db.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: rows });
  });
});

router.put('/conversation/:conversationId', requireAuth, async (req, res) => {
  const { conversationId } = req.params;
  const title = String(req.body?.title || '').trim();
  if (!title) {
    return res.status(400).json({ success: false, error: 'Tên cuộc trò chuyện không hợp lệ' });
  }

  const isAdmin = req.user.user_type === 'admin';
  const userId = req.user.user_id;

  const row = await new Promise((resolve) => {
    global.db.get('SELECT id, user_id FROM conversations WHERE id = ?', [conversationId], (err, r) => {
      if (err) return resolve(null);
      resolve(r || null);
    });
  });

  if (row) {
    if (!isAdmin && String(row.user_id) !== String(userId)) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    global.db.run(
      "UPDATE conversations SET title = ?, updated_at = datetime('now') WHERE id = ?",
      [title, conversationId],
      (err) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, data: { updated: true, title } });
      }
    );
    return;
  }

  const owner = await new Promise((resolve) => {
    global.db.get('SELECT user_id FROM chat_messages WHERE conversation_id = ? LIMIT 1', [conversationId], (err, r) => {
      if (err) return resolve(null);
      resolve(r || null);
    });
  });

  if (!owner) {
    return res.status(404).json({ success: false, error: 'Không tìm thấy cuộc trò chuyện' });
  }
  if (!isAdmin && String(owner.user_id) !== String(userId)) {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }

  global.db.run(
    'INSERT INTO conversations (id, user_id, title) VALUES (?, ?, ?)',
    [conversationId, owner.user_id, title],
    (err) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, data: { created: true, title } });
    }
  );
});

router.delete('/history/:userId', requireAuth, (req, res) => {
  const { userId } = req.params;
  if (req.user.user_type !== 'admin' && String(req.user.user_id) !== String(userId)) {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }
  const delMessages = 'DELETE FROM chat_messages WHERE user_id = ?';
  const delRecs = 'DELETE FROM recommendations WHERE user_id = ?';
  const delConversations = 'DELETE FROM conversations WHERE user_id = ?';
  global.db.serialize(() => {
    global.db.run(delMessages, [userId]);
    global.db.run(delRecs, [userId], function(err) {
      if (err) return res.status(500).json({ success: false, error: err.message });
      global.db.run(delConversations, [userId], (err2) => {
        if (err2) return res.status(500).json({ success: false, error: err2.message });
        res.json({ success: true, data: { deleted: true } });
      });
    });
  });
});

router.get('/messages/:conversationId', requireAuth, (req, res) => {
  const { conversationId } = req.params;
  const isAdmin = req.user.user_type === 'admin';
  const query = isAdmin
    ? 'SELECT * FROM chat_messages WHERE conversation_id = ? ORDER BY created_at ASC'
    : 'SELECT * FROM chat_messages WHERE conversation_id = ? AND user_id = ? ORDER BY created_at ASC';
  const params = isAdmin ? [conversationId] : [conversationId, req.user.user_id];
  global.db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: rows });
  });
});

router.get('/recommendations/:conversationId', requireAuth, (req, res) => {
  const { conversationId } = req.params;
  const isAdmin = req.user.user_type === 'admin';
  const ownerQuery = 'SELECT user_id FROM chat_messages WHERE conversation_id = ? LIMIT 1';
  global.db.get(ownerQuery, [conversationId], (err, row) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (!row) return res.json({ success: true, data: [] });
    if (!isAdmin && String(row.user_id) !== String(req.user.user_id)) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    const recQuery = `
      SELECT career_name, match_score, reasons, learning_path
      FROM recommendations
      WHERE conversation_id = ?
      ORDER BY match_score DESC
    `;
    global.db.all(recQuery, [conversationId], (err2, rows) => {
      if (err2) return res.status(500).json({ success: false, error: err2.message });
      const data = (rows || []).map((r) => ({
        ...r,
        reasons: safeParse(r.reasons, [])
      }));
      res.json({ success: true, data });
    });
  });
});

router.delete('/conversation/:conversationId', requireAuth, (req, res) => {
  const { conversationId } = req.params;
  const isAdmin = req.user.user_type === 'admin';

  const getOwnerQuery = 'SELECT user_id FROM chat_messages WHERE conversation_id = ? LIMIT 1';
  global.db.get(getOwnerQuery, [conversationId], (err, row) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (!row) return res.json({ success: true, data: { deleted: false } });
    if (!isAdmin && String(row.user_id) !== String(req.user.user_id)) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const deleteMessages = 'DELETE FROM chat_messages WHERE conversation_id = ?';
    const deleteRecs = 'DELETE FROM recommendations WHERE conversation_id = ?';
    const deleteConv = 'DELETE FROM conversations WHERE id = ?';
    global.db.serialize(() => {
      global.db.run(deleteMessages, [conversationId]);
      global.db.run(deleteRecs, [conversationId]);
      global.db.run(deleteConv, [conversationId], function(err2) {
        if (err2) return res.status(500).json({ success: false, error: err2.message });
        res.json({ success: true, data: { deleted: true } });
      });
    });
  });
});

async function saveMessage(convId, userId, sender, message, nodeId) {
  if (!global.db) {
    MEMORY_MESSAGES.push({
      conversation_id: convId,
      user_id: userId,
      sender,
      message,
      node_id: nodeId,
      created_at: new Date().toISOString()
    });
    return;
  }

  return new Promise((resolve, reject) => {
    const query = `INSERT INTO chat_messages (conversation_id, user_id, sender, message, node_id)
                   VALUES (?, ?, ?, ?, ?)`;
    global.db.run(query, [convId, userId, sender, message, nodeId], function(err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
}

function deriveTitleFromMessage(message) {
  const text = String(message || '').replace(/\s+/g, ' ').trim();
  if (!text) return null;
  const maxLen = 48;
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 1).trimEnd()}…`;
}

async function ensureConversation(convId, userId, message) {
  if (!global.db) return;
  const defaultTitle = `Cuộc trò chuyện ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`;
  const titleFromMessage = deriveTitleFromMessage(message);
  const existing = await new Promise((resolve) => {
    global.db.get('SELECT id, title FROM conversations WHERE id = ?', [convId], (err, row) => {
      if (err) return resolve(null);
      resolve(row || null);
    });
  });
  if (!existing) {
    return new Promise((resolve, reject) => {
      global.db.run(
        'INSERT INTO conversations (id, user_id, title) VALUES (?, ?, ?)',
        [convId, userId, titleFromMessage || defaultTitle],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }

  await new Promise((resolve, reject) => {
    global.db.run(
      "UPDATE conversations SET updated_at = datetime('now') WHERE id = ?",
      [convId],
      (err) => (err ? reject(err) : resolve())
    );
  });

  if (titleFromMessage && existing.title && existing.title.startsWith('Cuộc trò chuyện')) {
    const count = await new Promise((resolve) => {
      global.db.get(
        'SELECT COUNT(*) as count FROM chat_messages WHERE conversation_id = ?',
        [convId],
        (err, row) => resolve(row?.count || 0)
      );
    });
    if (count <= 1) {
      await new Promise((resolve, reject) => {
        global.db.run(
          "UPDATE conversations SET title = ?, updated_at = datetime('now') WHERE id = ?",
          [titleFromMessage, convId],
          (err) => (err ? reject(err) : resolve())
        );
      });
    }
  }
}

async function getProfile(userId) {
  if (!userId) {
    return { skills: '[]', interests: '[]', education_level: 'high_school' };
  }
  if (!global.db) {
    return { skills: JSON.stringify(['coding']), interests: JSON.stringify(['technology']), education_level: 'high_school' };
  }

  return new Promise((resolve, reject) => {
    global.db.get('SELECT * FROM profiles WHERE user_id = ?', [userId], (err, row) => {
      if (err) reject(err);
      else resolve(row || { skills: '[]', interests: '[]', education_level: 'high_school' });
    });
  });
}

async function saveRecommendations(convId, userId, recommendations) {
  if (!global.db || !Array.isArray(recommendations)) return;
  await new Promise((resolve, reject) => {
    global.db.run('DELETE FROM recommendations WHERE conversation_id = ?', [convId], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
  const query = `INSERT INTO recommendations (conversation_id, user_id, career_name, match_score, reasons, learning_path)
                 VALUES (?, ?, ?, ?, ?, ?)`;
  for (const rec of recommendations) {
    if (Number(rec.match_score || 0) <= 0) continue;
    await new Promise((resolve, reject) => {
      global.db.run(
        query,
        [
          convId,
          userId,
          rec.career_name,
          rec.match_score,
          JSON.stringify(rec.reasons || []),
          rec.learning_path || null
        ],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }
}

async function logEvent(eventType, userId, metadata) {
  if (!global.db) return;
  const query = `INSERT INTO analytics (event_type, user_id, metadata) VALUES (?, ?, ?)`;
  return new Promise((resolve, reject) => {
    global.db.run(query, [eventType, userId, JSON.stringify(metadata || {})], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function shouldAskMore(recommendations, state) {
  if (!Array.isArray(recommendations) || recommendations.length === 0) return true;
  const highCount = recommendations.filter((r) => Number(r.match_score || 0) >= MIN_CONF_SCORE).length;
  if (highCount >= MIN_CONF_COUNT) return false;
  return (state?.answers?.length || 0) < MAX_QUESTIONS;
}

async function explainConceptIfRequested(message) {
  const concept = extractConcept(message);
  if (!concept) return null;
  const summary = await fetchWikiSummary(concept);
  if (summary) {
    return `Giải thích về "${summary.title}": ${summary.extract} (Nguồn: Wikipedia)`;
  }
  return `Tôi chưa tìm thấy thông tin rõ ràng về "${concept}". Bạn có thể mô tả cụ thể hơn không?`;
}

function extractConcept(message) {
  const text = String(message || '').trim().toLowerCase();
  if (!text) return null;
  const triggers = ['giải thích', 'giai thich', 'khái niệm', 'khai niem', 'định nghĩa', 'dinh nghia', 'là gì', 'la gi'];
  if (!triggers.some(t => text.includes(t))) return null;
  let concept = text;
  for (const t of triggers) {
    concept = concept.replace(t, '');
  }
  concept = concept.replace(/[?!.]/g, ' ').replace(/\s+/g, ' ').trim();
  return concept || null;
}

async function fetchWikiSummary(concept) {
  const title = await searchWikiTitle(concept, 'vi');
  const summary = title ? await getWikiSummary(title, 'vi') : null;
  if (summary) return summary;
  const titleEn = await searchWikiTitle(concept, 'en');
  if (!titleEn) return null;
  return getWikiSummary(titleEn, 'en');
}

function searchWikiTitle(query, lang) {
  const url = `https://${lang}.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&namespace=0&format=json`;
  return fetchJson(url).then((data) => {
    const title = Array.isArray(data) && data[1] && data[1][0];
    return title || null;
  }).catch(() => null);
}

function getWikiSummary(title, lang) {
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  return fetchJson(url).then((data) => {
    if (data && data.extract) {
      return { title: data.title || title, extract: data.extract };
    }
    return null;
  }).catch(() => null);
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let raw = '';
      res.on('data', (chunk) => { raw += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(raw));
        } catch (err) {
          reject(err);
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(4000, () => {
      req.destroy(new Error('timeout'));
    });
  });
}

module.exports = router;
