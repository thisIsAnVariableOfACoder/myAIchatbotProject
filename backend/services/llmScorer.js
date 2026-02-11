const https = require('https');

// ============================================================================
// VALIDATION LAYER - Prevent inappropriate questions for each user type
// ============================================================================

// Forbidden keywords for each user type (questions containing these will be rejected)
const FORBIDDEN_KEYWORDS = {
  professional: [
    'môn học', 'điểm số', 'năm học', 'trường học', 'giáo viên', 'bạn bè học đường',
    'CLB học sinh', 'hoạt động ngoại khóa học đường', 'sở thích tại trường', 'ngoại khóa',
    'thời khóa biểu', 'lớp học', 'thi cử', 'bài tập', 'đề thi', 'ngành học', 'khoa',
    'trường đại học', 'trường cấp 3', 'THPT', 'trung học', 'sinh viên', 'học sinh',
    'người học', 'người đi học', 'tại trường', 'trong trường', 'môn', 'điểm', 'lớp',
    'thi', 'bài', 'đề', 'học kỳ', 'năm học'
  ],
  high_school: [
    'kinh nghiệm làm việc', 'công ty', 'doanh nghiệp', 'lương', 'thu nhập', 'KPI',
    'doanh số', 'quản lý nhân sự', 'thăng tiến', 'dự án kinh doanh', 'khởi nghiệp',
    'nhân viên', 'sếp', 'công việc hiện tại', 'vị trí quản lý', 'chuyên môn',
    'kỹ năng chuyên sâu', 'chuyển nghề', 'thâm niên'
  ],
  university: [
    'kinh nghiệm làm việc dài hạn', 'quản lý nhân sự', 'KPI công ty',
    'vị trí quản lý', 'lương cao', 'dự án kinh doanh quy mô lớn',
    'quản lý', 'giám đốc', 'trưởng phòng', 'CEO', 'CTO'
  ]
};

// Safe fallback questions for each user type (used when LLM generates invalid question)
const FALLBACK_QUESTIONS = {
  professional: [
    "Bạn đang làm việc ở vị trí nào và trong lĩnh vực gì?",
    "Bạn có bao nhiêu năm kinh nghiệm làm việc?",
    "Bạn có muốn chuyển sang lĩnh vực khác không?",
    "Điều gì khiến bạn muốn thay đổi công việc hiện tại?",
    "Bạn có kỹ năng chuyên môn nào muốn phát triển thêm không?",
    "Bạn thích làm việc trong môi trường như thế nào (remote, văn phòng, hybrid)?",
    "Mức lương mong muốn của bạn là bao nhiêu?",
    "Bạn có quan tâm đến các ngành nghề nào không?",
    "Bạn cảm thấy mình có điểm mạnh nào trong công việc hiện tại?",
    "Bạn có muốn thăng tiến lên vị trí cao hơn không?"
  ],
  high_school: [
    "Bạn thích môn học nào nhất tại trường?",
    "Bạn có tham gia CLB hay hoạt động nào không?",
    "Bạn cảm thấy mình có điểm mạnh nào trong học tập?",
    "Bạn có quan tâm đến ngành nghề nào không?",
    "Bạn muốn học trường đại học nào?",
    "Bạn có sở thích cá nhân nào không?",
    "Bạn cảm thấy mình có năng lực đặc biệt nào không?",
    "Bạn thích làm việc nhóm hay làm việc độc lập?",
    "Bạn có quan tâm đến công nghệ không?",
    "Bạn muốn làm việc trong lĩnh vực nào?"
  ],
  university: [
    "Bạn đang học ngành gì và năm học mấy?",
    "Bạn có làm dự án nào liên quan đến ngành học không?",
    "Bạn có tham gia thực tập hay làm thêm không?",
    "Bạn có kỹ năng nào đang phát triển không?",
    "Bạn có chứng chỉ nào không?",
    "Bạn muốn làm việc trong lĩnh vực nào sau khi ra trường?",
    "Bạn có quan tâm đến các công ty nào không?",
    "Bạn thích làm việc trong môi trường như thế nào?",
    "Bạn có muốn học thêm không?",
    "Bạn có quan tâm đến nghiên cứu không?"
  ]
};

