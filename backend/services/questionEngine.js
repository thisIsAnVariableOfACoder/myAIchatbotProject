const { buildCareerRecords } = require('../data/careerLibrary');
const { generateAllQuestions, getQuestionScore } = require('../data/careerQuestionWeights');

// Load all questions from the new question bank
const ALL_QUESTIONS = generateAllQuestions();
const CONVERSATIONS = new Map();

/**
 * Get or create conversation state
 */
function getConversationState(conversationId, userType = 'high_school') {
  if (!CONVERSATIONS.has(conversationId)) {
    CONVERSATIONS.set(conversationId, {
      userType,
      answers: [],
      askedQuestions: new Set(),
      mode: 'initial', // 'initial' or 'refinement'
      refinementAnswers: [], // Answers from refinement questions
      createdAt: Date.now()
    });
  }
  return CONVERSATIONS.get(conversationId);
}

/**
 * Get next question for initial conversation (legacy mode)
 */
function getNextQuestion(conversationId, userType) {
  const state = getConversationState(conversationId, userType);

  // Initial mode: ask 20-30 broad questions
  if (state.answers.length >= 25) {
    return null; // Done with initial questions
  }

  // Get broad questions from different categories
  const categories = ['skill', 'interest', 'scenario', 'workstyle'];
  const targetCategory = categories[state.answers.length % categories.length];

  const availableQuestions = ALL_QUESTIONS.filter(q =>
    q.category === targetCategory &&
    !state.askedQuestions.has(q.id)
  );

  if (availableQuestions.length === 0) {
    // Fallback to any category if no questions in target category
    const anyAvailable = ALL_QUESTIONS.filter(q => !state.askedQuestions.has(q.id));
    if (anyAvailable.length === 0) return null;
    const question = anyAvailable[0];
    return {
      id: question.id,
      text: question.text,
      type: 'yes_no_maybe',
      options: ['Có', 'Có thể', 'Không']
    };
  }

  // Return first available question
  const question = availableQuestions[0];
  return {
    id: question.id,
    text: question.text,
    type: 'yes_no_maybe',
    options: ['Có', 'Có thể', 'Không']
  };
}

/**
 * Start refinement mode - get 10+ targeted questions
 */
function startRefinementMode(conversationId) {
  const state = getConversationState(conversationId);
  state.mode = 'refinement';
  state.refinementAnswers = [];

  // Calculate current top careers to target questions
  const currentScores = calculateCareerScoresFromAnswers(state.answers);
  const topCareers = Object.entries(currentScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([career]) => career);

  // Get 15 discriminating questions that help distinguish between top careers
  const refinementQuestions = getDiscriminatingQuestions(topCareers, state.askedQuestions, 15);

  return {
    mode: 'refinement',
    questions: refinementQuestions,
    totalQuestions: refinementQuestions.length,
    message: 'Hãy trả lời thêm một số câu hỏi để tôi hiểu rõ hơn về bạn'
  };
}

/**
 * Get discriminating questions that help distinguish between careers
 */
function getDiscriminatingQuestions(topCareers, askedQuestions, count = 15) {
  // Score each question by how well it discriminates between top careers
  const questionScores = ALL_QUESTIONS
    .filter(q => !askedQuestions.has(q.id))
    .map(q => {
      // Count how many top careers this question targets
      const targetsCount = topCareers.filter(career =>
        q.career_weights[career] && q.career_weights[career] > 0
      ).length;

      // Questions that target 2-5 careers are most discriminating
      const discriminationScore = targetsCount >= 2 && targetsCount <= 5 ?
        10 - Math.abs(targetsCount - 3) : 0;

      // Prefer high-weight questions
      const maxWeight = Math.max(...Object.values(q.career_weights));

      return {
        question: q,
        score: discriminationScore * 10 + maxWeight
      };
    })
    .sort((a, b) => b.score - a.score);

  // Return top questions
  return questionScores.slice(0, count).map(item => ({
    id: item.question.id,
    text: item.question.text,
    type: 'yes_no_maybe',
    options: ['Có', 'Có thể', 'Không'],
    category: item.question.category
  }));
}

/**
 * Record answer for a question
 */
function recordAnswer(conversationId, questionId, answer) {
  const state = getConversationState(conversationId);

  // Find the question
  const question = ALL_QUESTIONS.find(q => q.id === questionId);
  if (!question) {
    throw new Error(`Question ${questionId} not found`);
  }

  // Normalize answer
  const normalizedAnswer = normalizeAnswer(answer);

  // Store answer
  const answerRecord = {
    questionId,
    question: question.text,
    answer: normalizedAnswer,
    timestamp: Date.now()
  };

  if (state.mode === 'refinement') {
    state.refinementAnswers.push(answerRecord);
  } else {
    state.answers.push(answerRecord);
  }

  state.askedQuestions.add(questionId);

  return {
    recorded: true,
    totalAnswers: state.answers.length + state.refinementAnswers.length
  };
}

