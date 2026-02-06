const USERS_KEY = 'offline_users_v1';
const PROFILES_KEY = 'offline_profiles_v1';
const CONVERSATIONS_KEY = 'offline_conversations_v1';
const STATE_PREFIX = 'offline_state_';
const MESSAGES_PREFIX = 'offline_messages_';
const RECS_PREFIX = 'offline_recs_';

const DEFAULT_ADMIN = { id: 1, email: 'admin@demo.local', password: 'admin123', user_type: 'admin' };

const QUESTIONS = [
  { id: 'q1', text: 'Bạn thích học môn nào nhất?', tags: ['education', 'analysis'] },
  { id: 'q2', text: 'Bạn có hứng thú với công nghệ hoặc lập trình không?', tags: ['tech'] },
  { id: 'q3', text: 'Bạn thích làm việc với con người hay dữ liệu?', tags: ['people', 'data'] },
  { id: 'q4', text: 'Bạn có thiên về sáng tạo (thiết kế, viết, nghệ thuật) không?', tags: ['design', 'creative'] },
  { id: 'q5', text: 'Bạn quan tâm đến kinh doanh, marketing, bán hàng không?', tags: ['business', 'marketing'] },
  { id: 'q6', text: 'Bạn thấy mình phù hợp môi trường y tế, chăm sóc sức khỏe không?', tags: ['health'] },
  { id: 'q7', text: 'Bạn thích nghiên cứu, thí nghiệm, khoa học không?', tags: ['research', 'science'] },
  { id: 'q8', text: 'Bạn muốn công việc ổn định hay thử thách nhiều?', tags: ['values'] },
  { id: 'q9', text: 'Bạn thích làm việc ngoài hiện trường hay trong văn phòng?', tags: ['field', 'office'] },
  { id: 'q10', text: 'Bạn có thích quản lý, điều phối hoặc lãnh đạo không?', tags: ['leadership'] },
  { id: 'q11', text: 'Bạn có thích ngoại ngữ, giao tiếp đa văn hóa không?', tags: ['language'] },
  { id: 'q12', text: 'Bạn có quan tâm đến luật, chính sách, quy định không?', tags: ['law'] }
];

const CAREERS = [
  { name: 'Kỹ sư phần mềm', category: 'Công nghệ', tags: ['tech', 'data', 'analysis'] },
  { name: 'Khoa học dữ liệu', category: 'Công nghệ', tags: ['tech', 'data', 'research'] },
  { name: 'AI Engineer', category: 'Công nghệ', tags: ['tech', 'research', 'analysis'] },
  { name: 'An ninh mạng', category: 'Công nghệ', tags: ['tech', 'analysis'] },
  { name: 'Product Manager', category: 'Kinh doanh', tags: ['business', 'leadership', 'people'] },
  { name: 'Digital Marketing', category: 'Kinh doanh', tags: ['marketing', 'creative'] },
  { name: 'Sales Executive', category: 'Kinh doanh', tags: ['people', 'business'] },
  { name: 'UI/UX Designer', category: 'Thiết kế', tags: ['design', 'creative'] },
  { name: 'Graphic Designer', category: 'Thiết kế', tags: ['design', 'creative'] },
  { name: 'Content Creator', category: 'Truyền thông', tags: ['creative', 'people'] },
  { name: 'Giáo viên', category: 'Giáo dục', tags: ['people', 'education'] },
  { name: 'Giảng viên đại học', category: 'Giáo dục', tags: ['education', 'research'] },
  { name: 'Điều dưỡng', category: 'Y tế', tags: ['health', 'people'] },
  { name: 'Bác sĩ', category: 'Y tế', tags: ['health', 'research'] },
  { name: 'Kỹ sư điện - điện tử', category: 'Kỹ thuật', tags: ['science', 'analysis'] },
  { name: 'Kỹ sư cơ khí', category: 'Kỹ thuật', tags: ['science', 'analysis', 'field'] },
  { name: 'Kỹ sư xây dựng', category: 'Xây dựng', tags: ['field', 'analysis'] },
  { name: 'Kiến trúc sư', category: 'Xây dựng', tags: ['design', 'creative'] },
  { name: 'Nhà nghiên cứu', category: 'Khoa học', tags: ['research', 'science'] },
  { name: 'Chuyên viên phân tích tài chính', category: 'Tài chính', tags: ['analysis', 'business'] },
  { name: 'Kế toán', category: 'Tài chính', tags: ['analysis'] },
  { name: 'Luật sư', category: 'Pháp lý', tags: ['law', 'people'] },
  { name: 'Biên dịch viên', category: 'Ngôn ngữ', tags: ['language', 'people'] },
  { name: 'Chuyên viên nhân sự', category: 'Quản trị', tags: ['people', 'business'] },
  { name: 'Chuyên viên logistics', category: 'Logistics', tags: ['analysis', 'office'] }
];

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getUsers() {
  const users = readJson(USERS_KEY, []);
  if (!users.find((u) => u.email === DEFAULT_ADMIN.email)) {
    users.push(DEFAULT_ADMIN);
    writeJson(USERS_KEY, users);
  }
  return users;
}

