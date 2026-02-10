const https = require('https');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'mistralai/mistral-nemo-12b-instruct';
const OPENAI_API_URL = process.env.OPENAI_API_URL || 'https://integrate.api.nvidia.com/v1/chat/completions';
const LLM_TIMEOUT_MS = Number(process.env.LLM_TIMEOUT_MS || 15000);
const LLM_ENABLED = process.env.LLM_RERANK === '1';

function isEnabled() {
  return Boolean(LLM_ENABLED && OPENAI_API_KEY);
}

async function scoreCareersWithLLM({ profile, answersText, candidates }) {
  if (!isEnabled()) return null;
  if (!Array.isArray(candidates) || candidates.length === 0) return null;

  const system = [
    'Bạn là chuyên gia hướng nghiệp.',
    'Dựa trên hồ sơ và câu trả lời, hãy chấm điểm xác suất phù hợp cho từng nghề.',
    'Điểm là số thực 0-100; 100 là phù hợp nhất.',
    'Tránh trùng điểm giữa các nghề (ưu tiên làm khác nhau).',
    'Giữ nguyên danh sách nghề, không thêm nghề mới.',
    'Trả về JSON hợp lệ theo định dạng: {"scores":[{"career_name":"...", "match_score": 0}]}'
  ].join(' ');

  const payload = {
    model: OPENAI_MODEL,
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      {
        role: 'user',
        content: JSON.stringify({
          profile: safeProfile(profile),
          answers: answersText || '',
          candidates
        })
      }
    ]
  };

  const data = await postJson(OPENAI_API_URL, payload, LLM_TIMEOUT_MS);
  const content = data?.choices?.[0]?.message?.content;
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
          const parsed = JSON.parse(raw);
          resolve(parsed);
        } catch (err) {
          reject(err);
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(timeoutMs, () => req.destroy(new Error('LLM timeout')));
    req.write(data);
    req.end();
  });
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

  const payload = {
    model: OPENAI_MODEL,
    temperature: 0.7,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      {
        role: 'user',
        content: JSON.stringify({ profile: safeProfile(profile), history })
      }
    ]
  };

  const data = await postJson(OPENAI_API_URL, payload, LLM_TIMEOUT_MS);
  const content = data?.choices?.[0]?.message?.content;
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

  const payload = {
    model: OPENAI_MODEL,
    temperature: 0.5,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      {
        role: 'user',
        content: JSON.stringify({ profile: safeProfile(profile), history })
      }
    ]
  };

  const data = await postJson(OPENAI_API_URL, payload, LLM_TIMEOUT_MS * 2);
  const content = data?.choices?.[0]?.message?.content;
  if (!content) return null;
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}
async function generateAgentChatReply({ profile, history, currentMessage }) {
  if (!isEnabled()) return null;

  const system = [
    'Bạn là chuyên gia tư vấn hướng nghiệp cao cấp.',
    'Nhiệm vụ: Phản hồi tin nhắn người dùng một cách chuyên nghiệp và hữu ích trong bối cảnh định hướng nghề nghiệp.',
    'Nếu người dùng hỏi về một khái niệm, hãy giải thích rõ ràng. Nếu người dùng chia sẻ về bản thân, hãy phân tích và dẫn dắt họ.',
    'Bối cảnh: Tư vấn cho đối tượng cụ thể dựa trên hồ sơ.',
    'Định dạng câu trả lời JSON:',
    '{',
    '  "bot_reply": "Nội dung phản hồi chi tiết cho người dùng",',
    '  "suggested_questions": ["Câu hỏi gợi ý 1", "Câu hỏi gợi ý 2"],',
    '  "is_recommendation_ready": false',
    '}'
  ].join(' ');

  const payload = {
    model: OPENAI_MODEL,
    temperature: 0.6,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      {
        role: 'user',
        content: JSON.stringify({
          profile: safeProfile(profile),
          history,
          current_message: currentMessage
        })
      }
    ]
  };

  const data = await postJson(OPENAI_API_URL, payload, LLM_TIMEOUT_MS);
  const content = data?.choices?.[0]?.message?.content;
  if (!content) return null;
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}


module.exports = {
  scoreCareersWithLLM,
  mergeScores,
  isEnabled,
  generateAgentQuestion,
  generateAgentRecommendations,
  generateAgentChatReply
};
