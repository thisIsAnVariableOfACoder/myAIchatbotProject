const SKILL_WEIGHTS = {
  coding: { 'Software Engineer': 25, 'Frontend Developer': 20, 'Backend Developer': 20, 'Full Stack Developer': 20, 'Data Engineer': 10 },
  javascript: { 'Frontend Developer': 20, 'Full Stack Developer': 15, 'Software Engineer': 10 },
  python: { 'Data Scientist': 20, 'Data Engineer': 20, 'AI Engineer': 20, 'Software Engineer': 10 },
  sql: { 'Data Analyst': 20, 'Data Engineer': 20, 'Backend Developer': 10 },
  math: { 'Data Analyst': 20, 'Data Scientist': 20, 'Software Engineer': 15 },
  design: { 'UI/UX Designer': 25, 'Graphic Designer': 25, 'Digital Product Designer': 20 },
  communication: { 'Marketing Specialist': 20, 'Teacher': 25, 'HR Specialist': 20, 'Sales Representative': 20 },
  writing: { 'Marketing Specialist': 15, 'Copywriter': 20, 'Content Creator': 15 },
  research: { 'UX Researcher': 20, 'Data Scientist': 10, 'Research Assistant': 20 },
  testing: { 'QA Engineer': 25 },
  cloud: { 'Cloud Engineer': 25, 'DevOps Engineer': 20 },
  security: { 'Cybersecurity Analyst': 25 },
  finance: { 'Financial Analyst': 20, 'Accountant': 20 },
  management: { 'Project Manager': 20, 'Product Manager': 20, 'Operations Manager': 20 },
  healthcare: { 'Nurse': 20, 'Pharmacist': 20 },
  teaching: { 'Teacher': 20, 'English Teacher': 20 }
};

const INTEREST_WEIGHTS = {
  technology: { 'Software Engineer': 20, 'Data Analyst': 15, 'AI Engineer': 15 },
  data: { 'Data Analyst': 20, 'Data Engineer': 20, 'Data Scientist': 20 },
  arts: { 'UI/UX Designer': 20, 'Graphic Designer': 20, 'Content Creator': 10 },
  business: { 'Marketing Specialist': 20, 'Business Analyst': 20, 'Product Manager': 15 },
  education: { 'Teacher': 25, 'English Teacher': 20 },
  healthcare: { 'Nurse': 20, 'Pharmacist': 15 },
  marketing: { 'Marketing Specialist': 20, 'SEO Specialist': 15, 'Social Media Manager': 15 },
  finance: { 'Financial Analyst': 20, 'Accountant': 15 }
};

const EDUCATION_BONUS = {
  high_school: { 'Software Engineer': 5, 'UI/UX Designer': 10, 'Content Creator': 5 },
  university: { 'Data Analyst': 10, 'Marketing Specialist': 10, 'Business Analyst': 10 },
  bachelor: { 'Teacher': 15, 'Data Analyst': 10, 'Project Manager': 10 },
  professional: { 'Software Engineer': 15, 'Project Manager': 10, 'Sales Representative': 10 }
};

const SKILL_ALIASES = {
  coding: ['coding', 'code', 'dev', 'lập trình', 'lap trinh', 'lập trình web', 'lap trinh web'],
  javascript: ['javascript', 'js', 'node', 'nodejs', 'react'],
  python: ['python', 'py'],
  sql: ['sql', 'database', 'cơ sở dữ liệu', 'co so du lieu'],
  math: ['toán', 'math'],
  design: ['thiết kế', 'thiet ke', 'design', 'ui', 'ux', 'đồ họa', 'do hoa'],
  creativity: ['sáng tạo', 'sang tao', 'creative'],
  communication: ['giao tiếp', 'giao tiep', 'thuyết trình', 'thuyet trinh', 'trình bày', 'trinh bay'],
  writing: ['viết', 'viet', 'viết lách', 'viet lach', 'content', 'copywriting'],
  research: ['nghiên cứu', 'nghien cuu', 'research'],
  analysis: ['phân tích', 'phan tich', 'analysis', 'analytics', 'data'],
  management: ['quản lý', 'quan ly', 'management', 'leadership', 'lãnh đạo', 'lanh dao'],
  finance: ['tài chính', 'tai chinh', 'kế toán', 'ke toan', 'finance', 'accounting'],
  healthcare: ['y tế', 'y te', 'điều dưỡng', 'dieu duong', 'chăm sóc sức khỏe', 'cham soc suc khoe'],
  teaching: ['giảng dạy', 'giang day', 'dạy học', 'day hoc', 'sư phạm', 'su pham'],
  testing: ['kiểm thử', 'kiem thu', 'qa', 'test'],
  cloud: ['cloud', 'đám mây', 'dam may'],
  security: ['bảo mật', 'bao mat', 'an ninh', 'security'],
  problem_solving: ['giải quyết vấn đề', 'giai quyet van de', 'problem solving'],
  user_research: ['nghiên cứu người dùng', 'nghien cuu nguoi dung', 'user research'],
  organization: ['tổ chức', 'to chuc', 'organization'],
  service: ['dịch vụ', 'dich vu', 'customer service', 'chăm sóc khách hàng', 'cham soc khach hang'],
  sales: ['bán hàng', 'ban hang', 'sales'],
  negotiation: ['đàm phán', 'dam phan', 'negotiation'],
  operations: ['vận hành', 'van hanh', 'operations'],
  policy: ['chính sách', 'chinh sach', 'policy'],
  logistics: ['logistics', 'chuỗi cung ứng', 'chuoi cung ung'],
  safety: ['an toàn', 'an toan', 'safety'],
  hands_on: ['thực hành', 'thuc hanh', 'hands on', 'hands-on'],
  discipline: ['kỷ luật', 'ky luat', 'discipline'],
  training: ['huấn luyện', 'huan luyen', 'training'],
  navigation: ['định hướng', 'dinh huong', 'navigation'],
  execution: ['thực thi', 'thuc thi', 'execution'],
  planning: ['lập kế hoạch', 'lap ke hoach', 'planning']
};

