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

function countReplacementChars(value) {
  return (String(value || '').match(/\uFFFD/g) || []).length;
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
