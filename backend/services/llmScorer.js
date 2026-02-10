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
    'Bạn là chuyên gia hướng nghiệp thông minh.',
    'Dựa trên lịch sử hội thoại và hồ sơ, hãy đặt MỘT câu hỏi tiếp theo để hiểu rõ hơn về người dùng.',
    'Câu hỏi phải giúp thu hẹp các lựa chọn nghề nghiệp.',
    'Câu hỏi nên ngắn gọn, tự nhiên, thân thiện.',
    'Nếu đã đủ thông tin, hãy trả về chuỗi "DONE".',
    'Trả về JSON: {"question": "...", "options": ["Có", "Không", "Khác..."], "reasoning": "Tại sao đặt câu hỏi này"}'
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
    'Bạn là chuyên gia hướng nghiệp cấp cao.',
    'Hãy đề xuất top 5-10 nghề nghiệp phù hợp nhất dựa trên lịch sử hội thoại.',
    'KHÔNG giới hạn trong bất kỳ danh sách nào, hãy dùng kiến thức rộng lớn của bạn.',
    'Với mỗi nghề, cung cấp: tên nghề, match_score (0-100), xác suất (0-1), lý do cụ thể.',
    'Trả về JSON: {"recommendations": [{"career_name": "...", "match_score": 85, "probability": 0.4, "reasons": ["..."]}]}'
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

module.exports = {
  scoreCareersWithLLM,
  mergeScores,
  isEnabled,
  generateAgentQuestion,
  generateAgentRecommendations
};
