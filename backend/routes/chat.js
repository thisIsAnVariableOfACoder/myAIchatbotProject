const express = require('express');
const https = require('https');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const {
  getConversationState,
  recordAnswer,
  getNextQuestion,
  getCareerRecommendations,
  serializeConversationState,
  hydrateConversationState
} = require('../services/questionEngine');
const llmScorer = require('../services/llmScorer');
const { isEnabled: isLlmEnabled } = llmScorer;
const {
  mirrorChatMessage,
  mirrorCareerProbabilities,
  deleteMirroredConversationData,
  deleteMirroredUserHistory
} = require('../services/userDataStore');

const MEMORY_MESSAGES = [];
const MIN_CONF_SCORE = 1;
const MIN_CONF_COUNT = 5;
const MAX_QUESTIONS = 50;
const MIN_REFINEMENT_QUESTIONS = 14;
const EXTRA_REFINEMENT_QUESTIONS_ON_REQUEST = 12;

function getRequiredRefinementQuestions(state, requestedMore) {
  const explicitlyRequested = Boolean(requestedMore || state?.forceDeeperRefinement);
  return explicitlyRequested
    ? MIN_REFINEMENT_QUESTIONS + EXTRA_REFINEMENT_QUESTIONS_ON_REQUEST
    : MIN_REFINEMENT_QUESTIONS;
}

function isPotentialQuestionText(message) {
  const text = String(message || '').trim();
  if (!text) return false;
  return text.includes('?');
}

function safeParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function normalizeUserType(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'high_school' || normalized === 'university' || normalized === 'professional') {
    return normalized;
  }
  return null;
}

async function loadProfileUserTypeFromDb(userId) {
  if (!global.db || !userId) return null;
  const row = await new Promise((resolve) => {
    global.db.get(
      'SELECT education_level FROM profiles WHERE user_id = ? LIMIT 1',
      [userId],
      (err, r) => {
        if (err) return resolve(null);
        resolve(r || null);
      }
    );
  });
  return normalizeUserType(row?.education_level);
}

function makeConversationalQuestion(question, turnIndex = 0) {
  const text = String(question || '').trim();
  if (!text) return '';
  if (/^(cảm ơn|mình hiểu|mình ghi nhận|rất tốt|tuyệt vời|điều đó rất hữu ích)/i.test(text)) {
    return text;
  }

  const openers = [
    'Cảm ơn bạn đã chia sẻ.',
    'Mình hiểu hơn về bạn rồi.',
    'Thông tin này rất hữu ích cho tư vấn.'
  ];
  const idx = Math.abs(Number(turnIndex || 0)) % openers.length;
  return `${openers[idx]} ${text}`;
}

function normalizeSuggestionText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function isQuestionSuggestion(text) {
  const value = normalizeSuggestionText(text).toLowerCase();
  if (!value) return false;
  return value.includes('?');
}

function isAnswerSuggestion(text) {
  const value = normalizeSuggestionText(text);
  if (!value) return false;
  if (isQuestionSuggestion(value)) return false;

  const simpleYesNo = /^(có|không|có thể|chưa chắc|đúng|sai)$/i;
  if (simpleYesNo.test(value)) return true;

  const wordCount = value.split(' ').filter(Boolean).length;
  return wordCount <= 6;
}

function stripInlineSuggestionText(text) {
  const lines = String(text || '')
    .replace(/\r\n/g, '\n')
    .split('\n');

  const filtered = lines.filter((line) => {
    const value = String(line || '').trim();
    if (!value) return true;
    return !/(suggested question|suggested answer|gợi ý câu hỏi|goi y cau hoi|gợi ý câu trả lời|goi y cau tra loi)\s*:/i.test(value);
  });

  return filtered.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function pickSuggestedQuestions(suggestions, mode = 'question') {
  const normalized = Array.isArray(suggestions)
    ? suggestions
      .map((item) => normalizeSuggestionText(item))
      .filter(Boolean)
    : [];

  if (normalized.length === 0) return [];

  let filtered = [];
  if (mode === 'answer') {
    filtered = normalized.filter((item) => isAnswerSuggestion(item));
    if (filtered.length === 0) {
      filtered = normalized.filter((item) => !item.includes('?'));
    }
  } else {
    filtered = normalized.filter((item) => isQuestionSuggestion(item));
  }

  if (filtered.length === 0) {
    filtered = normalized;
  }

  const unique = Array.from(new Set(filtered)).slice(0, 3);
  return unique;
}

function normalizeRecommendationsWithProbability(recommendations) {
  if (!Array.isArray(recommendations) || recommendations.length === 0) return [];

  const sanitized = recommendations
    .map((rec) => ({
      ...rec,
      career_name: String(rec?.career_name || '').trim(),
      match_score: Math.max(0, Math.min(100, Number(rec?.match_score || 0))),
      reasons: Array.isArray(rec?.reasons) ? rec.reasons : []
    }))
    .filter((rec) => rec.career_name && rec.match_score > 0)
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 10);

  if (sanitized.length === 0) return [];

  const maxScore = Math.max(...sanitized.map((r) => r.match_score));
  const temperature = 12;
  const weights = sanitized.map((r) => Math.exp((r.match_score - maxScore) / temperature));
  const sumWeights = weights.reduce((sum, w) => sum + w, 0);

  return sanitized.map((r, idx) => ({
    ...r,
    probability: sumWeights > 0 ? (weights[idx] / sumWeights) : (1 / sanitized.length)
  }));
}

