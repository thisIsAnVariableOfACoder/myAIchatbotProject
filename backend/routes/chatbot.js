const express = require('express');
const router = express.Router();
const {
    getConversationState,
    getNextQuestion,
    recordAnswer,
    startRefinementMode,
    getCareerRecommendations,
    canStartRefinement,
    getRefinementProgress
} = require('../services/questionEngine');
const { matchCareerAsync } = require('../services/matcher');
const llmScorer = require('../services/llmScorer');

/**
 * Start a new conversation
 */
router.post('/start', async (req, res) => {
    try {
        const { conversationId, userType = 'high_school', profile = {} } = req.body;

        if (!conversationId) {
            return res.status(400).json({ error: 'conversationId is required' });
        }

        const state = getConversationState(conversationId, userType);
        state.profile = profile;

        const aiReply = await llmScorer.generateAgentChatReply({
            history: [],
            currentMessage: "Xin chào! Bạn có thể giúp gì cho tôi?"
        });

        const botReply = aiReply?.bot_reply || "Chào bạn! Tôi có thể giúp gì cho bạn hôm nay?";
        state.lastQuestionText = botReply;

        res.json({
            success: true,
            conversationId,
            mode: 'initial',
            message: botReply,
            question: {
                id: 'ai_1',
                text: botReply,
                type: 'text',
                is_ai: true,
                options: aiReply?.suggested_questions || []
            },
            canRefine: false,
            isAiAgent: true
        });
    } catch (error) {
        console.error('Error starting conversation:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Answer a question
 */
router.post('/answer', async (req, res) => {
    try {
        const { conversationId, questionId, answer } = req.body;

        if (!conversationId || answer === undefined) {
            return res.status(400).json({ error: 'conversationId and answer are required' });
        }

        const state = getConversationState(conversationId);
        recordAnswer(conversationId, questionId || 'ai_chat', answer, state.lastQuestionText);

        const history = state.answers.map(a => ({
            q: a.question,
            a: a.answer
        }));

        const aiReply = await llmScorer.generateAgentChatReply({
            history,
            currentMessage: answer
        });

        if (aiReply) {
            state.lastQuestionText = aiReply.bot_reply;
            return res.json({
                success: true,
                conversationId,
                message: aiReply.bot_reply,
                question: {
                    id: `ai_${state.answers.length + 1}`,
                    text: aiReply.bot_reply,
                    type: 'text',
                    is_ai: true,
                    options: aiReply.suggested_questions || []
                },
                completed: false,
                isAiAgent: true
            });
        }

        // Fallback
        const fallback = "Tôi đã ghi nhận ý kiến của bạn. Bạn muốn trao đổi thêm về chủ đề gì không?";
        res.json({
            success: true,
            conversationId,
            message: fallback,
            question: null,
            completed: true,
            isAiAgent: true
        });
    } catch (error) {
        console.error('Error recording answer:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get recommendations (Simplified for General AI)
 */
router.post('/recommendations', async (req, res) => {
    // Với General AI, chúng ta không dùng DB Career, nhưng có thể sinh gợi ý dựa trên chat
    try {
        const { conversationId } = req.body;
        const state = getConversationState(conversationId);
        const history = state.answers.map(a => ({ q: a.question, a: a.answer }));

        const aiReply = await llmScorer.generateAgentChatReply({
            history,
            currentMessage: "Dựa trên cuộc trò chuyện của chúng ta, bạn có gợi ý gì cho tôi không?"
        });

        res.json({
            success: true,
            message: aiReply?.bot_reply || "Tôi chưa có đủ thông tin để đưa ra gợi ý cụ thể.",
            recommendations: [],
            isAiRefined: true
        });
    } catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Start refinement mode - "Chưa hài lòng? Hỏi tiếp"
 */
router.post('/refine', (req, res) => {
    try {
        const { conversationId } = req.body;

        if (!conversationId) {
            return res.status(400).json({ error: 'conversationId is required' });
        }

        if (!canStartRefinement(conversationId)) {
            return res.status(400).json({ error: 'Cannot start refinement at this time' });
        }

        const refinementData = startRefinementMode(conversationId);

        res.json({
            success: true,
            ...refinementData,
            chatBlocked: true
        });
    } catch (error) {
        console.error('Error starting refinement:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get refinement progress
 */
router.get('/refine/progress/:conversationId', (req, res) => {
    try {
        const { conversationId } = req.params;
        const progress = getRefinementProgress(conversationId);

        res.json({
            success: true,
            ...progress
        });
    } catch (error) {
        console.error('Error getting progress:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
