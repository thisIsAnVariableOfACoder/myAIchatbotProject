const https = require('https');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
const GROQ_BASE_URL = process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1';

const LLM_CHAT_URL = `${GROQ_BASE_URL.replace(/\/$/, '')}/chat/completions`;
const LLM_TIMEOUT_MS = Number(process.env.LLM_TIMEOUT_MS || 30000);

const SYSTEM_PROMPT = `Bạn là AI tư vấn HƯỚNG NGHIỆP.
Mục tiêu DUY NHẤT: thu thập thông tin cần thiết và tư vấn nghề nghiệp phù hợp theo nhóm người dùng (học sinh/sinh viên/người đi làm).
Bạn phải chủ động đặt câu hỏi tiếp theo để hiểu người dùng.
KHÔNG làm các việc ngoài hướng nghiệp (không giải toán, không viết code, không tư vấn ngoài lề). Nếu người dùng hỏi ngoài phạm vi, hãy lịch sự kéo về mục tiêu hướng nghiệp.
PHONG CÁCH: Ngắn gọn, súc tích, đi thẳng vào vấn đề.

BẮT BUỘC: Bạn phải luôn trả lời bằng định dạng JSON sau:
{
  "bot_reply": "Nội dung phản hồi của bạn",
  "suggested_questions": ["Câu hỏi gợi ý 1", "Câu hỏi gợi ý 2"]
}`;

function countReplacementChars(value) {
  return (String(value || '').match(/\uFFFD/g) || []).length;
}

async function generateCareerQuestion({ userType, profile, memoryAnswers, intent }) {
  if (!isEnabled()) {
    return null;
  }

  const safeUserType = String(userType || 'high_school');
  const profileText = profile ? JSON.stringify(profile) : '';
  const memoryText = Array.isArray(memoryAnswers)
    ? memoryAnswers.slice(-8).map((a) => ({ q: a?.question || a?.q, a: a?.answer || a?.a })).filter((x) => x.q || x.a)
    : [];

  const systemPrompt = `Bạn là chuyên gia tư vấn hướng nghiệp.
Nhiệm vụ: tạo 1 câu hỏi TIẾP THEO phù hợp với nhóm người dùng và bối cảnh hiện tại.

Ràng buộc:
- Chỉ hỏi 1 câu, rõ ràng, dễ trả lời.
- Phù hợp nhóm:
  - high_school: hỏi về môn học/hoạt động, sở thích, năng lực, môi trường học tập.
  - university: hỏi về ngành/năm học, dự án/CLB/thực tập, kỹ năng, định hướng.
  - professional: hỏi về kinh nghiệm, chuyên môn, kỹ năng, mục tiêu chuyển nghề/thăng tiến.
- Tránh hỏi sai ngữ cảnh (ví dụ hỏi KPI/công ty với học sinh).
- Không nhắc tới "database", "template", "trọng số".

BẮT BUỘC: trả về JSON đúng cấu trúc:
{
  "bot_reply": "<câu hỏi tiếp theo>",
  "suggested_questions": ["<option 1>", "<option 2>"]
}
Nếu câu hỏi dạng tự do thì suggested_questions = [].`;

  const userContent = `userType: ${safeUserType}
profile: ${profileText}
memory: ${JSON.stringify(memoryText)}
intent: ${JSON.stringify(intent || {})}

Hãy tạo câu hỏi tiếp theo bằng tiếng Việt, xưng hô lịch sự, ngắn gọn.`;

  const payload = {
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent }
    ],
    temperature: 0.6,
    top_p: 0.9,
    max_tokens: 512,
    stream: false
  };

  const data = await postJson(LLM_CHAT_URL, payload, LLM_TIMEOUT_MS);
  const content = data?.choices?.[0]?.message?.content;
  const parsed = safeParseChatReply(content);
  if (!parsed) return null;

  // safeParseChatReply expects {bot_reply, suggested_questions}
  const question = normalizeReplyText(parsed.bot_reply);
  const options = normalizeSuggestedQuestions(parsed.suggested_questions);
  if (!question) return null;
  return { question, options };
}

function fixCommonMojibake(value) {
  const text = String(value || '');
  if (!text) return '';

  // Heuristic: common UTF-8 -> Latin-1 mojibake prefixes.
  if (!/[ÃÂâ]/.test(text)) return text;

  try {
    const repaired = Buffer.from(text, 'latin1').toString('utf8');
    if (!repaired || repaired === text) return text;
    if (countReplacementChars(repaired) <= countReplacementChars(text)) {
      return repaired;
    }
  } catch {
    // Ignore and keep original text.
  }

  return text;
}

function decodeEscapedText(value) {
  return String(value || '')
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
}

function normalizeReplyText(value) {
  let text = String(value || '').replace(/\uFEFF/g, '').trim();
  if (!text) return '';

  text = decodeEscapedText(text);
  text = fixCommonMojibake(text);

  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
    text = text.slice(1, -1).trim();
  }

  return text.replace(/\u0000/g, '').trim();
}

