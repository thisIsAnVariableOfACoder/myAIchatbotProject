const { buildCareerRecords } = require('../data/careerLibrary');
const { generateAllQuestions, getQuestionScore } = require('../data/careerQuestionWeights');

// Load all questions from the new question bank
const ALL_QUESTIONS = generateAllQuestions();
const CONVERSATIONS = new Map();

const CORE_QUESTIONS = {
  high_school: [
    { id: 'core_hs_1', text: 'Bạn đang học lớp mấy và bạn mạnh nhất ở môn/hoạt động nào?' },
    { id: 'core_hs_2', text: 'Bạn thích làm việc với gì hơn: con người, số liệu, máy tính, hay sáng tạo nội dung? Vì sao?' },
    { id: 'core_hs_3', text: 'Bạn muốn ưu tiên điều gì nhất khi chọn nghề: thu nhập, ổn định, đam mê, hay cân bằng thời gian?' }
  ],
  university: [
    { id: 'core_uni_1', text: 'Bạn đang học ngành gì/năm mấy, và bạn thích nhất mảng nào trong ngành (hoặc ngoài ngành)?' },
    { id: 'core_uni_2', text: 'Bạn đã từng làm dự án/CLB/thực tập gì chưa? Bạn thích vai trò nào nhất trong đó?' },
    { id: 'core_uni_3', text: 'Bạn muốn theo hướng công việc nào: chuyên môn sâu, thiên về quản lý, hay thiên về sáng tạo/kinh doanh?' }
  ],
  professional: [
    { id: 'core_pro_1', text: 'Hiện bạn đang làm vị trí gì và chuyên môn chính của bạn là gì?' },
    { id: 'core_pro_2', text: 'Bạn có bao nhiêu năm kinh nghiệm và bạn muốn chuyển nghề hay nâng cấp trong cùng lĩnh vực?' },
    { id: 'core_pro_3', text: 'Bạn muốn ưu tiên điều gì nhất: thu nhập, cơ hội thăng tiến, ổn định, hay cân bằng cuộc sống?' }
  ]
};

function adaptQuestionText(text, userType) {
  const raw = String(text || '');
  if (!raw) return '';
  if (userType === 'professional') return raw;

  // For students, avoid wording that assumes employment.
  return raw
    .replace(/trong công việc hàng ngày/gi, 'trong hoạt động hàng ngày')
    .replace(/trong công việc/gi, 'trong học tập/dự án cá nhân')
    .replace(/công việc hàng ngày/gi, 'hoạt động hàng ngày')
    .replace(/trong công việc\?/gi, 'trong học tập/dự án cá nhân?');
}

function serializeConversationState(state) {
  if (!state) return null;
  return {
    userType: state.userType,
    answers: state.answers || [],
    refinementAnswers: state.refinementAnswers || [],
    askedQuestions: Array.from(state.askedQuestions || []),
    mode: state.mode || 'initial',
    createdAt: state.createdAt || Date.now(),
    lastQuestionText: state.lastQuestionText || null,
    lastQuestionId: state.lastQuestionId || null,
    lastQuestionOptions: Array.isArray(state.lastQuestionOptions) ? state.lastQuestionOptions : [],
    profile: state.profile || null
  };
}