const INTEREST_ALIASES = {
  technology: ['công nghệ', 'cong nghe', 'tech', 'it', 'phần mềm', 'phan mem'],
  data: ['dữ liệu', 'du lieu', 'data', 'analytics'],
  arts: ['nghệ thuật', 'nghe thuat', 'sáng tạo', 'sang tao', 'thiết kế', 'thiet ke'],
  business: ['kinh doanh', 'business', 'quản trị', 'quan tri', 'khởi nghiệp', 'khoi nghiep'],
  education: ['giáo dục', 'giao duc', 'dạy học', 'day hoc'],
  healthcare: ['y tế', 'y te', 'sức khỏe', 'suc khoe'],
  marketing: ['marketing', 'truyền thông', 'truyen thong', 'nội dung', 'noi dung'],
  finance: ['tài chính', 'tai chinh', 'kế toán', 'ke toan']
};

const SKILL_LABELS = {
  coding: 'lập trình',
  javascript: 'JavaScript',
  python: 'Python',
  sql: 'SQL',
  math: 'toán',
  design: 'thiết kế',
  creativity: 'sáng tạo',
  communication: 'giao tiếp',
  writing: 'viết lách',
  research: 'nghiên cứu',
  analysis: 'phân tích',
  management: 'quản lý',
  finance: 'tài chính',
  healthcare: 'y tế',
  teaching: 'giảng dạy',
  testing: 'kiểm thử',
  cloud: 'điện toán đám mây',
  security: 'an ninh/bảo mật',
  problem_solving: 'giải quyết vấn đề',
  user_research: 'nghiên cứu người dùng',
  organization: 'tổ chức',
  service: 'dịch vụ',
  sales: 'bán hàng',
  negotiation: 'đàm phán',
  operations: 'vận hành',
  policy: 'chính sách',
  logistics: 'logistics',
  safety: 'an toàn',
  hands_on: 'thực hành',
  discipline: 'kỷ luật',
  training: 'huấn luyện',
  navigation: 'định hướng',
  execution: 'thực thi',
  planning: 'lập kế hoạch'
};

const INTEREST_LABELS = {
  technology: 'công nghệ',
  data: 'dữ liệu',
  arts: 'sáng tạo/thiết kế',
  business: 'kinh doanh',
  education: 'giáo dục',
  healthcare: 'y tế',
  marketing: 'marketing',
  finance: 'tài chính'
};

const SKILL_ALIAS_MAP = buildAliasMap(SKILL_ALIASES);
const INTEREST_ALIAS_MAP = buildAliasMap(INTEREST_ALIASES);

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildAliasMap(defs) {
  const map = {};
  for (const [key, aliases] of Object.entries(defs)) {
    const items = [key, ...(aliases || [])];
    for (const alias of items) {
      const normalized = normalizeText(alias);
      if (normalized) map[normalized] = key;
    }
  }
  return map;
}

function normalizeList(list, aliasMap) {
  const out = new Set();
  for (const item of list || []) {
    const normalized = normalizeText(item);
    if (!normalized) continue;
    const canonical = aliasMap[normalized];
    out.add(canonical || normalized);
  }
  return Array.from(out);
}