function normalizeSuggestedQuestions(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => normalizeReplyText(item))
    .filter(Boolean)
    .slice(0, 5);
}

function isEnabled() {
  return Boolean(GROQ_API_KEY);
}

async function generateAgentChatReply({ history, currentMessage }) {
  if (!isEnabled()) {
    console.error('[LLM] Disabled - No HF_TOKEN');
    return null;
  }

  // Ensure we don't have consecutive user messages
  const historyMessages = (history || []).map(h => ([
    { role: 'assistant', content: JSON.stringify({ bot_reply: h.q, suggested_questions: [] }) },
    { role: 'user', content: h.a }
  ])).flat();

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...historyMessages,
    { role: 'user', content: `${currentMessage || 'Xin chào'}\n(BẮT BUỘC: Trả lời bằng tiếng Việt và giữ định dạng JSON)` }
  ];

  const payload = {
    model: GROQ_MODEL,
    messages: messages,
    temperature: 0.7,
    top_p: 0.9,
    max_tokens: 1024,
    stream: false
  };

  console.log('[LLM Request] URL:', LLM_CHAT_URL);
  console.log('[LLM Request] Payload:', JSON.stringify(payload, null, 2));

  const data = await postJson(LLM_CHAT_URL, payload, LLM_TIMEOUT_MS);
  console.log('[LLM Response] Raw Data:', JSON.stringify(data, null, 2));

  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    console.error('[LLM] No content in response');
    return null;
  }

  const parsed = safeParseChatReply(content);
  console.log('[LLM] Parsed Result:', JSON.stringify(parsed, null, 2));
  return parsed;
}


function postJson(url, payload, timeoutMs) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        Authorization: `Bearer ${GROQ_API_KEY}`
      }
    }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      });
      res.on('end', () => {
        const raw = Buffer.concat(chunks).toString('utf8');
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

function safeParseChatReply(content) {
  if (!content) return null;
  const text = String(content).replace(/\uFEFF/g, '').trim();
  const candidates = [];

  const tryParseJson = (value) => {
    if (!value) return null;
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed === 'string') {
        try {
          return JSON.parse(parsed);
        } catch {
          return parsed;
        }
      }
      return parsed;
    } catch {
      return null;
    }
  };

  const extractFromFence = (value) => {
    const fence = value.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (!fence) return null;
    return tryParseJson(fence[1].trim());
  };

  const extractFirstJsonObject = (value) => {
    let start = -1;
    let depth = 0;
    for (let i = 0; i < value.length; i += 1) {
      const ch = value[i];
      if (ch === '{') {
        if (depth === 0) start = i;
        depth += 1;
      } else if (ch === '}') {
        if (depth > 0) depth -= 1;
        if (depth === 0 && start !== -1) {
          const slice = value.slice(start, i + 1);
          const parsed = tryParseJson(slice);
          if (parsed) return parsed;
          start = -1;
        }
      }
    }
    return null;
  };

  const parsedFull = tryParseJson(text);
  if (parsedFull) candidates.push(parsedFull);

  const parsedFence = extractFromFence(text);
  if (parsedFence) candidates.push(parsedFence);

  const parsedObject = extractFirstJsonObject(text);
  if (parsedObject) candidates.push(parsedObject);

  for (const obj of candidates) {
    if (!obj || typeof obj !== 'object') continue;
    let bot = normalizeReplyText(obj.bot_reply);
    if (!bot) continue;

    // Nếu model trả về chuỗi template mặc định, bỏ qua đối tượng này
    if (bot.toLowerCase().includes('nội dung phản hồi')) continue;
    return {
      bot_reply: bot,
      suggested_questions: normalizeSuggestedQuestions(obj.suggested_questions)
    };
  }

  // Fallback: dùng raw text như phản hồi để tránh null
  const normalizedText = normalizeReplyText(text);
  if (normalizedText && !normalizedText.toLowerCase().includes('nội dung phản hồi')) {
    return { bot_reply: normalizedText, suggested_questions: [] };
  }

  return null;
}

/**
 * Generate career recommendations with scores (0-100) based on user answers
 * This is the main function for AI-powered career counseling
 */
