const { buildCareerRecords } = require('../data/careerLibrary');
const QUESTION_BANK = generateQuestionBank();
const CONVERSATIONS = new Map();

const CATEGORY_PRIORITY = [
  'education',
  'interests',
  'skills',
  'workstyle',
  'values',
  'personality',
  'industry',
  'role',
  'constraints',
  'experience'
];

const CATEGORY_PRIORITY_BY_USER_TYPE = {
  high_school: ['education', 'interests', 'skills', 'personality', 'values', 'workstyle', 'industry', 'role', 'constraints'],
  university: ['experience', 'skills', 'interests', 'values', 'personality', 'industry', 'role', 'workstyle', 'constraints', 'education'],
  professional: ['experience', 'skills', 'interests', 'workstyle', 'values', 'industry', 'role', 'constraints', 'education']
};

const CATEGORY_LIMITS_BY_USER_TYPE = {
  high_school: { education: 5, interests: 4, skills: 4, personality: 3, values: 3, workstyle: 2, industry: 2, role: 2, constraints: 2 },
  university: { experience: 3, skills: 4, interests: 4, values: 3, personality: 3, industry: 3, role: 3, workstyle: 3, constraints: 2, education: 2 },
  professional: { experience: 4, skills: 4, interests: 4, workstyle: 3, values: 3, industry: 3, role: 3, constraints: 2, education: 2 }
};

const REQUIRED_BY_USER_TYPE = {
  high_school: { education: 2, interests: 1, skills: 1 },
  university: { experience: 1, skills: 2, interests: 2 },
  professional: { experience: 2, skills: 2, interests: 2, workstyle: 1 }
};

const MAX_PER_CATEGORY = 4;
const MIN_TAG_FILTER_ANSWERS = 4;

function getConversationState(conversationId, userType) {
  if (!CONVERSATIONS.has(conversationId)) {
    CONVERSATIONS.set(conversationId, {
      askedIds: new Set(),
      coverage: {},
      answers: [],
      lastQuestion: null,
      userType: userType || null,
      tags: {},
      collectedSkills: new Set(),
      collectedInterests: new Set(),
      seed: hashCode(conversationId)
    });
  }
  const state = CONVERSATIONS.get(conversationId);
  if (userType) state.userType = userType;
  return state;
}

