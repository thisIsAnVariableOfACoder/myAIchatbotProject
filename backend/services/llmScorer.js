const https = require('https');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'nvidia/mistral-nemo-minitron-8b-base';
// Use the completions endpoint as per user's snippet
const rawUrl = process.env.OPENAI_API_URL || 'https://integrate.api.nvidia.com/v1/chat/completions';
const OPENAI_API_URL = rawUrl.replace('/chat/completions', '/completions');
const LLM_TIMEOUT_MS = Number(process.env.LLM_TIMEOUT_MS || 30000);
const LLM_ENABLED = process.env.LLM_RERANK === '1';

const SYSTEM_PROMPT = `Bạn là chuyên gia tư vấn hướng nghiệp cao cấp. 
Nhiệm vụ: Hỗ trợ người dùng tìm nghề nghiệp phù hợp dựa trên năng lực và sở thích.
QUY TẮC BỘ NHỚ: 
1. TUYỆT ĐỐI KHÔNG hỏi lại những gì người dùng đã trả lời hoặc từ chối (xem lịch sử).
2. Nếu người dùng bảo "không giỏi" hoặc "không thích" điều gì, hãy ghi nhớ và chuyển sang chủ đề khác.
3. Luôn thấu hiểu bối cảnh và dẫn dắt câu chuyện tự nhiên, không máy móc.
PHONG CÁCH: Ngắn gọn, súc tích, đi thẳng vào vấn đề, không rườm rà. Mỗi tin nhắn tối đa 2-3 câu.`;

function isEnabled() {
  return Boolean(LLM_ENABLED && OPENAI_API_KEY);
}

async function scoreCareersWithLLM({ profile, answersText, candidates }) {
  if (!isEnabled()) return null;
  if (!Array.isArray(candidates) || candidates.length === 0) return null;

  const prompt = [
    `System: ${SYSTEM_PROMPT}`,
    `User: ${JSON.stringify({
      profile: safeProfile(profile),
      answers: answersText || '',
      candidates
    })}`,
    'Assistant: '
  ].join('\n\n');

  const payload = {
    model: OPENAI_MODEL,
    temperature: 0.2,
    top_p: 0.95,
    max_tokens: 500,
    stream: false,
    prompt: prompt
  };

  const data = await postJson(OPENAI_API_URL, payload, LLM_TIMEOUT_MS);
  const content = data?.choices?.[0]?.text;
  if (!content) return null;
  try {
    const json = JSON.parse(content);
    if (!Array.isArray(json?.scores)) return null;
    return json.scores
      .map((item) => ({
        career_name: String(item.career_name || '').trim(),
        match_score: clampScore(item.match_score)
      }))
      .filter((item) => item.career_name);
  } catch {
    return null;
  }
}

function mergeScores(base, llmScores) {
  if (!Array.isArray(base) || base.length === 0) return base;
  if (!Array.isArray(llmScores) || llmScores.length === 0) return base;
  const map = new Map();
  for (const item of llmScores) {
    if (!item.career_name) continue;
    map.set(item.career_name, clampScore(item.match_score));
  }

  let merged = base.map((item) => {
    const score = map.has(item.career_name)
      ? map.get(item.career_name)
      : Number(item.match_score || 0);
    return {
      ...item,
      match_score: score,
      confidence: score >= 70 ? 'high' : score >= 50 ? 'medium' : 'low'
    };
  });

  // Sort by new score
  merged = merged.sort((a, b) => b.match_score - a.match_score);

  // Recalculate probabilities (Softmax-like or simple normalization)
  const topK = merged.slice(0, 10);
  const maxScore = topK[0]?.match_score || 0;
  const expScores = topK.map(item => ({
    ...item,
    exp: Math.exp((item.match_score - maxScore) / 10) // Temperature = 10 for AI scores
  }));
  const sumExp = expScores.reduce((sum, item) => sum + item.exp, 0);

  const final = expScores.map(item => {
    const { exp, ...rest } = item;
    return {
      ...rest,
      probability: sumExp > 0 ? exp / sumExp : 1 / topK.length
    };
  });

  return ensureUniqueScores(final);
}

function safeProfile(profile) {
  if (!profile) return {};
  const { skills, interests, education_level, current_grade, work_experience_years, preferred_work_style } = profile;
  return { skills, interests, education_level, current_grade, work_experience_years, preferred_work_style };
}

function clampScore(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return 0;
  const rounded = Math.round(num * 10) / 10;
  return Math.min(100, Math.max(0, rounded));
}

function ensureUniqueScores(list) {
  if (!Array.isArray(list)) return list;
  const out = list.map((item) => ({ ...item }));
  for (let i = 1; i < out.length; i += 1) {
    if (out[i].match_score >= out[i - 1].match_score) {
      out[i].match_score = Math.max(0, out[i - 1].match_score - 0.4);
    }
  }
  return out;
}