function formatLabels(list, labelMap) {
  return list.map((item) => labelMap[item] || item).join(', ');
}

async function matchCareerAsync(profile, answers) {
  if (global.db) {
    const careers = await new Promise((resolve) => {
      global.db.all('SELECT name, required_skills, category FROM careers', (err, rows) => {
        if (err) return resolve([]);
        return resolve(rows || []);
      });
    });
    if (careers.length > 0) {
      return rankCareers(profile, answers, careers.map(c => ({
        name: c.name,
        required_skills: safeParse(c.required_skills, []),
        category: c.category || 'Other'
      })));
    }
  }
  return matchCareer(profile, answers);
}

function matchCareer(profile, answers) {
  const careers = [
    { name: 'Software Engineer', category: 'Technology' },
    { name: 'Frontend Developer', category: 'Technology' },
    { name: 'Backend Developer', category: 'Technology' },
    { name: 'Full Stack Developer', category: 'Technology' },
    { name: 'Data Analyst', category: 'Technology' },
    { name: 'Data Engineer', category: 'Technology' },
    { name: 'Data Scientist', category: 'Technology' },
    { name: 'AI Engineer', category: 'Technology' },
    { name: 'UI/UX Designer', category: 'Design' },
    { name: 'Graphic Designer', category: 'Design' },
    { name: 'Digital Product Designer', category: 'Design' },
    { name: 'UX Researcher', category: 'Design' },
    { name: 'Marketing Specialist', category: 'Marketing' },
    { name: 'SEO Specialist', category: 'Marketing' },
    { name: 'Social Media Manager', category: 'Marketing' },
    { name: 'Content Creator', category: 'Media' },
    { name: 'Copywriter', category: 'Marketing' },
    { name: 'Business Analyst', category: 'Business' },
    { name: 'Product Manager', category: 'Business' },
    { name: 'Project Manager', category: 'Business' },
    { name: 'QA Engineer', category: 'Technology' },
    { name: 'DevOps Engineer', category: 'Technology' },
    { name: 'Cloud Engineer', category: 'Technology' },
    { name: 'Cybersecurity Analyst', category: 'Technology' },
    { name: 'Financial Analyst', category: 'Finance' },
    { name: 'Accountant', category: 'Finance' },
    { name: 'HR Specialist', category: 'Business' },
    { name: 'Sales Representative', category: 'Business' },
    { name: 'Teacher', category: 'Education' },
    { name: 'English Teacher', category: 'Education' },
    { name: 'Nurse', category: 'Healthcare' },
    { name: 'Pharmacist', category: 'Healthcare' }
  ];
  const scores = {};
  const signals = buildSignals(profile, answers);
  const skills = signals.skills;
  const interests = signals.interests;

  careers.forEach((career) => {
    let score = 0;

    skills.forEach((skill) => { score += (SKILL_WEIGHTS[skill]?.[career.name] || 0); });

    interests.forEach((interest) => { score += (INTEREST_WEIGHTS[interest]?.[career.name] || 0); });

    if (profile.education_level) {
      score += (EDUCATION_BONUS[profile.education_level]?.[career.name] || 0);
    }

    if (answers?.likes_computers && ['Software Engineer', 'Data Analyst', 'Frontend Developer', 'Backend Developer'].includes(career.name)) {
      score += 5;
    }

    if (signals.text) {
      score += keywordBoost(career.name, signals.text);
    }

    score += tagBoost(career.category, signals.tags);
    scores[career.name] = Math.min(score, 100);
  });

  // Chuẩn hóa điểm thành xác suất
  const totalScore = Object.values(scores).reduce((sum, s) => sum + s, 0);
  const recs = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, score]) => ({
      career_name: name,
      match_score: score,
      probability: totalScore > 0 ? (score / totalScore) : 0,
      reasons: generateReasons(name, profile)
    }));

  return boostRecommendations(recs);
}

function rankCareers(profile, answers, careers) {
  const scores = {};
  const signals = buildSignals(profile, answers);
  const skills = signals.skills;
  const interests = signals.interests;
  const edu = profile.education_level || '';
      const scores = {};  
      // Sử dụng danh sách nghề nghiệp từ database (bổ sung mới)
      const { buildCareerRecords } = require('../data/careerLibrary');
      const CAREER_LIST = buildCareerRecords().map(c => c.name);
  for (const c of careers) {
    let score = 0;
    const required = c.required_skills || [];
    for (const s of skills) {
      if (required.includes(s)) score += 20;
      score += (SKILL_WEIGHTS[s]?.[c.name] || 0);
    }
    for (const i of interests) {
      score += (INTEREST_WEIGHTS[i]?.[c.name] || 0);
    }
    if (edu) score += (EDUCATION_BONUS[edu]?.[c.name] || 0);
    if (signals.text) score += keywordBoost(c.name, signals.text);
    score += tagBoost(c.category, signals.tags);
    scores[c.name] = Math.min(score, 100);
  }

  const recs = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, score]) => ({
      career_name: name,
      match_score: score,
      reasons: generateReasons(name, profile)
    }));

  return boostRecommendations(recs);
}