function recordAnswer(state, message) {
  const raw = String(message || '');
  const text = raw.toLowerCase();
  const normalized = normalizeText(raw);
  if (state.lastQuestion) {
    const category = state.lastQuestion.category;
    state.coverage[category] = (state.coverage[category] || 0) + 1;
    state.answers.push({ q: state.lastQuestion.id, a: message, category });
    if (state.lastQuestion.item && !isNegativeAnswer(normalized)) {
      if (category === 'skills') state.collectedSkills.add(state.lastQuestion.item);
      if (category === 'interests') state.collectedInterests.add(state.lastQuestion.item);
    }
  }
  // basic keyword tagging for branching
  if (text.includes('công nghệ') || normalized.includes('cong nghe') || text.includes('tech') || text.includes('it')) state.tags.tech = true;
  if (text.includes('kinh doanh') || normalized.includes('kinh doanh') || text.includes('business') || text.includes('marketing')) state.tags.business = true;
  if (text.includes('thiết kế') || normalized.includes('thiet ke') || text.includes('design') || text.includes('ui') || text.includes('ux')) state.tags.design = true;
  if (text.includes('y tế') || normalized.includes('y te') || text.includes('dược') || normalized.includes('duoc') || text.includes('điều dưỡng') || normalized.includes('dieu duong')) state.tags.health = true;
  if (text.includes('giáo dục') || normalized.includes('giao duc') || text.includes('dạy') || normalized.includes('day') || text.includes('giảng')) state.tags.education = true;
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function isNegativeAnswer(normalizedText) {
  const negatives = ['khong', 'không', 'chua', 'chưa', 'it', 'ít', 'kho', 'khó', 'khong thich', 'không thích'];
  return negatives.some((t) => normalizedText.includes(t));
}

function getCategoryOrder(userType) {
  if (userType && CATEGORY_PRIORITY_BY_USER_TYPE[userType]) {
    return CATEGORY_PRIORITY_BY_USER_TYPE[userType];
  }
  return CATEGORY_PRIORITY;
}

function getCategoryLimit(userType, category) {
  const byType = CATEGORY_LIMITS_BY_USER_TYPE[userType] || {};
  if (byType && byType[category]) return byType[category];
  return MAX_PER_CATEGORY;
}

function isRequiredMet(state) {
  const req = REQUIRED_BY_USER_TYPE[state.userType] || {};
  return Object.entries(req).every(([category, min]) => (state.coverage[category] || 0) >= min);
}

function pickRequiredCategory(state, userType, options) {
  if (options.force) return null;
  const req = REQUIRED_BY_USER_TYPE[userType] || {};
  const unmet = Object.entries(req)
    .filter(([category, min]) => (state.coverage[category] || 0) < min)
    .map(([category]) => category);
  if (unmet.length === 0) return null;
  return unmet[state.answers.length % unmet.length];
}

function isEnoughInfo(state) {
  if (!isRequiredMet(state)) return false;
  const covered = Object.keys(state.coverage).length;
  return covered >= 9 || state.answers.length >= 16;
}

function getNextQuestion(state, options = {}) {
  const forceContinue = options.force === true;
  if (!forceContinue && isEnoughInfo(state)) return null;

  const userType = state.userType;
  const categories = getCategoryOrder(userType);
  const coverageCounts = categories.map((category) => ({
    category,
    count: state.coverage[category] || 0
  })).filter(item => item.count < getCategoryLimit(userType, item.category));

  if (coverageCounts.length === 0) return null;

  const requiredPick = pickRequiredCategory(state, userType, options);
  if (requiredPick) {
    const reqPool = QUESTION_BANK.filter((item) => {
      if (item.category !== requiredPick) return false;
      if (state.askedIds.has(item.id)) return false;
      if (item.for && userType && !item.for.includes(userType)) return false;
      return true;
    });
    if (reqPool.length > 0) {
      const pick = seededPick(reqPool, state.seed, state.answers.length);
      state.askedIds.add(pick.id);
      state.lastQuestion = pick;
      return pick;
    }
  }

  const minCount = Math.min(...coverageCounts.map(item => item.count));
  const balancedCategories = coverageCounts
    .filter(item => item.count === minCount)
    .map(item => item.category);

  const categoryOrder = rotateArray(balancedCategories, state.answers.length % balancedCategories.length);
  const preferTags = state.answers.length >= MIN_TAG_FILTER_ANSWERS && !forceContinue;

  for (const category of categoryOrder) {
    const pool = QUESTION_BANK.filter((item) => {
      if (item.category !== category) return false;
      if (state.askedIds.has(item.id)) return false;
      if (item.for && userType && !item.for.includes(userType)) return false;
      if (!preferTags) return true;
      if (!item.tags || item.tags.length === 0) return true;
      return item.tags.some(t => state.tags[t]);
    });
    if (pool.length > 0) {
      const pick = seededPick(pool, state.seed, state.answers.length);
      state.askedIds.add(pick.id);
      state.lastQuestion = pick;
      return pick;
    }
  }

  const fallback = QUESTION_BANK.find((item) => !state.askedIds.has(item.id));
  if (fallback) {
    state.askedIds.add(fallback.id);
    state.lastQuestion = fallback;
    return fallback;
  }
  return null;
}

function generateQuestionBank() {
  const questions = [];
  let id = 1;

  const SUBJECTS = [
    'Toán', 'Văn', 'Anh', 'Sinh', 'Hóa', 'Lý', 'Tin học', 'Địa', 'Sử', 'GDCD',
    'Kinh tế', 'Tài chính', 'Kế toán', 'Marketing', 'Thiết kế', 'Âm nhạc', 'Mỹ thuật',
    'Công nghệ', 'Khoa học dữ liệu', 'Trí tuệ nhân tạo', 'An ninh mạng', 'Y sinh',
    'Tâm lý', 'Ngôn ngữ', 'Luật', 'Kiến trúc', 'Cơ khí', 'Điện', 'Tự động hóa'
  ];

  const INTERESTS = [
    'công nghệ', 'dữ liệu', 'phân tích', 'thiết kế', 'sáng tạo', 'kinh doanh', 'marketing',
    'giáo dục', 'y tế', 'tài chính', 'ngôn ngữ', 'truyền thông', 'âm nhạc', 'nhiếp ảnh',
    'môi trường', 'nông nghiệp', 'logistics', 'du lịch', 'ẩm thực', 'xây dựng', 'cơ khí',
    'điện tử', 'chăm sóc khách hàng', 'quản trị', 'pháp lý', 'an ninh', 'thể thao',
    'tâm lý', 'nghiên cứu', 'sản phẩm', 'vận hành', 'khởi nghiệp', 'bán hàng',
    'tổ chức sự kiện', 'điện ảnh', 'thời trang', 'mỹ phẩm', 'giải trí', 'game', 'báo chí',
    'sách', 'ngoại giao', 'nhân sự', 'tư vấn', 'phân phối', 'thương mại', 'chuỗi cung ứng',
    'khoa học', 'phòng thí nghiệm', 'dược', 'sinh học', 'hóa học', 'vật lý', 'địa chất',
    'phát triển cộng đồng', 'phi lợi nhuận', 'y tế số', 'edtech', 'fintech'
  ];

  const SKILLS = [
    'lập trình', 'JavaScript', 'Python', 'SQL', 'phân tích dữ liệu', 'tư duy logic',
    'thiết kế UI', 'thiết kế UX', 'vẽ', 'viết lách', 'giao tiếp', 'thuyết trình',
    'làm việc nhóm', 'quản lý thời gian', 'giải quyết vấn đề', 'sáng tạo', 'tư duy phản biện',
    'nghiên cứu', 'quản lý dự án', 'đàm phán', 'bán hàng', 'quảng cáo', 'SEO', 'content',
    'biên tập video', 'chụp ảnh', 'kế toán', 'tài chính', 'tổ chức', 'phân tích kinh doanh',
    'phân tích hệ thống', 'testing', 'tự động hóa', 'cloud', 'devops', 'an ninh mạng',
    'vận hành', 'quản trị', 'chăm sóc khách hàng', 'dịch thuật', 'ngôn ngữ Anh',
    'ngôn ngữ Nhật', 'ngôn ngữ Hàn', 'kỹ năng sư phạm', 'chăm sóc sức khỏe', 'lab',
    'thiết kế đồ họa', 'motion', '3D', 'cơ khí', 'điện', 'điện tử', 'tự động hóa',
    'tư duy sản phẩm', 'phân tích thị trường', 'thấu hiểu người dùng'
  ];

  const WORKSTYLES = [
    'làm việc độc lập', 'làm việc theo nhóm', 'làm việc từ xa', 'làm việc văn phòng',
    'môi trường linh hoạt', 'quy trình rõ ràng', 'môi trường sáng tạo', 'áp lực cao',
    'tốc độ nhanh', 'ổn định', 'thử thách', 'dịch chuyển nhiều', 'công việc cố định'
  ];

  const VALUES = [
    'thu nhập cao', 'ổn định', 'cân bằng cuộc sống', 'sáng tạo', 'tác động xã hội',
    'cơ hội thăng tiến', 'học hỏi liên tục', 'tự chủ', 'làm việc với con người',
    'làm việc với công nghệ', 'đa dạng nhiệm vụ', 'chuyên sâu', 'an toàn', 'được công nhận'
  ];

  const PERSONALITY = [
    'hướng ngoại', 'hướng nội', 'tỉ mỉ', 'nhanh nhạy', 'kiên nhẫn', 'thích thử thách',
    'thích ổn định', 'ưa sáng tạo', 'thích phân tích', 'thích giao tiếp', 'lãnh đạo',
    'hỗ trợ', 'thực tế', 'trừu tượng', 'thích học', 'thích dạy', 'thích khám phá'
  ];

  const INDUSTRIES = [
    'công nghệ', 'tài chính', 'ngân hàng', 'bảo hiểm', 'bán lẻ', 'logistics', 'y tế',
    'giáo dục', 'bất động sản', 'xây dựng', 'nông nghiệp', 'thực phẩm', 'du lịch',
    'truyền thông', 'giải trí', 'sản xuất', 'hàng không', 'tự động hóa', 'viễn thông',
    'năng lượng', 'môi trường', 'thời trang', 'mỹ phẩm', 'dược', 'game', 'thương mại điện tử',
    'fintech', 'edtech', 'healthtech', 'agritech'
  ];

  const ROLES = Array.from(new Set(buildCareerRecords().map((r) => r.name)));

  const CONSTRAINTS = [
    'không thích giao tiếp nhiều', 'ngại nói trước đám đông', 'không giỏi toán',
    'không thích lập trình', 'thích làm ngoài trời', 'muốn làm gần nhà', 'muốn thu nhập ổn định',
    'muốn thời gian linh hoạt', 'muốn học nhanh đi làm', 'muốn đi sâu học thuật'
  ];

  const EXPERIENCE_QUESTIONS = [
    { text: 'Bạn đang học ngành gì hoặc lĩnh vực gì?', for: ['university'] },
    { text: 'Bạn đang làm công việc gì hiện tại?', for: ['professional'] },
    { text: 'Bạn đã từng làm những công việc nào?', for: ['professional'] },
    { text: 'Điểm mạnh lớn nhất trong công việc/học tập của bạn là gì?', for: ['university', 'professional'] },
    { text: 'Bạn muốn chuyển hướng nghề nghiệp vì lý do gì?', for: ['professional'] },
    { text: 'Bạn muốn công việc tương lai thiên về kỹ thuật hay kinh doanh?', for: ['university', 'professional'] }
  ];

  const templates = {
    education: [
      (item) => `Bạn đánh giá thế nào về ${item}?`,
      (item) => `Bạn học ${item} có tốt không?`,
      (item) => `Bạn thấy ${item} có phù hợp với mình không?`,
      (item) => `Mức độ yêu thích của bạn với ${item} là thế nào?`,
      (item) => `Nếu chọn nghề liên quan ${item}, bạn có sẵn sàng không?`
    ],
    interests: [
      (item) => `Bạn có hứng thú với ${item} không?`,
      (item) => `Bạn có muốn tìm hiểu sâu hơn về ${item} không?`,
      (item) => `Bạn quan tâm ${item} ở mức độ nào?`,
      (item) => `Bạn có từng trải nghiệm ${item} chưa?`,
      (item) => `Bạn muốn theo hướng ${item} trong tương lai không?`
    ],
    skills: [
      (item) => `Bạn có tự tin về kỹ năng ${item} không?`,
      (item) => `Bạn đánh giá kỹ năng ${item} của mình thế nào?`,
      (item) => `Bạn có muốn phát triển kỹ năng ${item} không?`,
      (item) => `Bạn đã từng áp dụng kỹ năng ${item} chưa?`,
      (item) => `Bạn có muốn học thêm về ${item} không?`
    ],
    workstyle: [
      (item) => `Bạn thấy phù hợp với ${item} không?`,
      (item) => `Bạn có thích ${item} không?`,
      (item) => `Bạn cảm thấy ${item} có hiệu quả với bạn không?`
    ],
    values: [
      (item) => `Bạn có ưu tiên ${item} trong công việc không?`,
      (item) => `Mức độ quan trọng của ${item} với bạn là thế nào?`,
      (item) => `Bạn sẵn sàng đánh đổi điều gì để có ${item}?`
    ],
    personality: [
      (item) => `Bạn có thấy mình là người ${item} không?`,
      (item) => `Bạn nghĩ mình ${item} ở mức nào?`,
      (item) => `Người xung quanh đánh giá bạn ${item} không?`
    ],
    industry: [
      (item) => `Bạn muốn làm trong ngành ${item} không?`,
      (item) => `Bạn thấy ngành ${item} hấp dẫn không?`,
      (item) => `Bạn có biết gì về ngành ${item}?`,
      (item) => `Bạn có sẵn sàng theo đuổi ngành ${item} không?`
    ],
    role: [
  (item) => `Bạn có muốn thử vai trò ${item} không?`,
  (item) => `Bạn nghĩ mình phù hợp với vai trò ${item} không?`,
  (item) => `Bạn có hứng thú với công việc ${item} không?`,
  (item) => `Bạn có thể hình dung mình làm ${item} không?`,
  (item) => `Nếu làm ${item}, bạn muốn phát triển theo hướng nào?`,
  (item) => `Công việc ${item} có phù hợp với bạn không?`,
  (item) => `Bạn có muốn tìm hiểu sâu hơn về vai trò ${item} không?`,
  (item) => `Bạn có sẵn sàng học thêm để đảm nhiệm vai trò ${item} không?`
],
    constraints: [
      (item) => `Điều này có đúng với bạn: "${item}"?`,
      (item) => `Bạn có gặp rào cản: "${item}" không?`,
      (item) => `Bạn thấy "${item}" ảnh hưởng đến lựa chọn nghề không?`
    ]
  };

  function addQuestions(list, category, tags) {
    const tpls = templates[category];
    for (const item of list) {
      for (const tpl of tpls) {
        questions.push({
          id: `q_${id++}`,
          text: tpl(item),
          category,
          options: [],
          tags: tags || [],
          item
        });
      }
    }
  }

  addQuestions(SUBJECTS, 'education');
  addQuestions(INTERESTS, 'interests');
  addQuestions(SKILLS, 'skills');
  addQuestions(WORKSTYLES, 'workstyle');
  addQuestions(VALUES, 'values');
  addQuestions(PERSONALITY, 'personality');
  addQuestions(INDUSTRIES, 'industry');
  addQuestions(ROLES, 'role');
  addQuestions(CONSTRAINTS, 'constraints');
  for (const q of EXPERIENCE_QUESTIONS) {
    questions.push({
      id: `q_${id++}`,
      text: q.text,
      category: 'experience',
      options: [],
      tags: [],
      for: q.for || []
    });
  }

  const MIN_QUESTIONS = 10000;
  if (questions.length < MIN_QUESTIONS && ROLES.length > 0) {
    const fillers = [
      (item) => `Nếu chọn ${item}, bạn thấy mình cần bổ sung kỹ năng nào?`,
      (item) => `Mức độ ưu tiên của bạn với vai trò ${item} là bao nhiêu?`,
      (item) => `Bạn có muốn làm thử ${item} trong 6-12 tháng tới không?`,
      (item) => `Bạn đánh giá cơ hội phát triển của ${item} với bạn ra sao?`
    ];
    let idx = 0;
    while (questions.length < MIN_QUESTIONS) {
      const role = ROLES[idx % ROLES.length];
      const tpl = fillers[idx % fillers.length];
      questions.push({
        id: `q_${id++}`,
        text: tpl(role),
        category: 'role',
        options: [],
        tags: [],
        item: role
      });
      idx += 1;
    }
  }

  return questions;
}

function rotateArray(list, offset) {
  if (list.length === 0) return list;
  const idx = offset % list.length;
  return list.slice(idx).concat(list.slice(0, idx));
}

function seededPick(list, seed, offset) {
  if (list.length === 0) return null;
  const idx = Math.abs(seed + offset * 7) % list.length;
  return list[idx];
}

function hashCode(value) {
  let hash = 0;
  const str = String(value || '');
  for (let i = 0; i < str.length; i += 1) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

module.exports = {
  getConversationState,
  recordAnswer,
  getNextQuestion,
  isEnoughInfo
};