function postJson(url, payload, timeoutMs) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    // console.log(`[LLM Request] URL: ${url}`);
    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        Authorization: `Bearer ${OPENAI_API_KEY}`
      }
    }, (res) => {
      let raw = '';
      res.on('data', (chunk) => { raw += chunk; });
      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            console.error(`[LLM Error] Status: ${res.statusCode}, Body: ${raw}`);
            return resolve(null);
          }
          const parsed = JSON.parse(raw);
          resolve(parsed);
        } catch (err) {
          console.error(`[LLM Parse Error] Body: ${raw}`);
          resolve(null);
        }
      });
    });
    req.on('error', (e) => {
      console.error(`[LLM Request Error]: ${e.message}`);
      resolve(null);
    });
    req.setTimeout(timeoutMs, () => {
      console.error(`[LLM Timeout] after ${timeoutMs}ms`);
      req.destroy();
      resolve(null);
    });
    req.write(data);
    req.end();
  });
}

/**
 * Safely parse chat reply JSON from LLM output.
 * Handles cases where model trả về thêm text ngoài JSON,
 * hoặc chỉ lặp lại template "Câu trả lời & Câu hỏi MỚI hoàn toàn".
 */
function safeParseChatReply(content) {
  if (!content) return null;
  const text = String(content).trim();
  const candidates = [];

  // 1. Thử parse trực tiếp
  try {
    candidates.push(JSON.parse(text));
  } catch {
    // ignore
  }

  // 2. Thử trích JSON đầu tiên trong chuỗi
  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      candidates.push(JSON.parse(match[0]));
    } catch {
      // ignore
    }
  }

  for (const obj of candidates) {
    if (!obj || typeof obj !== 'object') continue;

    let bot = String(obj.bot_reply || '').trim();

    // Bỏ qua nếu bot_reply chỉ là template mặc định
    if (!bot ||
      bot === 'Câu trả lời & Câu hỏi MỚI hoàn toàn' ||
      bot.toLowerCase() === 'câu trả lời & câu hỏi mới hoàn toàn') {
      continue;
    }

    obj.bot_reply = bot;
    if (!Array.isArray(obj.suggested_questions)) {
      obj.suggested_questions = [];
    }
    obj.is_recommendation_ready = Boolean(obj.is_recommendation_ready);
    return obj;
  }

  return null;
}

async function generateAgentQuestion({ profile, history }) {
  if (!isEnabled()) return null;

  const system = [
    'Bạn là chuyên gia tư vấn hướng nghiệp cao cấp.',
    'Nhiệm vụ: Phân tích sâu Profile người dùng và Lịch sử hội thoại để đưa ra lời dẫn dắt và câu hỏi tiếp theo.',
    'Bối cảnh: Bạn đang tư vấn cho đối tượng cụ thể (Học sinh/Sinh viên/Người đi làm) dựa trên thông tin hồ sơ được cung cấp.',
    'Hãy thể hiện sự thấu hiểu về các kỹ năng, sở thích và trình độ học vấn trong hồ sơ.',
    'Định dạng câu trả lời JSON:',
    '{',
    '  "bot_message": "Lời dẫn dắt thân thiện, phản hồi lại ý của người dùng hoặc nhận xét về hồ sơ của họ",',
    '  "question": "Câu hỏi tiếp theo sắc sảo để khai thác sâu hơn (hoặc DONE nếu đã đủ dữ liệu)",',
    '  "options": ["Gợi ý 1", "Gợi ý 2"],',
    '  "reasoning": "Phân tích nội bộ về lý do đưa ra phản hồi này"',
    '}'
  ].join(' ');

  const chatHistory = history.map(h => `Assistant: ${h.q}\nUser: ${h.a}`).join('\n');
  const prompt = [
    `System: ${system}`,
    `Profile: ${JSON.stringify(safeProfile(profile))}`,
    chatHistory,
    'Assistant: '
  ].join('\n\n');

  const payload = {
    model: OPENAI_MODEL,
    temperature: 0.7,
    top_p: 0.95,
    max_tokens: 400,
    stream: false,
    prompt: prompt
  };

  const data = await postJson(OPENAI_API_URL, payload, LLM_TIMEOUT_MS);
  const content = data?.choices?.[0]?.text;
  if (!content) return null;
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}