// Validate if a question is appropriate for the user type
function validateQuestion(userType, question) {
  const safeUserType = String(userType || 'high_school');
  const forbidden = FORBIDDEN_KEYWORDS[safeUserType] || [];
  const questionLower = question.toLowerCase();

  // Check if question contains any forbidden keywords
  for (const keyword of forbidden) {
    if (questionLower.includes(keyword.toLowerCase())) {
      console.log(`[VALIDATION FAILED] userType: ${safeUserType}, forbidden keyword: "${keyword}", question: "${question}"`);
      return false;
    }
  }

  console.log(`[VALIDATION PASSED] userType: ${safeUserType}, question: "${question}"`);
  return true;
}

// Get a safe fallback question for the user type
function getFallbackQuestion(userType) {
  const safeUserType = String(userType || 'high_school');
  const fallbacks = FALLBACK_QUESTIONS[safeUserType] || FALLBACK_QUESTIONS.high_school;
  // Pick a random fallback question
  const randomIndex = Math.floor(Math.random() * fallbacks.length);
  return fallbacks[randomIndex];
}

// ============================================================================
// LLM CONFIGURATION
// ============================================================================

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

  console.log('[LLM DEBUG] generateCareerQuestion - userType:', safeUserType);
  console.log('[LLM DEBUG] generateCareerQuestion - profile:', profileText);
  console.log('[LLM DEBUG] generateCareerQuestion - memory:', JSON.stringify(memoryText));

  const systemPrompt = `🚨🚨🚨 CẢNH BÁO QUAN TRỌNG - PHẢI TUÂN THỦ TUYỆT ĐỐI 🚨🚨🚨

BẠN LÀ CHUYÊN GIA TƯ VẤN HƯỚNG NGHIỆP VỚI NHIỀU NĂM KINH NGHIỆM.
NHIỆM VỤ: tạo 1 câu hỏi TIẾP THEO phù hợp với nhóm người dùng và bối cảnh hiện tại.

🔴 QUY TẮC SỐNG CÒN: Nếu userType = "professional", TUYỆT ĐỐI KHÔNG HỎI BẤT CỨ CÂU NÀO VỀ:
- MÔN HỌC, ĐIỂM SỐ, NĂM HỌC, TRƯỜNG HỌC
- CLB HỌC SINH, HOẠT ĐỘNG NGOẠI KHÓA HỌC ĐƯỜNG
- GIÁO VIÊN, BẠN BÈ HỌC ĐƯỜNG
- SỞ THÍCH TẠI TRƯỜNG, THỜI KHÓA BIỂU

🔴 NẾU BẠN HỎI SAI - NGƯỜI DÙNG SẼ BỎ HỜNG ỨNG DỤNG!

⚠️ RÀNG BUỘC CỐT LÕI - PHẢI TUÂN THỦ:
1. Chỉ hỏi 1 câu, rõ ràng, dễ trả lời.
2. PHẢI phù hợp CHÍNH XÁC với nhóm người dùng.
3. TRƯỚC KHI TẠO CÂU HỎI, KIỂM TRA userType và TUYỆT ĐỐI KHÔNG hỏi các chủ đề CẤM.

═══════════════════════════════════════════════════════════════
NHÓM HIGH_SCHOOL (Học sinh THPT):
═══════════════════════════════════════════════════════════════
✅ CÓ THỂ HỎI:
- Môn học yêu thích, điểm mạnh/điểm yếu học tập
- Hoạt động ngoại khóa, CLB, sở thích cá nhân
- Năng lực đặc biệt, tài năng
- Môi trường học tập mong muốn (trường đại học, ngành nghề)
- Mối quan tâm về nghề nghiệp tương lai

❌ KHÔNG HỎI:
- Kinh nghiệm làm việc, công việc hiện tại
- Lương, thu nhập, KPI, doanh số
- Công ty, quản lý nhân sự, thăng tiến
- Dự án kinh doanh, khởi nghiệp

📌 VÍ DỤ CÂU HỎI PHÙ HỢP:
- "Bạn thích môn học nào nhất tại trường?"
- "Bạn có tham gia CLB hay hoạt động nào không?"
- "Bạn cảm thấy mình có điểm mạnh nào trong học tập?"

═══════════════════════════════════════════════════════════════
NHÓM UNIVERSITY (Sinh viên đại học):
═══════════════════════════════════════════════════════════════
✅ CÓ THỂ HỎI:
- Ngành học, năm học, chuyên ngành
- Dự án đã làm, bài tập lớn, đồ án
- CLB/thực tập, kinh nghiệm làm thêm
- Kỹ năng đang phát triển, chứng chỉ
- Định hướng nghề nghiệp, mong muốn sau khi ra trường

❌ KHÔNG HỎI:
- Kinh nghiệm làm việc dài hạn (trên 1 năm)
- Quản lý nhân sự, KPI công ty
- Lương cao, vị trí quản lý
- Dự án kinh doanh quy mô lớn

📌 VÍ DỤ CÂU HỎI PHÙ HỢP:
- "Bạn đang học ngành gì và năm học mấy?"
- "Bạn có làm dự án nào liên quan đến ngành học không?"
- "Bạn có tham gia thực tập hay làm thêm không?"

═══════════════════════════════════════════════════════════════
NHÓM PROFESSIONAL (Người đi làm / Chuyển nghề):
═══════════════════════════════════════════════════════════════
✅ CÓ THỂ HỎI:
- Kinh nghiệm làm việc hiện tại (vị trí, ngành, số năm)
- Chuyên môn, kỹ năng chuyên sâu
- Mục tiêu chuyển nghề, lý do muốn chuyển
- Mong muốn về thăng tiến, phát triển sự nghiệp
- Điểm hài lòng/không hài lòng với công việc hiện tại
- Kỹ năng chuyển đổi (transferable skills)
- Ngành nghề mong muốn, môi trường làm việc
- Lương mong muốn (nếu phù hợp)

❌ TUYỆT ĐỐI KHÔNG HỎI:
- Môn học, điểm số, năm học
- CLB học sinh, hoạt động ngoại khóa học đường
- Trường học, giáo viên, bạn bè học đường
- Sở thích cá nhân không liên quan đến nghề nghiệp
- Thời gian biểu học tập, lịch học

📌 VÍ DỤ CÂU HỎI PHÙ HỢP:
- "Bạn đang làm việc ở vị trí nào và trong lĩnh vực gì?"
- "Bạn có muốn chuyển sang lĩnh vực khác không?"
- "Điều gì khiến bạn muốn thay đổi công việc hiện tại?"
- "Bạn có kỹ năng nào muốn phát triển thêm không?"
- "Bạn thích làm việc trong môi trường như thế nào?"

🚫 VÍ DỤ CÂU HỎI KHÔNG PHÙ HỢP (TUYỆT ĐỐI TRÁNH):
- "Bạn thích môn học nào nhất tại trường?" ❌
- "Bạn có tham gia CLB hay hoạt động nào không?" ❌
- "Bạn có sở thích hoặc hoạt động ngoại khóa nào tại trường không?" ❌
- "Bạn đang học năm mấy?" ❌
- "Bạn thích môn học nào?" ❌

═══════════════════════════════════════════════════════════════

⚠️ KIỂM TRA TRƯỚC KHI TRẢ LỜI:
1. Đọc userType từ input
2. Nếu userType = "professional", TUYỆT ĐỐI KHÔNG hỏi về trường học, môn học, CLB học sinh
3. Nếu userType = "high_school", TUYỆT ĐỐI KHÔNG hỏi về kinh nghiệm làm việc, công ty
4. Nếu userType = "university", TUYỆT ĐỐI KHÔNG hỏi về kinh nghiệm làm việc dài hạn, quản lý nhân sự

🚫 KHÔNG NHẮC TỚI: "database", "template", "trọng số", "API", "backend", "frontend"

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

⚠️ QUAN TRỌNG: Hãy kiểm tra kỹ userType và chỉ tạo câu hỏi phù hợp với nhóm đó.

🔴 Nếu userType là "professional":
   - TUYỆT ĐỐI KHÔNG hỏi về: môn học, điểm số, năm học, trường học, CLB học sinh, hoạt động ngoại khóa học đường
   - CHỈ hỏi về: kinh nghiệm làm việc, kỹ năng chuyên môn, mục tiêu chuyển nghề, mong muốn thăng tiến
   - VÍ DỤ CÂU HỎI ĐÚNG: "Bạn đang làm việc ở vị trí nào?", "Bạn có muốn chuyển sang lĩnh vực khác không?"
   - VÍ DỤ CÂU HỎI SAI: "Bạn thích môn học nào?", "Bạn có tham gia CLB không?", "Bạn có sở thích hoặc hoạt động ngoại khóa nào tại trường không?"

🔴 Nếu userType là "high_school":
   - TUYỆT ĐỐI KHÔNG hỏi về: kinh nghiệm làm việc, công ty, lương, KPI, quản lý nhân sự
   - CHỈ hỏi về: môn học, hoạt động ngoại khóa, sở thích, năng lực đặc biệt

🔴 Nếu userType là "university":
   - TUYỆT ĐỐI KHÔNG hỏi về: kinh nghiệm làm việc dài hạn, quản lý nhân sự, KPI công ty
   - CHỈ hỏi về: ngành học, dự án, thực tập, kỹ năng đang phát triển

Hãy tạo câu hỏi tiếp theo bằng tiếng Việt, xưng hô lịch sự, ngắn gọn.`;

  const payload = {
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent }
    ],
    temperature: 0.3,  // Lower temperature for more deterministic output
    top_p: 0.8,
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

  // ============================================================================
  // VALIDATION LAYER: Check if the question is appropriate for the user type
  // ============================================================================
  if (!validateQuestion(safeUserType, question)) {
    console.log(`[FALLBACK] Using fallback question for userType: ${safeUserType}`);
    const fallbackQuestion = getFallbackQuestion(safeUserType);
    return { question: fallbackQuestion, options: [] };
  }

  // Also validate suggested questions - filter out inappropriate ones
  const validOptions = options.filter(opt => validateQuestion(safeUserType, opt));
  console.log(`[VALIDATION] Filtered suggested questions: ${options.length} -> ${validOptions.length}`);

  return { question, options: validOptions };
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