function generateReasons(career, profile) {
  const reasons = [];
  const skills = normalizeList(profile.skills ? safeParse(profile.skills, []) : [], SKILL_ALIAS_MAP);
  const interests = normalizeList(profile.interests ? safeParse(profile.interests, []) : [], INTEREST_ALIAS_MAP);

  const matchedSkills = skills.filter(s => SKILL_WEIGHTS[s]?.[career] > 15);
  if (matchedSkills.length > 0) {
    reasons.push(`Kỹ năng phù hợp: ${formatLabels(matchedSkills, SKILL_LABELS)}`);
  }
  const matchedInterests = interests.filter(i => INTEREST_WEIGHTS[i]?.[career] > 15);
  if (matchedInterests.length > 0) {
    reasons.push(`Sở thích phù hợp: ${formatLabels(matchedInterests, INTEREST_LABELS)}`);
  }
  if (EDUCATION_BONUS[profile.education_level]?.[career] > 10) {
    reasons.push('Trình độ học vấn phù hợp');
  }

  return reasons.length ? reasons : ['Phù hợp tổng quan với hồ sơ của bạn'];
}

function keywordBoost(career, text) {
  const t = normalizeText(text);
  const rules = [
    { keywords: ['data', 'so lieu', 'phan tich'], careers: ['Data Analyst', 'Data Engineer', 'Data Scientist'] },
    { keywords: ['thiet ke', 'design', 'ui', 'ux'], careers: ['UI/UX Designer', 'Graphic Designer', 'Digital Product Designer'] },
    { keywords: ['marketing', 'seo', 'social', 'noi dung', 'content'], careers: ['Marketing Specialist', 'SEO Specialist', 'Social Media Manager', 'Content Creator'] },
    { keywords: ['tai chinh', 'ke toan', 'finance'], careers: ['Financial Analyst', 'Accountant'] },
    { keywords: ['giang day', 'day hoc', 'giao duc'], careers: ['Teacher', 'English Teacher'] },
    { keywords: ['y te', 'dieu duong', 'nha thuoc'], careers: ['Nurse', 'Pharmacist'] },
    { keywords: ['bao mat', 'security', 'an ninh'], careers: ['Cybersecurity Analyst'] }
  ];
  for (const rule of rules) {
    if (rule.keywords.some(k => t.includes(k)) && rule.careers.includes(career)) {
      return 8;
    }
  }
  return 0;
}

function buildSignals(profile, answers) {
  const baseSkills = normalizeList(profile.skills ? safeParse(profile.skills, []) : [], SKILL_ALIAS_MAP);
  const baseInterests = normalizeList(profile.interests ? safeParse(profile.interests, []) : [], INTEREST_ALIAS_MAP);
  const text = buildAnswerText(answers);
  const skillsFromText = detectAliasesInText(text, SKILL_ALIAS_MAP);
  const interestsFromText = detectAliasesInText(text, INTEREST_ALIAS_MAP);
  const skills = uniqueArray([...baseSkills, ...skillsFromText, ...(answers?.skills || [])]);
  const interests = uniqueArray([...baseInterests, ...interestsFromText, ...(answers?.interests || [])]);
  const tags = detectTags(text);
  if (answers?.tags) {
    if (Array.isArray(answers.tags)) {
      for (const t of answers.tags) tags.add(t);
    } else if (typeof answers.tags === 'object') {
      for (const [key, value] of Object.entries(answers.tags)) {
        if (value) tags.add(key);
      }
    }
  }
  return { skills, interests, tags, text };
}

function buildAnswerText(answers) {
  if (!answers) return '';
  if (typeof answers === 'string') return answers;
  const parts = [];
  if (answers.message) parts.push(answers.message);
  if (answers.answersText) parts.push(answers.answersText);
  if (Array.isArray(answers.answers)) {
    for (const item of answers.answers) {
      if (item?.a) parts.push(item.a);
    }
  }
  return parts.join(' ');
}