async function generateAgentRecommendations({ profile, history }) {
  if (!isEnabled()) return null;

  const system = [
    'Bạn là chuyên gia định hướng nghề nghiệp hàng đầu.',
    'Nhiệm vụ: Tổng hợp toàn bộ dữ liệu từ hồ sơ và các câu trả lời để đưa ra bản tư vấn cuối cùng.',
    'Hãy chào mừng người dùng bằng một lời tổng kết ấn tượng về thế mạnh của họ dựa trên bối cảnh đối tượng (Học sinh/Sinh viên/Người đi làm).',
    'Đề xuất 5-10 nghề nghiệp mang tính chiến lược.',
    'Trả về JSON:',
    '{',
    '  "bot_intro": "Lời tổng kết sâu sắc về Profile và lộ trình tương lai của người dùng",',
    '  "recommendations": [',
    '    {',
    '      "career_name": "...",',
    '      "match_score": 95,',
    '      "probability": 0.35,',
    '      "reasons": ["Lý do cụ thể trích dẫn từ Profile hoặc câu trả lời"]',
    '    }',
    '  ]',
    '}'
  ].join(' ');

  const chatHistory = history.map(h => `Assistant: ${h.q}\nUser: ${h.a}`).join('\n');
  const prompt = [
    `System: ${system}`,
    `Profile: ${JSON.stringify(safeProfile(profile))}`,
    chatHistory,
    'Assistant: '
  ].join('\n\n');

  const payload = {
    model: OPENAI_MODEL,
    temperature: 0.5,
    top_p: 0.95,
    max_tokens: 1500,
    stream: false,
    prompt: prompt
  };

  const data = await postJson(OPENAI_API_URL, payload, LLM_TIMEOUT_MS * 2);
  const content = data?.choices?.[0]?.text;
  if (!content) return null;
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}
async function generateAgentChatReply({ profile, history, currentMessage }) {
  if (!isEnabled()) return null;

  const isFirstTurn = !history || history.length === 0;
  const starterContexts = [
    "Hãy bắt đầu bằng cách tìm hiểu về niềm đam mê lớn nhất của họ trong cuộc sống.",
    "Hãy bắt đầu bằng cách hỏi về một môn học hoặc kỹ năng họ tự tin nhất.",
    "Hãy bắt đầu bằng cách hỏi về môi trường làm việc mơ ước của họ (văn phòng hay ngoài trời).",
    "Hãy bắt đầu bằng cách hỏi về một thần tượng hoặc người truyền cảm hứng nghề nghiệp cho họ."
  ];
  const selectedStarter = isFirstTurn ? starterContexts[Date.now() % starterContexts.length] : "";

  const chatHistory = history.map(h => `Assistant: ${h.q}\nUser: ${h.a}`).join('\n');
  const pastQuestions = history.map(h => h.q).join(' | ');

  const system = [
    'Bạn là chuyên gia tư vấn hướng nghiệp cao cấp.',
    'Nhiệm vụ: Phản hồi tin nhắn người dùng cực kỳ ngắn gọn (tối đa 2 câu).',
    'QUY TẮC BẮT BUỘC: KHÔNG hỏi lại bất kỳ câu nào trong danh sách ĐÃ HỎI sau đây:',
    `[ĐÃ HỎI: ${pastQuestions}]`,
    'Nếu người dùng đã chia sẻ ít nhất 3-4 ý về sở thích/kỹ năng, hãy đặt "is_recommendation_ready": true.',
    'ƯU TIÊN: Khi hội thoại đã có khoảng 6-8 lượt trao đổi và bạn đã nắm tương đối rõ sở thích/kỹ năng, hãy mạnh dạn đặt "is_recommendation_ready": true để không kéo dài thêm câu hỏi.',
    selectedStarter,
    'Định dạng câu trả lời JSON:',
    '{',
    '  "bot_reply": "Câu trả lời & Câu hỏi MỚI hoàn toàn",',
    '  "suggested_questions": ["Gợi ý 1", "Gợi ý 2"],',
    '  "is_recommendation_ready": false',
  ].join(' ');

  const prompt = [
    `System: ${system}`,
    `Profile: ${JSON.stringify(safeProfile(profile))}`,
    chatHistory,
    `User: ${currentMessage}`,
    'Assistant: Hãy trả lời bằng tiếng Việt, dưới dạng JSON:',
    'Assistant: '
  ].join('\n\n');

  const payload = {
    model: OPENAI_MODEL,
    temperature: 0.6,
    top_p: 0.95,
    // Giảm max_tokens nhẹ để phản hồi nhanh hơn
    max_tokens: 220,
    stream: false,
    prompt: prompt,
    stop: ["User:", "Assistant:"]
  };

  const data = await postJson(OPENAI_API_URL, payload, LLM_TIMEOUT_MS);
  const content = data?.choices?.[0]?.text;
  if (!content) return null;

  const parsed = safeParseChatReply(content);
  if (parsed) return parsed;

  // Fallback an toàn nếu JSON không parse được hoặc chỉ là template
  const safeReply = 'Mình đã hiểu thêm về bạn. Bạn có thể chia sẻ thêm một hoạt động, dự án hoặc trải nghiệm mà bạn thấy tự hào nhất không?';
  return {
    bot_reply: safeReply,
    suggested_questions: [],
    is_recommendation_ready: false
  };
}


module.exports = {
  scoreCareersWithLLM,
  mergeScores,
  isEnabled,
  generateAgentQuestion,
  generateAgentRecommendations,
  generateAgentChatReply
};
