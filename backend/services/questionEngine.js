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
    const QUESTION_BANK = [
      // ...existing code...
      // Các câu hỏi phân biệt từng nghề nghiệp phổ biến
      {
        id: 'q1',
        question: 'Bạn thích làm việc với con người hay máy móc?',
        options: ['Con người', 'Máy móc', 'Cả hai'],
        weights: {
          'Giáo viên Toán': 10, 'Giáo viên Văn': 10, 'Giáo viên Tiếng Anh': 10, 'Giáo viên Lịch sử': 10, 'Giáo viên Địa lý': 10,
          'Lập trình viên': 10, 'Chuyên viên phát triển phần mềm': 10, 'Chuyên viên quản trị mạng': 10, 'Chuyên viên bảo mật thông tin': 10,
          'UI/UX Designer': 10, 'Thiết kế đồ họa': 10, 'Thiết kế web': 10, 'Biên tập viên': 10, 'Phóng viên': 10, 'MC truyền hình': 10,
          'Giám đốc điều hành (CEO)': 10, 'Giám đốc tài chính (CFO)': 10, 'Giám đốc marketing (CMO)': 10, 'Trưởng phòng kinh doanh': 10
        }
      },
      {
        id: 'q2',
        question: 'Bạn thích giải quyết vấn đề logic hay sáng tạo?',
        options: ['Logic', 'Sáng tạo', 'Cả hai'],
        weights: {
          'Giáo viên Toán': 10, 'Lập trình viên': 10, 'Chuyên viên phân tích hệ thống': 10, 'Chuyên viên phát triển phần mềm': 10,
          'Thiết kế đồ họa': 10, 'Thiết kế web': 10, 'Thiết kế sáng tạo': 10, 'Biên tập viên': 10, 'Phóng viên': 10, 'MC truyền hình': 10
        }
      },
      {
        id: 'q3',
        question: 'Bạn thích làm việc độc lập hay theo nhóm?',
        options: ['Độc lập', 'Theo nhóm', 'Cả hai'],
        weights: {
          'Lập trình viên': 10, 'Chuyên viên phát triển phần mềm': 10, 'Chuyên viên quản trị mạng': 10, 'Chuyên viên bảo mật thông tin': 10,
          'Giáo viên Toán': 10, 'Giáo viên Văn': 10, 'Giáo viên Tiếng Anh': 10, 'Giáo viên Lịch sử': 10, 'Giáo viên Địa lý': 10,
          'UI/UX Designer': 10, 'Thiết kế đồ họa': 10, 'Thiết kế web': 10, 'Biên tập viên': 10, 'Phóng viên': 10, 'MC truyền hình': 10,
          'Giám đốc điều hành (CEO)': 10, 'Giám đốc tài chính (CFO)': 10, 'Giám đốc marketing (CMO)': 10, 'Trưởng phòng kinh doanh': 10
        }
      },
      {
        id: 'q4',
        question: 'Bạn có thích quản lý, lãnh đạo không?',
        options: ['Có', 'Không', 'Tùy tình huống'],
        weights: {
          'Giám đốc điều hành (CEO)': 15, 'Giám đốc tài chính (CFO)': 15, 'Giám đốc marketing (CMO)': 15, 'Trưởng phòng kinh doanh': 15,
          'Trưởng phòng dự án': 15, 'Trưởng phòng nhân sự': 15, 'Trưởng phòng marketing': 15
        }
      },
      {
        id: 'q5',
        question: 'Bạn có thích sáng tạo nội dung, truyền thông?',
        options: ['Có', 'Không', 'Tùy tình huống'],
        weights: {
          'Biên tập viên': 15, 'Phóng viên': 15, 'MC truyền hình': 15, 'Đạo diễn': 15, 'Quay phim': 15,
          'Chuyên viên truyền thông': 15, 'Chuyên viên PR': 15, 'Chuyên viên quảng cáo': 15, 'Chuyên viên sản xuất chương trình': 15
        }
      },
      {
        id: 'q6',
        question: 'Bạn có thích thiết kế, mỹ thuật, sáng tạo hình ảnh?',
        options: ['Có', 'Không', 'Tùy tình huống'],
        weights: {
          'UI/UX Designer': 15, 'Thiết kế đồ họa': 15, 'Thiết kế web': 15, 'Thiết kế sáng tạo': 15, 'Thiết kế thời trang': 15,
          'Thiết kế nội thất': 15, 'Thiết kế sản phẩm': 15, 'Thiết kế bao bì': 15, 'Thiết kế quảng cáo': 15
        }
      },
      {
        id: 'q7',
        question: 'Bạn có thích phân tích dữ liệu, số liệu, tài chính?',
        options: ['Có', 'Không', 'Tùy tình huống'],
        weights: {
          'Chuyên viên phân tích dữ liệu kinh doanh': 15, 'Chuyên viên quản lý tài chính': 15, 'Chuyên viên quản lý chất lượng': 15,
          'Giám đốc tài chính (CFO)': 15, 'Business Analyst': 15, 'Financial Analyst': 15, 'Accountant': 15
        }
      },
      {
        id: 'q8',
        question: 'Bạn có thích phát triển phần mềm, lập trình?',
        options: ['Có', 'Không', 'Tùy tình huống'],
        weights: {
          'Lập trình viên': 20, 'Chuyên viên phát triển phần mềm': 20, 'Software Engineer': 20, 'Backend Developer': 20, 'Frontend Developer': 20,
          'Full Stack Developer': 20, 'Mobile Developer': 20, 'Game Developer': 20, 'QA Engineer': 20, 'DevOps Engineer': 20
        }
      },
      {
        id: 'q9',
        question: 'Bạn có thích quản trị hệ thống, bảo mật thông tin?',
        options: ['Có', 'Không', 'Tùy tình huống'],
        weights: {
          'Chuyên viên quản trị hệ thống': 20, 'Chuyên viên bảo mật thông tin': 20, 'Security Engineer': 20, 'Network Engineer': 20,
          'Database Administrator': 20, 'Cloud Engineer': 20, 'DevSecOps Engineer': 20
        }
      },
      {
        id: 'q10',
        question: 'Bạn có thích phát triển game, ứng dụng di động, AI, IoT?',
        options: ['Có', 'Không', 'Tùy tình huống'],
        weights: {
          'Chuyên viên phát triển game': 20, 'Chuyên viên phát triển ứng dụng di động': 20, 'Chuyên viên phát triển AI': 20,
          'Chuyên viên phát triển IoT': 20, 'Game Developer': 20, 'Mobile Developer': 20, 'AI Engineer': 20
        }
      }
    ];

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