function detectAliasesInText(text, aliasMap) {
  const normalized = normalizeText(text);
  if (!normalized) return [];
  const found = new Set();
  for (const [alias, canonical] of Object.entries(aliasMap)) {
    if (alias && normalized.includes(alias)) found.add(canonical);
  }
  return Array.from(found);
}

function uniqueArray(list) {
  return Array.from(new Set(list.filter(Boolean)));
}

const TAG_KEYWORDS = {
  tech: ['cong nghe', 'it', 'lap trinh', 'coding', 'phan mem', 'data', 'ai', 'ml', 'cloud', 'devops', 'an ninh mang', 'cyber'],
  design: ['thiet ke', 'design', 'ui', 'ux', 'do hoa', 'sang tao'],
  business: ['kinh doanh', 'marketing', 'sales', 'ban hang', 'quan tri', 'tai chinh', 'ke toan', 'finance'],
  health: ['y te', 'suc khoe', 'dieu duong', 'duoc', 'benh vien'],
  education: ['giao duc', 'day hoc', 'su pham', 'teacher', 'giang day'],
  engineering: ['co khi', 'ky su', 'dien', 'dien tu', 'xay dung', 'kien truc', 'tu dong hoa'],
  media: ['noi dung', 'content', 'truyen thong', 'bao chi', 'media', 'video', 'film', 'am nhac'],
  law: ['phap ly', 'luat', 'legal'],
  agriculture: ['nong nghiep', 'chan nuoi', 'trong trot', 'agri'],
  energy: ['nang luong', 'energy', 'renewable', 'solar', 'wind', 'power'],
  logistics: ['logistics', 'supply chain', 'kho van', 'transport', 'kho bai'],
  construction: ['construction', 'xay dung', 'ha tang', 'cong trinh'],
  science: ['nghien cuu', 'science', 'lab', 'hoa hoc', 'vat ly', 'sinh hoc'],
  research: ['research', 'nghien cuu', 'hoc thuat', 'phong thi nghiem']
};

const CATEGORY_TAG_BOOST = {
  Technology: ['tech'],
  Design: ['design'],
  Business: ['business'],
  Marketing: ['business', 'media'],
  Finance: ['business'],
  Education: ['education'],
  Healthcare: ['health'],
  Engineering: ['engineering'],
  Media: ['media'],
  Legal: ['law'],
  Agriculture: ['agriculture'],
  Energy: ['energy'],
  Logistics: ['logistics'],
  Construction: ['construction'],
  Science: ['science'],
  Research: ['research']
};

function detectTags(text) {
  const normalized = normalizeText(text);
  const tags = new Set();
  if (!normalized) return tags;
  for (const [tag, keys] of Object.entries(TAG_KEYWORDS)) {
    if (keys.some((k) => normalized.includes(k))) tags.add(tag);
  }
  return tags;
}

function tagBoost(category, tags) {
  if (!category || !tags || tags.size === 0) return 0;
  const keys = CATEGORY_TAG_BOOST[category] || [];
  if (!keys.length) return 0;
  let boost = 0;
  for (const k of keys) {
    if (tags.has(k)) boost += 10;
  }
  return boost;
}

function boostRecommendations(recs) {
  if (!Array.isArray(recs) || recs.length === 0) return recs;
  const byName = new Map();
  for (const r of recs) {
    const name = String(r.career_name || '').trim();
    if (!name) continue;
    const score = Number(r.match_score || 0);
    const existing = byName.get(name);
    if (!existing || score > existing.match_score) {
      byName.set(name, { ...r, career_name: name, match_score: score });
    }
  }
  const unique = Array.from(byName.values());
  const scores = unique.map(r => Number(r.match_score || 0));
  const max = Math.max(...scores);
  if (max <= 0) {
    const base = 48;
    return unique.map((r, idx) => {
      const score = Math.max(20, base - idx * 2.5);
      return {
        ...r,
        match_score: score,
        confidence: 'low'
      };
    });
  }
  const targetMax = Math.min(95, Math.max(max, 70));
  const scale = targetMax / max;
  const scaled = unique.map((r) => {
    const boosted = Math.min(100, Number(r.match_score || 0) * scale);
    return {
      ...r,
      match_score: boosted,
      confidence: boosted >= 70 ? 'high' : boosted >= 50 ? 'medium' : 'low'
    };
  }).sort((a, b) => b.match_score - a.match_score);

  for (let i = 1; i < scaled.length; i += 1) {
    if (scaled[i].match_score >= scaled[i - 1].match_score) {
      scaled[i].match_score = Math.max(0, scaled[i - 1].match_score - 0.4);
    }
  }
  return scaled;
}

module.exports = { matchCareer, matchCareerAsync, generateReasons };