QUY TẮC TÍNH ĐIỂM (0-100) - RẤT QUAN TRỌNG:
- 85-100: CHỈ khi có thông tin CỤ THỂ, CHI TIẾT và ĐỦ ĐỦ về: sở thích rõ ràng, kỹ năng đã được thể hiện, kinh nghiệm thực tế, mục tiêu nghề nghiệp cụ thể
- 70-84: Phù hợp - có nhiều yếu tố khớp nhưng còn thiếu thông tin chi tiết
- 55-69: Khá phù hợp - có tiềm năng nhưng thông tin còn mơ hồ, chung chung
- 40-54: Có thể phù hợp - cần thêm nhiều thông tin để xác định
- Dưới 40: Không nên đưa vào danh sách

NGUYÊN TẮC CÔNG BẰNG:
1. KHÔNG bao giờ cho điểm cao (>70) chỉ dựa trên thông tin chung chung như "tôi thích...", "tôi làm gì cũng được", "tôi chưa biết"
2. Thông tin mơ hồ, chung chung chỉ được tính tối đa 55-65 điểm
3. Cần CÁC LOẠI thông tin sau để cho điểm cao (>70):
   - Sở thích cụ thể (không chỉ nói "thích âm nhạc" mà phải nói rõ thích thể loại nào, nhạc cụ nào, vai trò nào)
   - Kỹ năng đã được thể hiện (đã làm gì, đạt kết quả gì)
   - Kinh nghiệm thực tế (đã tham gia hoạt động gì, dự án gì)
   - Định hướng rõ ràng (muốn làm gì, muốn phát triển theo hướng nào)
4. Nếu người dùng nói "tôi làm ngành nào cũng được" hoặc tương tự, KHÔNG được cho điểm cao cho bất kỳ ngành nào
5. Điểm số phải phản ánh ĐỘ CHẮC CHẮN dựa trên thông tin CÓ, không phải sự phỏng đoán

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

Hãy phân tích và đưa ra gợi ý nghề nghiệp phù hợp nhất.

Lưu ý về userType:
- high_school: Tập trung vào nghề nghiệp phù hợp với học sinh THPT, dựa trên sở thích, năng lực, môn học yêu thích
- university: Tập trung vào nghề nghiệp phù hợp với sinh viên, dựa trên ngành học, kỹ năng, dự án, định hướng
- professional: Tập trung vào nghề nghiệp phù hợp với người đi làm, dựa trên kinh nghiệm, chuyên môn, mục tiêu chuyển nghề/thăng tiến

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