function saveUsers(users) {
  writeJson(USERS_KEY, users);
}

function getProfiles() {
  return readJson(PROFILES_KEY, {});
}

function saveProfiles(profiles) {
  writeJson(PROFILES_KEY, profiles);
}

function getConversations() {
  return readJson(CONVERSATIONS_KEY, []);
}

function saveConversations(conversations) {
  writeJson(CONVERSATIONS_KEY, conversations);
}

function getState(conversationId) {
  return readJson(`${STATE_PREFIX}${conversationId}`, {
    index: 0,
    answers: [],
    tags: {}
  });
}

function saveState(conversationId, state) {
  writeJson(`${STATE_PREFIX}${conversationId}`, state);
}

function getMessages(conversationId) {
  return readJson(`${MESSAGES_PREFIX}${conversationId}`, []);
}

function saveMessages(conversationId, messages) {
  writeJson(`${MESSAGES_PREFIX}${conversationId}`, messages);
}

function getRecommendations(conversationId) {
  return readJson(`${RECS_PREFIX}${conversationId}`, []);
}

function saveRecommendations(conversationId, recs) {
  writeJson(`${RECS_PREFIX}${conversationId}`, recs);
}

function ensureConversation(conversationId, userId, message) {
  const conversations = getConversations();
  let conv = conversations.find((c) => c.conversation_id === conversationId);
  if (!conv) {
    const title = (message || '').trim() || `Cuộc trò chuyện ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`;
    conv = {
      conversation_id: conversationId,
      title,
      user_id: userId || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    conversations.unshift(conv);
  } else {
    conv.updated_at = new Date().toISOString();
  }
  saveConversations(conversations);
  return conv;
}

function updateConversationTitle(conversationId, title) {
  const conversations = getConversations();
  const conv = conversations.find((c) => c.conversation_id === conversationId);
  if (conv) {
    conv.title = title;
    conv.updated_at = new Date().toISOString();
    saveConversations(conversations);
  }
}

function removeConversation(conversationId) {
  const conversations = getConversations().filter((c) => c.conversation_id !== conversationId);
  saveConversations(conversations);
  localStorage.removeItem(`${MESSAGES_PREFIX}${conversationId}`);
  localStorage.removeItem(`${RECS_PREFIX}${conversationId}`);
  localStorage.removeItem(`${STATE_PREFIX}${conversationId}`);
}

function clearHistoryForUser(userId) {
  const conversations = getConversations().filter((c) => c.user_id !== userId);
  saveConversations(conversations);
}

function deriveTags(text) {
  const lower = text.toLowerCase();
  const tags = {};
  if (lower.includes('công nghệ') || lower.includes('lập trình') || lower.includes('it')) tags.tech = true;
  if (lower.includes('kinh doanh') || lower.includes('marketing') || lower.includes('bán')) tags.business = true;
  if (lower.includes('thiết kế') || lower.includes('sáng tạo') || lower.includes('nghệ')) tags.design = true;
  if (lower.includes('y tế') || lower.includes('sức khỏe') || lower.includes('bác sĩ')) tags.health = true;
  if (lower.includes('giáo') || lower.includes('dạy')) tags.education = true;
  if (lower.includes('nghiên cứu') || lower.includes('khoa học')) tags.research = true;
  if (lower.includes('tài chính') || lower.includes('kế toán')) tags.finance = true;
  if (lower.includes('luật')) tags.law = true;
  if (lower.includes('ngoại ngữ') || lower.includes('tiếng')) tags.language = true;
  if (lower.includes('lãnh đạo') || lower.includes('quản lý')) tags.leadership = true;
  if (lower.includes('dữ liệu') || lower.includes('phân tích')) tags.data = true;
  return tags;
}

function scoreCareers(state) {
  const tags = state.tags || {};
  const answersText = state.answers.join(' ').toLowerCase();
  const scored = CAREERS.map((career) => {
    let score = 20;
    for (const tag of career.tags) {
      if (tags[tag]) score += 18;
      if (answersText.includes(tag)) score += 6;
    }
    const noise = (hashCode(career.name + answersText) % 7);
    score += noise;
    return { career_name: career.name, match_score: score, reasons: buildReasons(career, tags) };
  });
  scored.sort((a, b) => b.match_score - a.match_score);
  const top = scored.slice(0, 10);
  const max = top[0]?.match_score || 1;
  return top.map((r, idx) => ({
    ...r,
    match_score: Math.max(20, Math.min(98, Math.round((r.match_score / max) * 100) - idx))
  }));
}

function buildReasons(career, tags) {
  const reasons = [];
  if (career.tags.some((t) => tags[t])) reasons.push('Phù hợp sở thích/kỹ năng');
  if (career.category) reasons.push(`Nhóm ngành ${career.category}`);
  return reasons.slice(0, 3);
}

function hashCode(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export const offlineApi = {
  getMe(token) {
    if (!token || !token.startsWith('offline:')) return { success: false };
    const userId = Number(token.replace('offline:', ''));
    const user = getUsers().find((u) => u.id === userId);
    if (!user) return { success: false };
    return { success: true, data: { user_id: user.id, email: user.email, user_type: user.user_type } };
  },
  login({ email, password }) {
    const user = getUsers().find((u) => u.email === email && u.password === password);
    if (!user) return { success: false, error: 'Sai email hoặc mật khẩu' };
    const token = `offline:${user.id}`;
    return { success: true, data: { user_id: user.id, email: user.email, user_type: user.user_type, token } };
  },
  register({ email, password, user_type }) {
    const users = getUsers();
    if (users.find((u) => u.email === email)) {
      return { success: false, error: 'Email đã tồn tại' };
    }
    const nextId = Math.max(1, ...users.map((u) => u.id)) + 1;
    const user = { id: nextId, email, password, user_type: user_type || 'high_school' };
    users.push(user);
    saveUsers(users);
    const token = `offline:${user.id}`;
    return { success: true, data: { user_id: user.id, email: user.email, user_type: user.user_type, token } };
  },
  getProfile(userId) {
    const profiles = getProfiles();
    return { success: true, data: profiles[userId] || null };
  },
  updateProfile(userId, payload) {
    const profiles = getProfiles();
    profiles[userId] = { ...profiles[userId], ...payload };
    saveProfiles(profiles);
    return { success: true, data: { updated: true } };
  },
  sendMessage({ conversation_id, message, user_id, user_type, request_more }) {
    const convId = conversation_id || `conv_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    ensureConversation(convId, user_id || null, message);
    const messages = getMessages(convId);
    messages.push({ id: messages.length + 1, sender: 'user', message, created_at: new Date().toISOString() });
    saveMessages(convId, messages);

    const state = getState(convId);
    if (message) {
      state.answers.push(message);
      state.tags = { ...state.tags, ...deriveTags(message) };
    }
    const enoughInfo = state.answers.length >= 6;
    let response = null;
    let nextNode = null;
    let completed = false;

    if (enoughInfo && !request_more) {
      const recs = scoreCareers(state);
      saveRecommendations(convId, recs);
      response = 'Đây là gợi ý nghề nghiệp phù hợp:';
      completed = true;
      return {
        success: true,
        data: { bot_reply: response, recommendations: recs, next_node: null, completed, conversation_id: convId }
      };
    }

    const question = QUESTIONS[state.index % QUESTIONS.length];
    state.index += 1;
    saveState(convId, state);
    response = question.text;
    nextNode = question.id;
    messages.push({ id: messages.length + 1, sender: 'bot', message: response, created_at: new Date().toISOString() });
    saveMessages(convId, messages);
    return {
      success: true,
      data: { bot_reply: response, options: [], next_node: nextNode, completed: false, conversation_id: convId }
    };
  },
  getHistory(userId) {
    const convs = getConversations().filter((c) => !userId || c.user_id === userId);
    const data = convs.map((c) => {
      const messages = getMessages(c.conversation_id);
      return {
        conversation_id: c.conversation_id,
        title: c.title,
        created_at: c.created_at,
        updated_at: c.updated_at,
        message_count: messages.length
      };
    }).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    return { success: true, data };
  },
  getMessages(conversationId) {
    return { success: true, data: getMessages(conversationId) };
  },
  getRecommendations(conversationId) {
    return { success: true, data: getRecommendations(conversationId) };
  },
  renameConversation(conversationId, title) {
    updateConversationTitle(conversationId, title);
    return { success: true, data: { updated: true } };
  },
  deleteConversation(conversationId) {
    removeConversation(conversationId);
    return { success: true, data: { deleted: true } };
  },
  deleteHistory(userId) {
    clearHistoryForUser(userId);
    return { success: true, data: { deleted: true } };
  },
  exploreFilters() {
    const categories = Array.from(new Set(CAREERS.map((c) => c.category))).filter(Boolean);
    const tags = Array.from(new Set(CAREERS.flatMap((c) => c.tags))).filter(Boolean);
    return { success: true, data: { categories, tags } };
  },
  exploreJobs({ q, category, tag, limit = 24, offset = 0 }) {
    const query = String(q || '').toLowerCase();
    let list = CAREERS.map((c, idx) => ({
      id: idx + 1,
      title: c.name,
      category: c.category,
      tags: c.tags,
      image_url: 'career-icons/default.svg'
    }));
    if (query) {
      list = list.filter((j) => j.title.toLowerCase().includes(query));
    }
    if (category) {
      list = list.filter((j) => j.category === category);
    }
    if (tag) {
      list = list.filter((j) => j.tags.includes(tag));
    }
    const total = list.length;
    const slice = list.slice(offset, offset + limit);
    return { success: true, data: slice, total };
  }
};
