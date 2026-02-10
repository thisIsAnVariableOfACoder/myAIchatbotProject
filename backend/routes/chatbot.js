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
        const { conversationId, userType = 'high_school' } = req.body;

        if (!conversationId) {
            return res.status(400).json({ error: 'conversationId is required' });
        }

        const state = getConversationState(conversationId, userType);

        let firstQuestion = null;
        if (llmScorer.isEnabled()) {
            const result = await llmScorer.generateAgentQuestion({
                profile: { user_type: userType },
                history: []
            });
            if (result && result.question) {
                firstQuestion = {
                    id: 'ai_1',
                    text: result.question,
                    type: 'multiple_choice',
                    options: result.options || ["Có", "Không", "Khác..."],
                    is_ai: true
                };
            }
        }

        if (!firstQuestion) {
            firstQuestion = getNextQuestion(conversationId, userType);
        }

        res.json({
            success: true,
            conversationId,
            mode: 'initial',
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

        // Record the answer
        recordAnswer(conversationId, questionId, answer);

        // Get next question
        const state = getConversationState(conversationId);
        let nextQuestion = null;

        if (llmScorer.isEnabled()) {
            const history = state.answers.map(a => ({
                question: a.question,
                answer: a.answer
            }));
            const result = await llmScorer.generateAgentQuestion({
                profile: { user_type: state.userType },
                history
            });

            if (result && result.question && result.question !== "DONE") {
                nextQuestion = {
                    id: `ai_${state.answers.length + 1}`,
                    text: result.question,
                    type: 'multiple_choice',
                    options: result.options || ["Có", "Không", "Khác..."],
                    is_ai: true
                };
            }
        } else if (state.mode === 'initial') {
            nextQuestion = getNextQuestion(conversationId, state.userType);
        }

        const progress = getRefinementProgress(conversationId);

        res.json({
            success: true,
            recorded: true,
            nextQuestion,
            progress,
            canRefine: !llmScorer.isEnabled() && canStartRefinement(conversationId),
            done: !nextQuestion
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
        let result = null;

        if (llmScorer.isEnabled()) {
            const history = state.answers.map(a => ({
                question: a.question,
                answer: a.answer
            }));
            const aiResult = await llmScorer.generateAgentRecommendations({
                profile: { user_type: state.userType },
                history
            });

            if (aiResult?.recommendations) {
                result = {
                    recommendations: aiResult.recommendations,
                    totalAnswers: state.answers.length,
                    isAiAgent: true
                };
            }
        }

        if (!result) {
            // Fallback to database-driven logic if AI fails
            result = getCareerRecommendations(conversationId);
        }

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
            chatBlocked: true // Signal to frontend to block chat input
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