function hydrateConversationState(conversationId, data, userTypeFallback) {
  if (!conversationId || !data) return null;
  const asked = new Set(Array.isArray(data.askedQuestions) ? data.askedQuestions : []);
  const state = {
    userType: data.userType || userTypeFallback || 'high_school',
    answers: Array.isArray(data.answers) ? data.answers : [],
    askedQuestions: asked,
    mode: data.mode || 'initial',
    refinementAnswers: Array.isArray(data.refinementAnswers) ? data.refinementAnswers : [],
    createdAt: data.createdAt || Date.now(),
    lastQuestionText: data.lastQuestionText || null,
    lastQuestionId: data.lastQuestionId || null,
    lastQuestionOptions: Array.isArray(data.lastQuestionOptions) ? data.lastQuestionOptions : [],
    profile: data.profile || null
  };
  CONVERSATIONS.set(conversationId, state);
  return state;
}

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

  // Initial mode: ask a small set of broad questions (tối ưu thời gian)
  // Giảm từ ~25 câu xuống 10 câu đầu tiên để rút ngắn hội thoại
  if (state.answers.length >= 14) {
    return null; // Done with initial questions
  }

  const effectiveUserType = state.userType || userType || 'high_school';
  const coreList = CORE_QUESTIONS[effectiveUserType] || CORE_QUESTIONS.high_school;
  const remainingCore = coreList.filter((q) => !state.askedQuestions.has(q.id));
  if (state.answers.length < 3 && remainingCore.length > 0) {
    const q = remainingCore[0];
    return {
      id: q.id,
      text: adaptQuestionText(q.text, effectiveUserType),
      type: 'text',
      options: []
    };
  }

  // Get broad questions from different categories, tuned by user type
  const categories = (state.userType || userType) === 'professional'
    ? ['skill', 'scenario', 'workstyle', 'interest']
    : ['interest', 'skill', 'scenario', 'workstyle'];
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
    text: adaptQuestionText(question.text, state.userType || userType),
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

  // Get a small set of highly discriminating questions to keep flow short
  // Giảm từ 15 câu refinement xuống 5 câu tập trung
  const refinementQuestions = getDiscriminatingQuestions(topCareers, state.askedQuestions, 8);

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
function getDiscriminatingQuestions(topCareers, askedQuestions, count = 5) {
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
function recordAnswer(conversationId, questionId, answer, aiQuestionText = null) {
  const state = getConversationState(conversationId);

  // Find the question or use provided AI text
  let questionText = aiQuestionText;
  if (!questionText) {
    const question = ALL_QUESTIONS.find(q => q.id === questionId);
    if (!question) {
      if (typeof questionId === 'string' && (questionId.startsWith('ai_') || questionId.startsWith('ai'))) {
        // AI question or dynamic chat message
        questionText = aiQuestionText || "AI Interaction";
      } else {
        throw new Error(`Question ${questionId} not found`);
      }
    } else {
      questionText = question.text;
    }
  }

  // Normalize answer
  const normalizedAnswer = normalizeAnswer(answer);

  // Store answer
  const answerRecord = {
    questionId,
    question: questionText,
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
 * Normalize answer to yes/maybe/no with keyword extraction
 * Returns structured answer with intent and extracted keywords
 */
function normalizeAnswer(answer) {
  const text = String(answer || '').trim().toLowerCase();
  if (!text) return '';

  // Accept explicit yes/maybe/no
  if (text === 'yes' || text === 'y' || text === 'true') return 'yes';
  if (text === 'maybe') return 'maybe';
  if (text === 'no' || text === 'n' || text === 'false') return 'no';

  // Vietnamese mapping for explicit yes/maybe/no
  if (/^(có|co|đúng|dung|ok|oke|ừ|u|uh|ừm)\b/.test(text)) return 'yes';
  if (/^(có thể|co the|cũng được|cung duoc|maybe|tùy|tuy|chưa chắc|chua chac)\b/.test(text)) return 'maybe';
  if (/^(không|khong|không thích|khong thich|ko|k|khum|never|không bao giờ|khong bao gio)\b/.test(text)) return 'no';

  // Detect positive/negative intent from natural language
  const positivePatterns = [
    /thích|yeu|muốn|mong muốn|quan tâm|hứng thú|đam mê|sở thích|yêu thích/,
    /want to|like|love|interested in|passionate about|enjoy/
  ];
  
  const negativePatterns = [
    /không thích|ghét|chán|không muốn|tránh|không quan tâm/,
    /don't like|hate|dislike|avoid|not interested/
  ];

  const hasPositive = positivePatterns.some(pattern => pattern.test(text));
  const hasNegative = negativePatterns.some(pattern => pattern.test(text));

  // Extract keywords for career matching
  const keywords = extractCareerKeywords(text);

  // Return structured answer with intent
  if (hasPositive && !hasNegative) {
    return JSON.stringify({ intent: 'yes', keywords, raw: text });
  } else if (hasNegative && !hasPositive) {
    return JSON.stringify({ intent: 'no', keywords, raw: text });
  } else if (hasPositive && hasNegative) {
    return JSON.stringify({ intent: 'maybe', keywords, raw: text });
  }

  // Default: keep raw for memory, but try to extract keywords
  return JSON.stringify({ intent: 'unknown', keywords, raw: text });
}

/**
 * Extract career-related keywords from text
 */
function extractCareerKeywords(text) {
  const keywords = [];
  
  // Design & Creative keywords
  const designKeywords = [
    'mỹ thuật', 'thiết kế', 'đồ họa', 'graphic design', 'ui', 'ux', 'vẽ', 'hình ảnh',
    'nghệ thuật', 'creative', 'art', 'design', 'illustration', 'photography', 'video'
  ];
  
  // Tech keywords
  const techKeywords = [
    'lập trình', 'code', 'programming', 'phần mềm', 'software', 'ứng dụng', 'app',
    'website', 'công nghệ', 'technology', 'ai', 'machine learning', 'data'
  ];
  
  // Business keywords
  const businessKeywords = [
    'kinh doanh', 'business', 'marketing', 'quản lý', 'management', 'bán hàng', 'sales',
    'tài chính', 'finance', 'kế toán', 'accounting', 'giao tiếp', 'communication'
  ];
  
  // Education keywords
  const educationKeywords = [
    'giáo dục', 'education', 'dạy', 'teaching', 'học', 'learning', 'giáo viên', 'teacher'
  ];
  
  // Healthcare keywords
  const healthKeywords = [
    'y tế', 'healthcare', 'bác sĩ', 'doctor', 'y tá', 'nurse', 'sức khỏe', 'health'
  ];
  
  // Check each category
  const allKeywords = [
    ...designKeywords.map(k => ({ keyword: k, category: 'design' })),
    ...techKeywords.map(k => ({ keyword: k, category: 'tech' })),
    ...businessKeywords.map(k => ({ keyword: k, category: 'business' })),
    ...educationKeywords.map(k => ({ keyword: k, category: 'education' })),
    ...healthKeywords.map(k => ({ keyword: k, category: 'health' }))
  ];
  
  for (const { keyword, category } of allKeywords) {
    if (text.includes(keyword)) {
      keywords.push({ keyword, category });
    }
  }
  
  return keywords;
}

/**
 * Calculate career scores from answers using question weights and keyword matching
 */
function calculateCareerScoresFromAnswers(answers) {
  const scores = {};

  for (const answerRecord of answers) {
    const question = ALL_QUESTIONS.find(q => q.id === answerRecord.questionId);
    if (!question) continue;

    // Parse structured answer if available
    let intent = answerRecord.answer;
    let keywords = [];
    
    try {
      const parsed = JSON.parse(answerRecord.answer);
      if (parsed.intent) {
        intent = parsed.intent;
        keywords = parsed.keywords || [];
      }
    } catch {
      // Not a JSON string, use as-is
    }

    // Add score for each career based on answer
    for (const [career, weight] of Object.entries(question.career_weights)) {
      if (!scores[career]) scores[career] = 0;
      scores[career] += getQuestionScore(question, career, intent);
    }

    // Add keyword-based scoring for natural language answers
    if (keywords.length > 0) {
      addKeywordBasedScores(scores, keywords, intent);
    }
  }

  return scores;
}

/**
 * Add scores based on extracted keywords
 */
function addKeywordBasedScores(scores, keywords, intent) {
  // Keyword to career mapping
  const keywordCareerMap = {
    'design': ['UI Designer', 'UX Designer', 'Graphic Designer', 'Product Designer', 'Visual Designer', 'Freelance Designer', 'Art Director', 'Creative Director'],
    'tech': ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Engineer', 'DevOps Engineer', 'ML Engineer', 'AI Engineer', 'QA Engineer'],
    'business': ['Marketing Manager', 'Sales Manager', 'Business Analyst', 'Product Manager', 'Account Manager', 'HR Manager', 'Financial Analyst'],
    'education': ['Giáo viên Tiểu học', 'Giáo viên Trung học cơ sở', 'Giáo viên Trung học phổ thông', 'Giảng viên Đại học / Cao đẳng', 'Gia sư / Giáo viên kèm'],
    'health': ['Bác sĩ', 'Y tá / Điều dưỡng', 'Dược sĩ', 'Vật lý trị liệu', 'Nhà Tâm lý học Lâm sàng']
  };

  // Base scores for different intents
  const intentScores = {
    'yes': 25,
    'maybe': 12,
    'no': -10,
    'unknown': 5
  };

  const baseScore = intentScores[intent] || intentScores['unknown'];

  // Apply scores to careers based on keyword categories
  for (const { category } of keywords) {
    const careers = keywordCareerMap[category] || [];
    for (const career of careers) {
      if (!scores[career]) scores[career] = 0;
      scores[career] += baseScore;
    }
  }
}

/**
 * Get career recommendations with question-based scoring
 */
function getCareerRecommendations(conversationId) {
  const state = getConversationState(conversationId);

  // Combine initial and refinement answers
  const allAnswers = [...state.answers, ...state.refinementAnswers];

  // Giảm số lượng câu trả lời tối thiểu để sinh gợi ý nghề (từ 10 xuống 6)
  if (allAnswers.length < 9) {
    throw new Error(`Need at least 9 answers to generate recommendations (current: ${allAnswers.length})`);
  }

  // Calculate scores
  const scores = calculateCareerScoresFromAnswers(allAnswers);

  const sortedScores = Object.entries(scores)
    .sort((a, b) => b[1] - a[1]);

  // Filter out careers with very low scores (minimum threshold) but ensure >= 6 careers
  const minScoreThreshold = Math.max(...Object.values(scores)) * 0.1; // 10% of max score
  let filteredScores = sortedScores
    .filter(([, score]) => score >= minScoreThreshold)
    .slice(0, 10);

  if (filteredScores.length < 6) {
    filteredScores = sortedScores.slice(0, 6);
  }

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

  const recommendations = expScores.map(([career, exp], index) => {
    const probability = exp / sumExp;
    const matchScore = Math.round(probability * 1000) / 10;
    return {
      career_name: career,
      match_score: matchScore,
      probability,
      confidence: matchScore >= 75 ? 'high' : matchScore >= 50 ? 'medium' : 'low',
      reasons: generateReasons(career, allAnswers)
    };
  });

  return {
    recommendations,
    totalAnswers: allAnswers.length,
    mode: state.mode,
    canRefine: state.mode === 'initial' && allAnswers.length >= 24
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
    
    // Parse structured answer if available
    let intent = a.answer;
    try {
      const parsed = JSON.parse(a.answer);
      if (parsed.intent) intent = parsed.intent;
    } catch {}
    
    return question && question.career_weights[career] && (intent === 'yes' || intent === 'maybe');
  }).slice(0, 3);

  for (const answer of relevantAnswers) {
    const question = ALL_QUESTIONS.find(q => q.id === answer.questionId);
    if (question) {
      reasons.push(`Bạn ${question.text.replace('Bạn có ', '').replace(' không?', '')}`);
    }
  }

  // Check for keyword-based reasons
  for (const answer of answers) {
    try {
      const parsed = JSON.parse(answer.answer);
      if (parsed.keywords && parsed.keywords.length > 0) {
        const keyword = parsed.keywords[0].keyword;
        reasons.push(`Bạn quan tâm đến lĩnh vực ${keyword}`);
        break;
      }
    } catch {}
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
    // Cho phép vào refinement sớm hơn (từ 5 câu xuống 3 câu)
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

function isEnoughInfo(state) {
  // Simple heuristic for chat mode: 3 answers is enough to start brainstorming
  // Giảm từ 5 xuống 3 để bot có thể đề xuất nghề sớm hơn
  return (state?.answers?.length || 0) >= 6;
}

module.exports = {
  getConversationState,
  getNextQuestion,
  recordAnswer,
  startRefinementMode,
  getCareerRecommendations,
  canStartRefinement,
  getRefinementProgress,
  getDiscriminatingQuestions,
  isEnoughInfo,
  adaptQuestionText,
  serializeConversationState,
  hydrateConversationState,
  normalizeAnswer,
  extractCareerKeywords,
  calculateCareerScoresFromAnswers
};