/**
 * Normalize answer to yes/maybe/no
 */
function normalizeAnswer(answer) {
  const lowerAnswer = String(answer).toLowerCase().trim();

  if (['có', 'yes', 'đúng', 'true', '1'].includes(lowerAnswer)) {
    return 'yes';
  }
  if (['không', 'no', 'sai', 'false', '0'].includes(lowerAnswer)) {
    return 'no';
  }
  return 'maybe';
}

/**
 * Calculate career scores from answers using question weights
 */
function calculateCareerScoresFromAnswers(answers) {
  const scores = {};

  for (const answerRecord of answers) {
    const question = ALL_QUESTIONS.find(q => q.id === answerRecord.questionId);
    if (!question) continue;

    // Add score for each career based on answer
    for (const [career, weight] of Object.entries(question.career_weights)) {
      if (!scores[career]) scores[career] = 0;
      scores[career] += getQuestionScore(question, career, answerRecord.answer);
    }
  }

  return scores;
}

/**
 * Get career recommendations with question-based scoring
 */
function getCareerRecommendations(conversationId) {
  const state = getConversationState(conversationId);

  // Combine initial and refinement answers
  const allAnswers = [...state.answers, ...state.refinementAnswers];

  if (allAnswers.length < 10) {
    throw new Error(`Need at least 10 answers to generate recommendations (current: ${allAnswers.length})`);
  }

  // Calculate scores
  const scores = calculateCareerScoresFromAnswers(allAnswers);

  // Filter out careers with very low scores (minimum threshold)
  const minScoreThreshold = Math.max(...Object.values(scores)) * 0.1; // 10% of max score
  const filteredScores = Object.entries(scores)
    .filter(([, score]) => score >= minScoreThreshold)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  if (filteredScores.length === 0) {
    throw new Error('No careers match your profile');
  }

  // Softmax normalization for smoother probability distribution
  const maxScore = filteredScores[0][1];
  const expScores = filteredScores.map(([career, score]) => [
    career,
    Math.exp((score - maxScore) / 50) // Temperature parameter = 50
  ]);

  const sumExp = expScores.reduce((sum, [, exp]) => sum + exp, 0);

  const recommendations = expScores.map(([career, exp], index) => ({
    career_name: career,
    match_score: Math.round(filteredScores[index][1]),
    probability: exp / sumExp,
    confidence: filteredScores[index][1] > 150 ? 'high' :
      filteredScores[index][1] > 75 ? 'medium' : 'low',
    reasons: generateReasons(career, allAnswers)
  }));

  return {
    recommendations,
    totalAnswers: allAnswers.length,
    mode: state.mode,
    canRefine: state.mode === 'initial' && allAnswers.length >= 20
  };
}

/**
 * Generate reasons for recommendation
 */
function generateReasons(career, answers) {
  const reasons = [];

  // Find relevant answered questions for this career
  const relevantAnswers = answers.filter(a => {
    const question = ALL_QUESTIONS.find(q => q.id === a.questionId);
    return question && question.career_weights[career] && a.answer === 'yes';
  }).slice(0, 3);

  for (const answer of relevantAnswers) {
    const question = ALL_QUESTIONS.find(q => q.id === answer.questionId);
    if (question) {
      reasons.push(`Bạn ${question.text.replace('Bạn có ', '').replace(' không?', '')}`);
    }
  }

  if (reasons.length === 0) {
    reasons.push('Phù hợp với profile của bạn');
  }

  return reasons;
}

/**
 * Check if refinement mode is available
 */
function canStartRefinement(conversationId) {
  const state = getConversationState(conversationId);
  return state.mode === 'initial' &&
    state.answers.length >= 5 &&
    state.refinementAnswers.length === 0;
}

/**
 * Get refinement progress
 */
function getRefinementProgress(conversationId) {
  const state = getConversationState(conversationId);
  return {
    mode: state.mode,
    refinementAnswersCount: state.refinementAnswers.length,
    totalAnswersCount: state.answers.length + state.refinementAnswers.length
  };
}

module.exports = {
  getConversationState,
  getNextQuestion,
  recordAnswer,
  startRefinementMode,
  getCareerRecommendations,
  canStartRefinement,
  getRefinementProgress,
  getDiscriminatingQuestions
};
