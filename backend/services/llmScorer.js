const https = require('https');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
const GROQ_BASE_URL = process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1';

const LLM_CHAT_URL = `${GROQ_BASE_URL.replace(/\/$/, '')}/chat/completions`;
const LLM_TIMEOUT_MS = Number(process.env.LLM_TIMEOUT_MS || 30000);

const SYSTEM_PROMPT = `Bạn là một trợ lý ảo AI thông minh, thân thiện và hữu ích.
Nhiệm vụ: Hỗ trợ người dùng trả lời câu hỏi, giải quyết vấn đề và trò chuyện một cách tự nhiên.
PHONG CÁCH: Ngắn gọn, súc tích, đi thẳng vào vấn đề. Mỗi tin nhắn tối đa 2-3 câu trừ khi được yêu cầu giải thích chi tiết.

BẮT BUỘC: Bạn phải luôn trả lời bằng định dạng JSON sau:
{
  "bot_reply": "Nội dung phản hồi của bạn",
  "suggested_questions": ["Câu hỏi gợi ý 1", "Câu hỏi gợi ý 2"]
}`;

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

function safeParseChatReply(content) {
  if (!content) return null;
  const text = String(content).trim();
  const candidates = [];

  const tryParseJson = (value) => {
    if (!value) return null;
    try {
      return JSON.parse(value);
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
    let bot = String(obj.bot_reply || '').trim();
    if (!bot) continue;

    // Nếu model trả về chuỗi template mặc định, bỏ qua đối tượng này
    if (bot.toLowerCase().includes('nội dung phản hồi')) continue;
    if (!Array.isArray(obj.suggested_questions)) {
      obj.suggested_questions = [];
    }
    return obj;
  }

  // Fallback: dùng raw text như phản hồi để tránh null
  if (text && !text.toLowerCase().includes('nội dung phản hồi')) {
    return { bot_reply: text, suggested_questions: [] };
  }

  return null;
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
  generateAgentChatReply
};