async function generateCareerRecommendations({ userType, profile, memoryAnswers }) {
  if (!isEnabled()) {
    return null;
  }

  const safeUserType = String(userType || 'high_school');
  const profileText = profile ? JSON.stringify(profile) : '';
  const memoryText = Array.isArray(memoryAnswers)
    ? memoryAnswers.map((a) => ({ q: a?.question || a?.q, a: a?.answer || a?.a })).filter((x) => x.q || x.a)
    : [];

  const systemPrompt = `Bạn là chuyên gia tư vấn hướng nghiệp với 30 năm kinh nghiệm.
Nhiệm vụ: Phân tích thông tin người dùng và đưa ra gợi ý nghề nghiệp phù hợp nhất.

YÊU CẦU:
1. Phân tích kỹ lưỡng tất cả câu trả lời của người dùng
2. Tính toán độ phù hợp của từng nghề nghiệp trên thang điểm 0-100
3. Chỉ chọn ra 6-10 nghề phù hợp nhất (không dưới 6, không quá 10)
4. Sắp xếp theo thứ tự giảm dần theo điểm phù hợp

QUY TẮC TÍNH ĐIỂM (0-100):
- 90-100: Rất phù hợp - khớp hoàn toàn với sở thích, kỹ năng, định hướng
- 75-89: Phù hợp - khớp tốt với nhiều yếu tố
- 60-74: Khá phù hợp - có tiềm năng nhưng cần phát triển thêm
- Dưới 60: Không nên đưa vào danh sách

BẮT BUỘC: Trả về JSON đúng cấu trúc:
{
  "recommendations": [
    {
      "career_name": "Tên nghề nghiệp (tiếng Việt)",
      "match_score": 85,
      "reasons": ["Lý do 1", "Lý do 2", "Lý do 3"]
    }
  ],
  "summary": "Tóm tắt ngắn gọn về phân tích"
}

Lưu ý:
- career_name: Tên nghề nghiệp đầy đủ, chính xác
- match_score: Số nguyên từ 0-100
- reasons: 3 lý do ngắn gọn (mỗi lý do tối đa 15 từ)
- summary: Tóm tắt 1-2 câu về định hướng nghề nghiệp của người dùng`;

  const userContent = `userType: ${safeUserType}
profile: ${profileText}
conversation_history: ${JSON.stringify(memoryText)}

Hãy phân tích và đưa ra gợi ý nghề nghiệp phù hợp nhất.`;

  const payload = {
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent }
    ],
    temperature: 0.5,
    top_p: 0.9,
    max_tokens: 2048,
    stream: false
  };

  const data = await postJson(LLM_CHAT_URL, payload, LLM_TIMEOUT_MS);
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    console.error('[LLM] No content in recommendation response');
    return null;
  }

  const parsed = safeParseRecommendations(content);
  console.log('[LLM] Career Recommendations:', JSON.stringify(parsed, null, 2));
  return parsed;
}

/**
 * Parse AI response for career recommendations
 */
function safeParseRecommendations(content) {
  if (!content) return null;
  const text = String(content).replace(/\uFEFF/g, '').trim();

  const tryParseJson = (value) => {
    if (!value) return null;
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed === 'string') {
        try {
          return JSON.parse(parsed);
        } catch {
          return parsed;
        }
      }
      return parsed;
    } catch {
      return null;
    }
  };

  const extractFromFence = (value) => {
    const fence = value.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (!fence) return null;
    return tryParseJson(fence[1].trim());
  };

  const extractFirstJsonObject = (value) => {
    let start = -1;
    let depth = 0;
    for (let i = 0; i < value.length; i += 1) {
      const ch = value[i];
      if (ch === '{') {
        if (depth === 0) start = i;
        depth += 1;
      } else if (ch === '}') {
        if (depth > 0) depth -= 1;
        if (depth === 0 && start !== -1) {
          const slice = value.slice(start, i + 1);
          const parsed = tryParseJson(slice);
          if (parsed) return parsed;
          start = -1;
        }
      }
    }
    return null;
  };

  // Try different parsing methods
  let parsed = tryParseJson(text);
  if (!parsed) parsed = extractFromFence(text);
  if (!parsed) parsed = extractFirstJsonObject(text);

  if (!parsed || !parsed.recommendations || !Array.isArray(parsed.recommendations)) {
    console.error('[LLM] Invalid recommendations format');
    return null;
  }

  // Validate and sanitize recommendations
  const recommendations = parsed.recommendations
    .filter(r => r.career_name && typeof r.match_score === 'number')
    .map(r => ({
      career_name: normalizeReplyText(r.career_name),
      match_score: Math.max(0, Math.min(100, Math.round(r.match_score))),
      probability: r.match_score / 100,
      confidence: r.match_score >= 75 ? 'high' : r.match_score >= 60 ? 'medium' : 'low',
      reasons: Array.isArray(r.reasons) ? r.reasons.slice(0, 3).map(normalizeReplyText) : []
    }))
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 10);

  // Ensure at least 6 recommendations
  if (recommendations.length < 6) {
    console.warn('[LLM] Less than 6 recommendations generated');
  }

  return {
    recommendations,
    summary: normalizeReplyText(parsed.summary) || 'Phân tích hoàn tất'
  };
}

async function generateAgentQuestion() {
  return null;
}

async function generateAgentRecommendations() {
  return null;
}

module.exports = {
  isEnabled,
  generateAgentQuestion,
  generateAgentRecommendations,
  generateAgentChatReply,
  generateCareerQuestion,
  generateCareerRecommendations
};