function getQuestionCount(state) {
  const all = [...(state?.answers || []), ...(state?.refinementAnswers || [])];
  return all.filter((a) => String(a?.questionId || '').startsWith('ai_question_')).length;
}

function getRefinementQuestionCount(state) {
  const all = [...(state?.answers || []), ...(state?.refinementAnswers || [])];
  return all.filter((a) => String(a?.questionId || '').startsWith('ai_refine_')).length;
}

function isAffirmativeRefinementRequest(message) {
  const text = String(message || '').trim().toLowerCase();
  if (!text) return false;
  return /(chua hai long|chưa hài lòng|hoi tiep|hỏi thêm|hoi them|muon them|muốn thêm|them cau hoi|thêm câu hỏi|tiep tuc|tiếp tục)/i.test(text);
}

function buildProfileFromState(profile, state, fallbackEducationLevel) {
  const safeProfile = { ...(state?.profile || {}), ...(profile || {}) };
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

async function loadConversationState(convId, userId, userTypeFallback) {
  if (!global.db || !convId || !userId) return null;
  const row = await new Promise((resolve) => {
    global.db.get(
      'SELECT state_json FROM conversation_state WHERE conversation_id = ? AND user_id = ? LIMIT 1',
      [convId, userId],
      (err, r) => {
        if (err) return resolve(null);
        resolve(r || null);
      }
    );
  });
  if (!row?.state_json) return null;
  const parsed = safeParse(row.state_json, null);
  if (!parsed) return null;
  return hydrateConversationState(convId, parsed, userTypeFallback);
}

async function saveConversationState(convId, userId, state) {
  if (!global.db || !convId || !userId || !state) return;
  const payload = serializeConversationState(state);
  if (!payload) return;
  await new Promise((resolve) => {
    global.db.run(
      `INSERT INTO conversation_state (conversation_id, user_id, state_json, updated_at)
       VALUES (?, ?, ?, datetime('now'))
       ON CONFLICT(conversation_id) DO UPDATE SET
         state_json = excluded.state_json,
         updated_at = datetime('now')`,
      [convId, userId, JSON.stringify(payload)],
      () => resolve()
    );
  });
}

async function runDb(sql, params = []) {
  if (!global.db) return;
  await new Promise((resolve, reject) => {
    global.db.run(sql, params, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}


router.post('/message', requireAuth, async (req, res) => {
  try {
    const { conversation_id, message, current_node, user_type, request_more, profile: bodyProfile } = req.body;
    const authUser = req.user;
    const userId = authUser?.user_id || null;
    const tokenUserType = normalizeUserType(authUser?.user_type);
    const bodyUserType = normalizeUserType(user_type);

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Bạn cần đăng nhập để sử dụng chatbot và lưu lịch sử.'
      });
    }

    // DEBUG: Log userType flow
    console.log('[CHAT DEBUG] /message - authUser.user_type:', authUser?.user_type);
    console.log('[CHAT DEBUG] /message - req.body.user_type:', user_type);
    console.log('[CHAT DEBUG] /message - userId:', userId);

    const convId = conversation_id || `conv_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    if (userId) {
      await ensureConversation(convId, userId, message);
      await saveMessage(convId, userId, 'user', message || '', current_node || null);
    }

    let state = getConversationState(convId, tokenUserType || bodyUserType || 'high_school');
    if (userId) {
      const hydrated = await loadConversationState(convId, userId, tokenUserType || bodyUserType || 'high_school');
      if (hydrated) state = hydrated;
    }
    if (bodyProfile) {
      state.profile = bodyProfile;
    }

    const profileUserType = normalizeUserType(bodyProfile?.education_level || state?.profile?.education_level);
    const dbProfileUserType = profileUserType ? null : await loadProfileUserTypeFromDb(userId);
    const effectiveUserType = profileUserType || dbProfileUserType || bodyUserType || tokenUserType || 'high_school';

    if (!state.profile || typeof state.profile !== 'object') {
      state.profile = {};
    }

    if (state.userType && state.userType !== effectiveUserType) {
      // Khi đổi loại hồ sơ, reset câu hỏi đang chờ để bot chuyển ngữ cảnh đúng ngay lập tức.
      state.lastQuestionId = null;
      state.lastQuestionText = null;
      state.lastQuestionOptions = [];
    }

    state.userType = effectiveUserType;
    state.profile.education_level = effectiveUserType;

    console.log('[CHAT DEBUG] /message - resolved effectiveUserType:', effectiveUserType);

    const hasPendingQuestion =
      String(state.lastQuestionId || '').startsWith('ai_question_') ||
      String(state.lastQuestionId || '').startsWith('ai_refine_');

    const preAnswers = [...(state.answers || []), ...(state.refinementAnswers || [])];
    const historyForClassifier = preAnswers.map((a) => ({
      q: a?.question || '',
      a: a?.answer || ''
    }));

    const turnIntent = await llmScorer.classifyUserTurnIntent({
      pendingQuestion: state.lastQuestionText || '',
      history: historyForClassifier,
      currentMessage: message
    });

    const resolvedIntent = turnIntent?.intent || (isPotentialQuestionText(message) ? 'question' : 'answer');
    const userAskedQuestion = resolvedIntent === 'question' || resolvedIntent === 'both';
    const userAnsweredPending = resolvedIntent === 'answer' || resolvedIntent === 'both';

    // Chỉ ghi nhận vào bộ tính điểm khi user đang TRẢ LỜI câu hỏi của AI.
    // Nếu user đang HỎI AI thì không cộng vào answers dùng để tính xác suất nghề nghiệp.
    if (message && userAnsweredPending && hasPendingQuestion) {
      const questionId = state.lastQuestionId || current_node || 'ai_chat';
      recordAnswer(convId, questionId, message, state.lastQuestionText);
    }

    state.refinementMode = Boolean(state.refinementMode) || Boolean(request_more);
    state.refinementQuestionsAsked = Number(state.refinementQuestionsAsked || 0);
    state.forceDeeperRefinement = Boolean(state.forceDeeperRefinement) || Boolean(request_more);

    if (request_more || isAffirmativeRefinementRequest(message)) {
      state.refinementMode = true;
      state.forceDeeperRefinement = true;
    }

    // Combine all answers for AI analysis
    const allAnswers = [...(state.answers || []), ...(state.refinementAnswers || [])];
    const totalAnswers = allAnswers.length;
    const aiQuestionCount = getQuestionCount(state);
    const refinementQuestionCount = getRefinementQuestionCount(state);

    const historyForAgent = allAnswers.map((a) => ({
      q: a?.question || '',
      a: a?.answer || ''
    }));

    // Determine if we have enough information for AI recommendations
    // Minimum 5 answers for accurate scoring (more data = better results)
    const minAnswersForRecommendation = state.refinementMode
      ? Math.max(22, 16 + (state.forceDeeperRefinement ? 8 : 0))
      : 16;
    const maxQuestions = state.refinementMode
      ? (state.forceDeeperRefinement ? 44 : 34)
      : 28; // Ask substantially more before concluding

    let recommendations = null;
    let completed = false;

    // Use AI to generate recommendations when we have enough information
    const requiredRefinementQuestions = getRequiredRefinementQuestions(state, request_more);
    const canConcludeByRefinement = !state.refinementMode || refinementQuestionCount >= requiredRefinementQuestions;

    if (userAnsweredPending && totalAnswers >= minAnswersForRecommendation && totalAnswers <= maxQuestions && !request_more && canConcludeByRefinement) {
      try {
        const aiRec = await llmScorer.generateCareerRecommendations({
          userType: effectiveUserType || 'high_school',
          profile: state.profile || bodyProfile || null,
          memoryAnswers: allAnswers
        });

        if (aiRec && aiRec.recommendations && aiRec.recommendations.length >= 6) {
          recommendations = normalizeRecommendationsWithProbability(aiRec.recommendations);
          completed = true;
        }
      } catch (error) {
        console.error('AI recommendation error:', error);
        // Fall back to continue asking questions
      }
    }

    // Force completion if we've asked too many questions
    if (userAnsweredPending && !completed && totalAnswers >= maxQuestions && canConcludeByRefinement) {
      try {
        const aiRec = await llmScorer.generateCareerRecommendations({
          userType: effectiveUserType || 'high_school',
          profile: state.profile || bodyProfile || null,
          memoryAnswers: allAnswers
        });

        if (aiRec && aiRec.recommendations) {
          recommendations = normalizeRecommendationsWithProbability(aiRec.recommendations);
          completed = true;
        }
      } catch (error) {
        console.error('Final AI recommendation error:', error);
      }
    }

    if (state.refinementMode && !canConcludeByRefinement) {
      completed = false;
      recommendations = null;
    }

    let botReply = '';
    let nextNode = null;
    let suggestedQuestions = [];
    let suggestionMode = 'question';

    if (completed && Array.isArray(recommendations) && recommendations.length) {
      const top = recommendations.slice(0, 10);
      const lines = top.map((r, idx) => `${idx + 1}. ${r.career_name} (${r.match_score}/100)`);
      botReply = `Mình đã phân tích xong và tìm ra những nghề nghiệp phù hợp nhất với bạn.\n\nTop gợi ý:\n${lines.join('\n')}\n\nChi tiết phân tích đã được cập nhật trong biểu đồ bên dưới.`;
      nextNode = null;
      suggestionMode = 'question';
      suggestedQuestions = pickSuggestedQuestions([], suggestionMode);
    } else {
      // Use AI to generate the next question
      if (!llmScorer.isEnabled()) {
        botReply = 'Hiện backend chưa được cấu hình LLM (thiếu GROQ_API_KEY), nên hệ thống không thể tư vấn. Bạn hãy cấu hình GROQ_API_KEY trên Render và redeploy backend để tiếp tục.';
        nextNode = 'ai_chat';
        const fallbackSuggestions = pickSuggestedQuestions([], 'question');
        return res.status(503).json({
          success: false,
          error: botReply,
          data: {
            bot_reply: botReply,
            options: fallbackSuggestions,
            suggested_questions: fallbackSuggestions,
            suggested_question: fallbackSuggestions[0] || '',
            suggestion_type: 'question',
            next_node: nextNode,
            conversation_id: convId,
            completed: false
          }
        });
      }

      if (userAskedQuestion) {
        const consultationReply = await llmScorer.generateCareerConsultationReply({
          history: historyForAgent,
          currentMessage: message,
          userType: effectiveUserType || 'high_school',
          profile: state.profile || bodyProfile || null,
          careerScores: Array.isArray(recommendations)
            ? Object.fromEntries(recommendations.map((r) => [r.career_name, Number(r.match_score || 0)]))
            : {}
        });

        const aiReply = consultationReply || await llmScorer.generateAgentChatReply({
          history: historyForAgent,
          currentMessage: message
        });

        if (aiReply && aiReply.bot_reply) {
          // Nếu user hỏi trong khi vẫn còn câu hỏi AI đang chờ trả lời,
          // AI phải trả lời xong rồi hỏi lại CHÍNH câu hỏi đang chờ đó.
          if (hasPendingQuestion && state.lastQuestionText && !userAnsweredPending) {
            botReply = `${aiReply.bot_reply}\n\nĐể tiếp tục tư vấn, mình nhắc lại câu hỏi trước đó: ${state.lastQuestionText}`;
            nextNode = state.lastQuestionId || 'ai_chat';
            suggestionMode = 'answer';
            suggestedQuestions = pickSuggestedQuestions(state.lastQuestionOptions, suggestionMode);
          } else {
            // Nếu chưa có câu hỏi nào đang chờ, AI trả lời và đặt câu hỏi tiếp theo.
            const aiQuestion = await llmScorer.generateCareerQuestion({
              userType: effectiveUserType || 'high_school',
              profile: state.profile || bodyProfile || null,
              memoryAnswers: allAnswers,
              intent: { id: 'ai_chat', type: 'free_text' }
            });

            const questionPrefix = state.refinementMode ? 'ai_refine_' : 'ai_question_';
            const nextQuestionIndex = (state.refinementMode ? refinementQuestionCount : aiQuestionCount) + 1;

            if (aiQuestion && aiQuestion.question) {
              const conversationalQuestion = makeConversationalQuestion(
                aiQuestion.question,
                aiQuestionCount + refinementQuestionCount
              );
              state.lastQuestionId = `${questionPrefix}${nextQuestionIndex}`;
              state.lastQuestionText = conversationalQuestion;
              state.lastQuestionOptions = Array.isArray(aiQuestion.options) ? aiQuestion.options : [];
              botReply = `${aiReply.bot_reply}\n\n${conversationalQuestion}`;
              nextNode = 'ai_chat';
              suggestionMode = 'answer';
              suggestedQuestions = pickSuggestedQuestions(aiQuestion.options, suggestionMode);
              if (state.refinementMode) {
                state.refinementQuestionsAsked = Number(state.refinementQuestionsAsked || 0) + 1;
              }
            } else {
              // fallback: trả lời được nhưng chưa tạo được câu hỏi tiếp
              botReply = aiReply.bot_reply;
              nextNode = 'ai_answer';
              state.lastQuestionId = 'ai_answer';
              state.lastQuestionText = aiReply.bot_reply;
              state.lastQuestionOptions = [];
              suggestionMode = 'question';
              const suggestionPool = Array.isArray(aiReply.suggested_questions)
                ? aiReply.suggested_questions
                : Array.isArray(aiReply.options)
                  ? aiReply.options
                  : [];
              suggestedQuestions = pickSuggestedQuestions(suggestionPool, suggestionMode);
            }
          }
        }
      }

      if (!botReply) {
        const aiQuestion = await llmScorer.generateCareerQuestion({
          userType: effectiveUserType || 'high_school',
          profile: state.profile || bodyProfile || null,
          memoryAnswers: allAnswers,
          intent: { id: 'ai_chat', type: 'free_text' }
        });

        if (aiQuestion && aiQuestion.question) {
          const conversationalQuestion = makeConversationalQuestion(
            aiQuestion.question,
            aiQuestionCount + refinementQuestionCount
          );
          const questionPrefix = state.refinementMode ? 'ai_refine_' : 'ai_question_';
          const nextQuestionIndex = (state.refinementMode ? refinementQuestionCount : aiQuestionCount) + 1;
          state.lastQuestionId = `${questionPrefix}${nextQuestionIndex}`;
          state.lastQuestionText = conversationalQuestion;
          state.lastQuestionOptions = Array.isArray(aiQuestion.options) ? aiQuestion.options : [];
          botReply = conversationalQuestion;
          nextNode = 'ai_chat';
          suggestionMode = 'answer';
          suggestedQuestions = pickSuggestedQuestions(aiQuestion.options, suggestionMode);
          if (state.refinementMode) {
            state.refinementQuestionsAsked = Number(state.refinementQuestionsAsked || 0) + 1;
          }
        } else {
          botReply = 'Cảm ơn bạn đã chia sẻ. Mình đang phân tích thông tin để đưa ra gợi ý phù hợp nhất. Vui lòng đợi một chút và nhắn hỏi lại sau ít phút để nhận được phân tích.';
          nextNode = 'ai_chat';
          suggestionMode = 'question';
          suggestedQuestions = pickSuggestedQuestions([], suggestionMode);
        }
      }
    }

    botReply = stripInlineSuggestionText(botReply);
    suggestionMode = nextNode === 'ai_chat' ? 'answer' : 'question';
    suggestedQuestions = pickSuggestedQuestions(suggestedQuestions, suggestionMode);
    const suggestedQuestion = suggestedQuestions[0] || '';

    if (userId) {
      await saveMessage(convId, userId, 'bot', botReply, nextNode);
      await saveConversationState(convId, userId, state);
      if (completed && Array.isArray(recommendations)) {
        await saveRecommendations(convId, userId, recommendations);
      }
    }

    return res.json({
      success: true,
      data: {
        bot_reply: botReply,
        options: suggestedQuestions,
        suggested_questions: suggestedQuestions,
        suggested_question: suggestedQuestion,
        suggestion_type: suggestionMode,
        user_type: effectiveUserType,
        turn_intent: resolvedIntent,
        next_node: nextNode,
        conversation_id: convId,
        recommendations: recommendations || undefined,
        completed,
        ai_question_count: aiQuestionCount,
        refinement_question_count: refinementQuestionCount,
        refinement_mode: Boolean(state.refinementMode),
        min_refinement_questions: requiredRefinementQuestions,
        force_deeper_refinement: Boolean(state.forceDeeperRefinement)
      }
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/history/:userId', requireAuth, async (req, res) => {
  const { userId } = req.params;
  console.log('[CHAT DEBUG] /history/:userId - userId:', userId, 'req.user.user_id:', req.user.user_id);
  
  if (req.user.user_type !== 'admin' && String(req.user.user_id) !== String(userId)) {
    console.log('[CHAT DEBUG] /history - Forbidden: user_id mismatch');
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
    if (err) {
      console.log('[CHAT DEBUG] /history ERROR:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
    console.log('[CHAT DEBUG] /history SUCCESS - rows:', rows?.length || 0, 'data:', rows);
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

router.delete('/history/:userId', requireAuth, async (req, res) => {
  const { userId } = req.params;
  if (req.user.user_type !== 'admin' && String(req.user.user_id) !== String(userId)) {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }
  const delMessages = 'DELETE FROM chat_messages WHERE user_id = ?';
  const delRecs = 'DELETE FROM recommendations WHERE user_id = ?';
  const delState = 'DELETE FROM conversation_state WHERE user_id = ?';
  const delConversations = 'DELETE FROM conversations WHERE user_id = ?';
  try {
    await runDb(delMessages, [userId]);
    await runDb(delRecs, [userId]);
    await runDb(delState, [userId]);
    await runDb(delConversations, [userId]);

    try {
      await deleteMirroredUserHistory({ appUserId: Number(userId) || userId });
    } catch (mirrorError) {
      console.warn('[CHAT DEBUG] deleteMirroredUserHistory warning:', mirrorError.message);
    }

    res.json({ success: true, data: { deleted: true } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
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
      const mapped = (rows || []).map((r) => ({
        ...r,
        reasons: safeParse(r.reasons, [])
      }));
      const data = normalizeRecommendationsWithProbability(mapped);
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
    const deleteState = 'DELETE FROM conversation_state WHERE conversation_id = ?';
    const deleteConv = 'DELETE FROM conversations WHERE id = ?';

    (async () => {
      try {
        await runDb(deleteMessages, [conversationId]);
        await runDb(deleteRecs, [conversationId]);
        await runDb(deleteState, [conversationId]);
        await runDb(deleteConv, [conversationId]);

        try {
          await deleteMirroredConversationData({
            appUserId: row?.user_id || null,
            conversationId
          });
        } catch (mirrorError) {
          console.warn('[CHAT DEBUG] deleteMirroredConversationData warning:', mirrorError.message);
        }

        return res.json({ success: true, data: { deleted: true } });
      } catch (err2) {
        return res.status(500).json({ success: false, error: err2.message });
      }
    })();
  });
});

async function saveMessage(convId, userId, sender, message, nodeId) {
  console.log('[CHAT DEBUG] saveMessage called - convId:', convId, 'userId:', userId, 'sender:', sender, 'nodeId:', nodeId);
  
  if (!global.db) {
    console.log('[CHAT DEBUG] saveMessage - No database, using memory');
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
    global.db.run(query, [convId, userId, sender, message, nodeId], function (err) {
      if (err) {
        console.log('[CHAT DEBUG] saveMessage ERROR:', err);
        reject(err);
      } else {
        console.log('[CHAT DEBUG] saveMessage SUCCESS - messageId:', this.lastID);
        const insertedId = this.lastID;
        resolve(insertedId);
      }
    });
  }).then(async (messageId) => {
    try {
      await mirrorChatMessage({
        appUserId: userId,
        conversationId: convId,
        messageId,
        sender,
        message,
        nodeId,
        createdAt: new Date().toISOString()
      });
    } catch (mirrorError) {
      console.warn('[CHAT DEBUG] mirrorChatMessage warning:', mirrorError.message);
    }
    return messageId;
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

  try {
    await mirrorCareerProbabilities({
      appUserId: userId,
      conversationId: convId,
      recommendations
    });
  } catch (mirrorError) {
    console.warn('[CHAT DEBUG] mirrorCareerProbabilities warning:', mirrorError.message);
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
