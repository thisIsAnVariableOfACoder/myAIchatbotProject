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
        // Lưu hồ sơ vào state để dùng cho các bước sau
        state.profile = profile;

        let firstQuestion = null;
        let botMessage = "";

        if (llmScorer.isEnabled()) {
            const result = await llmScorer.generateAgentQuestion({
                profile: state.profile,
                history: []
            });
            if (result && result.question) {
                state.lastQuestionText = result.question;
                botMessage = result.bot_message || "";
                firstQuestion = {
                    id: 'ai_1',
                    text: result.question,
                    type: 'text',
                    is_ai: true
                };
                if (result.options && result.options.length > 0) {
                    firstQuestion.options = result.options;
                }
            }
        }

        if (!firstQuestion) {
            firstQuestion = getNextQuestion(conversationId, userType);
        }

        res.json({
            success: true,
            conversationId,
            mode: 'initial',
            message: botMessage,
            question: firstQuestion,
            canRefine: false,
            isAiAgent: llmScorer.isEnabled()
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

        if (!conversationId || !questionId || answer === undefined) {
            return res.status(400).json({ error: 'conversationId, questionId, and answer are required' });
        }

        const state = getConversationState(conversationId);
        recordAnswer(conversationId, questionId, answer, state.lastQuestionText);

        let nextQuestion = null;
        let botMessage = "";

        if (llmScorer.isEnabled()) {
            const history = state.answers.map(a => ({
                q: a.question,
                a: a.answer
            }));
            const result = await llmScorer.generateAgentQuestion({
                profile: state.profile || { user_type: state.userType },
                history
            });

            if (result && result.question && result.question !== "DONE") {
                state.lastQuestionText = result.question;
                botMessage = result.bot_message || "";
                nextQuestion = {
                    id: `ai_${state.answers.length + 1}`,
                    text: result.question,
                    type: 'text',
                    is_ai: true
                };
                if (result.options && result.options.length > 0) {
                    nextQuestion.options = result.options;
                }
            }
        } else if (state.mode === 'initial') {
            nextQuestion = getNextQuestion(conversationId, state.userType);
        }

        res.json({
            success: true,
            conversationId,
            message: botMessage,
            question: nextQuestion,
            completed: !nextQuestion,
            isAiAgent: llmScorer.isEnabled()
        });
    } catch (error) {
        console.error('Error recording answer:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get recommendations
 */
router.post('/recommendations', async (req, res) => {
    try {
        const { conversationId } = req.body;

        if (!conversationId) {
            return res.status(400).json({ error: 'conversationId is required' });
        }

        const state = getConversationState(conversationId);

        // AI Recommendations
        if (llmScorer.isEnabled()) {
            const history = state.answers.map(a => ({
                q: a.question,
                a: a.answer
            }));
            const aiResult = await llmScorer.generateAgentRecommendations({
                profile: state.profile || { user_type: state.userType },
                history
            });

            if (aiResult && aiResult.recommendations) {
                return res.json({
                    success: true,
                    message: aiResult.bot_intro || "Đây là kết quả định hướng của bạn:",
                    recommendations: aiResult.recommendations,
                    isAiRefined: true
                });
            }
        }

        // Fallback
        const result = getCareerRecommendations(conversationId);
        res.json({
            success: true,
            ...result
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
