const https = require('https');
const { buildCareerRecords } = require('../data/careerLibrary');

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

async function regenerateQuestionForUserType({ userType, profileText, memoryText, intent, invalidQuestion }) {
  const safeUserType = String(userType || 'high_school');
  const repairPrompt = `Bạn là chuyên gia tư vấn hướng nghiệp.
Nhiệm vụ: VIẾT LẠI 1 câu hỏi hướng nghiệp phù hợp userType.

Yêu cầu:
1) Chỉ hỏi 1 câu ngắn gọn, rõ ràng.
2) Bám sát bối cảnh profile + memory.
3) KHÔNG dùng câu hỏi mẫu chung chung.
4) suggested_questions phải là 2-3 gợi ý trả lời CỤ THỂ cho câu hỏi đó.
5) KHÔNG dùng placeholder kiểu "Câu hỏi gợi ý 1", "<option 1>".

Ràng buộc userType:
- professional: KHÔNG hỏi môn học/trường học/CLB học sinh.
- high_school: KHÔNG hỏi KPI/lương/kinh nghiệm làm việc chuyên sâu.
- university: KHÔNG hỏi kinh nghiệm quản lý nhân sự dài hạn.

BẮT BUỘC trả về JSON:
{
  "bot_reply": "<câu hỏi phù hợp>",
  "suggested_questions": ["<gợi ý trả lời 1>", "<gợi ý trả lời 2>"]
}`;

  const repairUser = `userType: ${safeUserType}
profile: ${profileText}
memory: ${JSON.stringify(memoryText || [])}
intent: ${JSON.stringify(intent || {})}
invalid_question: ${invalidQuestion}`;

  const payload = {
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: repairPrompt },
      { role: 'user', content: repairUser }
    ],
    temperature: 0.2,
    top_p: 0.8,
    max_tokens: 512,
    stream: false
  };

  const data = await postJson(LLM_CHAT_URL, payload, LLM_TIMEOUT_MS);
  const content = data?.choices?.[0]?.message?.content;
  const parsed = safeParseChatReply(content);
  if (!parsed) return null;

  const repairedQuestion = normalizeReplyText(parsed.bot_reply);
  if (!repairedQuestion) return null;
  if (!validateQuestion(safeUserType, repairedQuestion)) return null;

  const repairedOptions = normalizeSuggestedQuestions(parsed.suggested_questions)
    .filter((opt) => validateQuestion(safeUserType, opt));

  return {
    question: repairedQuestion,
    options: repairedOptions
  };
}

// ============================================================================
// CAREER CONSULTATION MODE - For answering follow-up career questions
// ============================================================================

// System prompt for detailed career consultation when users ask follow-up questions
const CAREER_CONSULTATION_PROMPT = `Bạn là CHUYÊN GIA TƯ VẤN HƯỚNG NGHIỆP với nhiều năm kinh nghiệm.

NHIỆM VỤ: Khi người dùng hỏi về nghề nghiệp, bạn phải:
1. Trả lời CHI TIẾT, CỤ THỂ về nghề nghiệp họ quan tâm
2. Cập nhật/điều chỉnh xác suất phù hợp dựa trên thông tin mới
3. Đưa ra kết luận nghề nghiệp nếu đủ thông tin (không nhất thiết phải hỏi đủ 100 câu)
4. Khuyến khích người dùng tiếp tục nếu cần thêm thông tin

GIỚI HẠN PHẢN HỒI:
- Tối thiểu: 10 câu hỏi/đáp
- Tối đa: 100 câu hỏi/đáp
- KẾT LUẬN: Đưa ra kết luận khi đạt độ tin cậy cao (>= 75% match score)

QUY TẮC TRẢ LỜI:
- Nếu người dùng hỏi về nghề cụ thể: Mô tả chi tiết công việc, yêu cầu, cơ hội, lương, định hướng phát triển
- Nếu người dùng hỏi ngược lại chatbot: Phân tích và tư vấn dựa trên thông tin đã có
- Nếu người dùng cung cấp thêm thông tin: Cập nhật xác suất và điều chỉnh gợi ý
- Nếu đủ thông tin: Đưa ra kết luận nghề nghiệp với danh sách top 5-7 nghề phù hợp nhất
- suggested_questions phải CỤ THỂ theo ngữ cảnh hiện tại, KHÔNG dùng placeholder mặc định
- KHÔNG trả về các gợi ý kiểu mẫu như: "Câu hỏi gợi ý 1", "<option 1>", "Có/Có thể/Không" khi không thật sự phù hợp

BẮT BUỘC: Trả về JSON đúng cấu trúc:
{
  "bot_reply": "Nội dung tư vấn chi tiết",
  "suggested_questions": ["Câu hỏi gợi ý 1", "Câu hỏi gợi ý 2"],
  "career_conclusion": true/false,
  "updated_careers": [{"name": "Tên nghề", "score": 85, "change": "+5"}]
}`;

/**
 * Detect if user message is a follow-up career question
 */
function isFollowUpCareerQuestion(message) {
  if (!message) return false;
  const lowerMessage = String(message).toLowerCase();
  
  // Patterns that indicate follow-up questions about careers
  const followUpPatterns = [
    /còn (.*nghề|nào|khi nào|bao lâu|bao nhiêu)/i,
    /về (.*nghề|công việc|ngành)/i,
    /tôi nên|lựa chọn|phù hợp/i,
    /lương|thu nhập|định hướng/i,
    /cơ hội|tương lai|phát triển/i,
    /yêu cầu|kỹ năng|kinh nghiệm/i,
    /nên học|làm gì|điểm mạnh/i,
    /(?<!không )hỏi|lại|hỏi tiếp/i,
    /tư vấn|khuyên|góp ý/i,
    /làm sao|như thế nào/i
  ];
  
  return followUpPatterns.some(pattern => pattern.test(lowerMessage));
}

/**
 * Generate detailed career consultation reply for follow-up questions
 */
async function generateCareerConsultationReply({ history, currentMessage, userType, profile, careerScores }) {
  if (!isEnabled()) {
    console.error('[LLM] Disabled - No GROQ_API_KEY');
    return null;
  }
  
  const safeUserType = String(userType || 'high_school');
  
  // Build career scores text
  let careerScoresText = '';
  if (careerScores && Object.keys(careerScores).length > 0) {
    const sortedScores = Object.entries(careerScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    careerScoresText = sortedScores
      .map(([career, score]) => `${career}: ${Math.round(score)}%`)
      .join('\n');
  }
  
  const historyMessages = (history || []).map(h => ([
    {
      role: 'assistant',
      content: JSON.stringify({ bot_reply: h.q, suggested_questions: [] })
    },
    {
      role: 'user',
      content: h.a
    }
  ])).flat();
  
  const messages = [
    { role: 'system', content: CAREER_CONSULTATION_PROMPT },
    ...historyMessages,
    { role: 'user', content: `${currentMessage || 'Xin chào'}\n\nThông tin bổ sung:\n- User type: ${safeUserType}\n- Career scores hiện tại:\n${careerScoresText || 'Chưa có dữ liệu'}\n\n(BẮT BUỘC: Trả lời bằng tiếng Việt và giữ định dạng JSON)` }
  ];
  
  const payload = {
    model: GROQ_MODEL,
    messages: messages,
    temperature: 0.7,
    top_p: 0.9,
    max_tokens: 1536,
    stream: false
  };
  
  console.log('[LLM] Career Consultation Request:', JSON.stringify(payload, null, 2));
  
  const data = await postJson(LLM_CHAT_URL, payload, LLM_TIMEOUT_MS);
  if (!data) {
    console.error('[LLM] No response from career consultation');
    return null;
  }
  
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    console.error('[LLM] No content in career consultation response');
    return null;
  }
  
  const parsed = safeParseConsultationReply(content);
  console.log('[LLM] Career Consultation Result:', JSON.stringify(parsed, null, 2));
  return parsed;
}

function isFollowUpToQuestion(message, pendingQuestion) {
  const userText = normalizeReplyText(message);
  const questionText = normalizeReplyText(pendingQuestion);
  if (!userText || !questionText) return false;

  // Short replies are likely direct answers to pending question.
  const tokenCount = userText.split(/\s+/).filter(Boolean).length;
  if (tokenCount <= 10 && !userText.includes('?')) return true;

  // Direct lexical overlap between pending question and user message.
  const normalizedUser = normalizeEvidenceText(userText);
  const normalizedQuestion = normalizeEvidenceText(questionText);
  if (!normalizedUser || !normalizedQuestion) return false;
  const qTokens = new Set(normalizedQuestion.split(' ').filter((t) => t.length >= 3));
  const uTokens = new Set(normalizedUser.split(' ').filter((t) => t.length >= 3));
  let overlap = 0;
  for (const t of uTokens) {
    if (qTokens.has(t)) overlap += 1;
  }
  const overlapRatio = qTokens.size > 0 ? overlap / qTokens.size : 0;
  return overlapRatio >= 0.2;
}

async function classifyUserTurnIntent({ pendingQuestion, history, currentMessage }) {
  const userText = normalizeReplyText(currentMessage);
  if (!userText) {
    return {
      intent: 'answer',
      confidence: 0.55,
      reason: 'empty_message_default_answer'
    };
  }

  if (!isEnabled()) {
    // Lightweight fallback without static keyword list.
    const mixed = userText.includes('?');
    return {
      intent: mixed ? 'question' : 'answer',
      confidence: 0.6,
      reason: 'llm_disabled_fallback'
    };
  }

  const historyTail = Array.isArray(history) ? history.slice(-6) : [];
  const prompt = `Bạn là bộ phân loại ý định hội thoại cho chatbot hướng nghiệp.
Phân loại tin nhắn người dùng hiện tại thành 1 trong 3 nhãn:
- "answer": chủ yếu đang trả lời câu hỏi AI đang chờ.
- "question": chủ yếu đang hỏi AI.
- "both": vừa có nội dung trả lời, vừa có nội dung hỏi thêm.

Nguyên tắc:
1) Dựa vào NGỮ CẢNH, không dựa từ khóa cứng.
2) Nếu có pending_question và user trả lời đúng trọng tâm câu đó thì ưu tiên "answer" hoặc "both".
3) Nếu user hỏi thêm trong khi vẫn trả lời pending_question, chọn "both".
4) Trả về JSON DUY NHẤT:
{
  "intent": "answer|question|both",
  "confidence": 0.0,
  "reason": "ngắn gọn"
}`;

  const userPayload = {
    pending_question: pendingQuestion || '',
    history: historyTail,
    current_message: userText
  };

  const payload = {
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: JSON.stringify(userPayload) }
    ],
    temperature: 0.0,
    top_p: 0.2,
    max_tokens: 220,
    stream: false
  };

  const data = await postJson(LLM_CHAT_URL, payload, LLM_TIMEOUT_MS);
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    return {
      intent: 'question',
      confidence: 0.5,
      reason: 'no_llm_content'
    };
  }

  const tryParse = (value) => {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  };

  let parsed = tryParse(content);
  if (!parsed) {
    const fence = String(content).match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fence) parsed = tryParse(fence[1].trim());
  }
  if (!parsed) {
    const objMatch = String(content).match(/\{[\s\S]*\}/);
    if (objMatch) parsed = tryParse(objMatch[0]);
  }

  const intentRaw = String(parsed?.intent || '').toLowerCase();
  const intent = (intentRaw === 'answer' || intentRaw === 'question' || intentRaw === 'both')
    ? intentRaw
    : 'question';
  const confidence = clamp(Number(parsed?.confidence || 0.5), 0, 1);
  const reason = normalizeReplyText(parsed?.reason || 'classified_by_llm');

  // Context correction: if overlap shows direct answering, bias away from pure question.
  if (pendingQuestion && intent === 'question' && isFollowUpToQuestion(userText, pendingQuestion)) {
    return {
      intent: userText.includes('?') ? 'both' : 'answer',
      confidence: Math.max(confidence, 0.65),
      reason: 'context_overlap_correction'
    };
  }

  return { intent, confidence, reason };
}

/**
 * Parse AI response for career consultation
 */
function safeParseConsultationReply(content) {
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
  
  // Try to extract JSON from code fence
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  let parsed = null;
  if (fenceMatch) {
    parsed = tryParseJson(fenceMatch[1].trim());
  }
  
  // Try to parse the whole text as JSON
  if (!parsed) {
    parsed = tryParseJson(text);
  }
  
  // Try to extract first JSON object
  if (!parsed) {
    let start = -1;
    let depth = 0;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === '{') {
        if (depth === 0) start = i;
        depth++;
      } else if (text[i] === '}') {
        depth--;
        if (depth === 0 && start !== -1) {
          const slice = text.slice(start, i + 1);
          parsed = tryParseJson(slice);
          if (parsed) break;
        }
      }
    }
  }
  
  if (!parsed) {
    // Fallback: return the text as bot_reply
    return {
      bot_reply: text,
      suggested_questions: [],
      career_conclusion: false,
      updated_careers: []
    };
  }
  
  return {
    bot_reply: normalizeReplyText(parsed.bot_reply) || text,
    suggested_questions: normalizeSuggestedQuestions(parsed.suggested_questions),
    career_conclusion: Boolean(parsed.career_conclusion),
    updated_careers: Array.isArray(parsed.updated_careers) ? parsed.updated_careers : []
  };
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

QUY TẮC GỢI Ý:
- suggested_questions phải được tạo theo đúng nội dung hội thoại hiện tại
- KHÔNG dùng text mẫu/placeholder như "Câu hỏi gợi ý 1", "Câu hỏi gợi ý 2", "<option 1>"

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
Nếu câu hỏi dạng tự do thì suggested_questions = [].

RÀNG BUỘC CHO suggested_questions:
- Phải là gợi ý trả lời CỤ THỂ cho đúng câu hỏi vừa tạo
- KHÔNG được dùng placeholder: "Câu hỏi gợi ý 1", "Câu hỏi gợi ý 2", "<option 1>", "<option 2>"
- Tránh bộ mặc định chung chung "Có", "Có thể", "Không" nếu không thật sự cần thiết`;

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
    console.log(`[RETRY] Regenerating invalid question for userType: ${safeUserType}`);
    const repaired = await regenerateQuestionForUserType({
      userType: safeUserType,
      profileText,
      memoryText,
      intent,
      invalidQuestion: question
    });
    return repaired;
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
    .filter((item) => {
      const normalized = String(item || '').trim().toLowerCase();
      if (!normalized) return false;
      if (/^câu hỏi gợi ý\s*\d*$/i.test(normalized)) return false;
      if (/^câu trả lời gợi ý\s*\d*$/i.test(normalized)) return false;
      if (/^option\s*\d+$/i.test(normalized)) return false;
      if (/^<\s*option\s*\d+\s*>$/i.test(normalized)) return false;
      if (/^<\s*câu hỏi.*>$/.test(normalized)) return false;
      return true;
    })
    .filter(Boolean)
    .slice(0, 5);
}

function normalizeCareerKey(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const CAREER_CATALOG = (() => {
  const records = buildCareerRecords();
  const map = new Map();
  for (const rec of records) {
    const name = String(rec?.name || '').trim();
    const category = String(rec?.category || '').trim() || 'Other';
    const key = normalizeCareerKey(name);
    if (!key || map.has(key)) continue;
    map.set(key, { name, category });
  }
  return {
    map,
    records: records.map((r) => ({
      name: String(r?.name || '').trim(),
      category: String(r?.category || '').trim() || 'Other'
    })).filter((r) => r.name)
  };
})();

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeEvidenceText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildRecommendationEvidence({ userType, profile, memoryAnswers }) {
  const profileText = profile ? JSON.stringify(profile) : '';
  const memoryText = Array.isArray(memoryAnswers)
    ? memoryAnswers
      .map((a) => `${a?.question || a?.q || ''} ${a?.answer || a?.a || ''}`)
      .join(' ')
    : '';
  const text = normalizeEvidenceText(`${profileText} ${memoryText}`);
  const has = (pattern) => pattern.test(text);

  return {
    userType: String(userType || 'high_school'),
    text,
    teaching: has(/\b(giao vien|teacher|giang day|su pham|giao duc|day hoc|hoc sinh|lop hoc)\b/),
    biology: has(/\b(sinh hoc|biology|te bao|gene|di truyen|phong thi nghiem|lab|khoa hoc su song)\b/),
    business: has(/\b(kinh doanh|sales|doanh nghiep|hr|quan tri|startup|thuong mai)\b/),
    marketing: has(/\b(marketing|digital marketing|seo|sem|social media|noi dung|content|thuong hieu|brand|pr|quang cao|truyen thong|growth)\b/),
    finance: has(/\b(tai chinh|ke toan|kiem toan|ngan hang|dau tu|bao hiem|chung khoan)\b/),
    media: has(/\b(truyen thong|content|noi dung|bao chi|media|video|podcast|influencer|pr)\b/),
    tech: has(/\b(cong nghe|lap trinh|coding|software|data|ai|machine learning)\b/),
    engineering: has(/\b(ky su|engineering|co khi|xay dung|dien|tu dong hoa|cong nghiep)\b/),
    upskill: has(/\b(phat trien|nang cao|trau doi|bo sung|hoan thien|improve|upskill)\b/)
  };
}

function getPriorityCategories(evidence) {
  const prioritized = [];

  if (evidence.marketing) prioritized.push('Marketing', 'Media', 'Business', 'Design');
  if (evidence.finance) prioritized.push('Finance', 'Business');
  if (evidence.teaching) prioritized.push('Education');
  if (evidence.biology) prioritized.push('Science', 'Education', 'Healthcare', 'Agriculture');
  if (evidence.tech) prioritized.push('Technology', 'Data', 'Engineering');
  if (evidence.media) prioritized.push('Media', 'Marketing');
  if (evidence.business) prioritized.push('Business', 'Marketing', 'Finance');

  if (evidence.userType === 'high_school') {
    prioritized.push('Education', 'Science', 'Technology', 'Design');
  } else if (evidence.userType === 'university') {
    prioritized.push('Technology', 'Data', 'Science', 'Business');
  } else {
    prioritized.push('Business', 'Technology', 'Education', 'Finance');
  }

  prioritized.push('Education', 'Technology', 'Data', 'Business', 'Design', 'Science');
  return Array.from(new Set(prioritized));
}

function computeRelevanceAdjustment(careerName, category, evidence) {
  const normalizedCareer = normalizeEvidenceText(careerName);
  let adjustment = 0;

  if (evidence.marketing) {
    if (category === 'Marketing') adjustment += 24;
    if (category === 'Media') adjustment += 12;
    if (category === 'Business' || category === 'Design') adjustment += 8;

    if ((category === 'Technology' || category === 'Data' || category === 'Engineering') && !evidence.tech) {
      adjustment -= 24;
    }
    if (['Science', 'Healthcare', 'Trades', 'Construction', 'Agriculture'].includes(category)) {
      adjustment -= 14;
    }
  }

  if (evidence.finance) {
    if (category === 'Finance') adjustment += 16;
    if (category === 'Business') adjustment += 8;
    if (category === 'Marketing' && !evidence.marketing) adjustment -= 6;
  }

  if (evidence.teaching) {
    if (category === 'Education') adjustment += 18;
    if (category === 'Science') adjustment += 10;
    if (category === 'Healthcare' || category === 'Agriculture') adjustment += 6;
    if ((category === 'Business' || category === 'Marketing' || category === 'Finance') && !evidence.business) {
      adjustment -= 18;
    }
  }

  if (evidence.biology) {
    if (category === 'Science' || category === 'Education') adjustment += 14;
    if (category === 'Healthcare' || category === 'Agriculture') adjustment += 10;
    if (category === 'Business' || category === 'Marketing') adjustment -= 14;
  }

  if (evidence.tech && (category === 'Technology' || category === 'Data')) adjustment += 10;
  if (evidence.tech && category === 'Engineering') adjustment += 6;
  if (evidence.media && category === 'Media') adjustment += 6;
  if (evidence.business && (category === 'Business' || category === 'Marketing' || category === 'Finance')) adjustment += 8;

  if (evidence.business && !evidence.tech && (category === 'Technology' || category === 'Engineering')) {
    adjustment -= 10;
  }

  if (evidence.upskill && evidence.teaching && /\b(giao vien|giang vien|gia su|teacher)\b/.test(normalizedCareer)) {
    adjustment += 8;
  }

  if (/\b(dao tao doanh nghiep|e learning|elearning|corporate trainer)\b/.test(normalizedCareer) && !evidence.business) {
    adjustment -= 22;
  }

  return adjustment;
}

function shouldDropRecommendationByContext(category, evidence, adjustedScore) {
  if (!category) return false;

  if (evidence.marketing && !evidence.tech && !evidence.engineering) {
    const allowed = new Set(['Marketing', 'Media', 'Business', 'Design', 'Finance']);
    if (!allowed.has(category) && adjustedScore < 88) {
      return true;
    }
  }

  if (evidence.tech && !evidence.business && !evidence.marketing) {
    const allowed = new Set(['Technology', 'Data', 'Engineering']);
    if (!allowed.has(category) && adjustedScore < 84) {
      return true;
    }
  }

  // Trường hợp có tín hiệu rất mạnh: giáo viên + sinh học + không có business signal.
  // Loại bỏ các nghề Business/Marketing/Finance yếu liên quan để tránh gợi ý lệch.
  if (evidence.teaching && evidence.biology && !evidence.business) {
    if (['Business', 'Marketing', 'Finance'].includes(category) && adjustedScore < 72) {
      return true;
    }
  }

  return false;
}

function buildContextFallbackRecommendations(evidence, existingNames = []) {
  const existing = new Set(existingNames.map((name) => normalizeCareerKey(name)));
  const categories = getPriorityCategories(evidence);
  const fallbacks = [];
  let score = 62;

  for (const category of categories) {
    const categoryCareers = CAREER_CATALOG.records.filter((r) => r.category === category);
    for (const c of categoryCareers) {
      const key = normalizeCareerKey(c.name);
      if (!key || existing.has(key)) continue;
      existing.add(key);
      fallbacks.push({
        career_name: c.name,
        match_score: clamp(Math.round(score), 35, 85),
        probability: 0,
        confidence: score >= 75 ? 'high' : score >= 60 ? 'medium' : 'low',
        reasons: ['Phù hợp với bối cảnh và định hướng bạn đã chia sẻ']
      });
      score = Math.max(40, score - 2);
      if (fallbacks.length >= 10) return fallbacks;
    }
  }

  return fallbacks;
}

function postProcessRecommendations(rawRecommendations, context) {
  if (!Array.isArray(rawRecommendations) || rawRecommendations.length === 0) return [];

  const evidence = buildRecommendationEvidence(context || {});
  const dedup = new Map();

  for (const rec of rawRecommendations) {
    const rawName = normalizeReplyText(rec?.career_name);
    if (!rawName) continue;

    const key = normalizeCareerKey(rawName);
    const mappedCareer = CAREER_CATALOG.map.get(key);
    if (!mappedCareer) {
      // Loại bỏ các nghề do model tự bịa hoặc không nằm trong catalog chuẩn.
      continue;
    }

    const baseScore = clamp(Number(rec?.match_score || 0), 0, 100);
    const adjustedScore = clamp(
      baseScore + computeRelevanceAdjustment(mappedCareer.name, mappedCareer.category, evidence),
      0,
      100
    );

    if (shouldDropRecommendationByContext(mappedCareer.category, evidence, adjustedScore)) {
      continue;
    }

    const reasons = Array.isArray(rec?.reasons)
      ? rec.reasons.map((r) => normalizeReplyText(r)).filter(Boolean).slice(0, 3)
      : [];

    const existing = dedup.get(mappedCareer.name);
    if (!existing || adjustedScore > existing.match_score) {
      dedup.set(mappedCareer.name, {
        career_name: mappedCareer.name,
        match_score: adjustedScore,
        probability: clamp(adjustedScore / 100, 0, 1),
        confidence: adjustedScore >= 75 ? 'high' : adjustedScore >= 60 ? 'medium' : 'low',
        reasons
      });
    }
  }

  let ranked = Array.from(dedup.values())
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 10);

  if (ranked.length < 6) {
    const fallback = buildContextFallbackRecommendations(evidence, ranked.map((r) => r.career_name));
    for (const rec of fallback) {
      ranked.push(rec);
      if (ranked.length >= 10) break;
    }
    ranked = ranked
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 10);
  }

  return ranked;
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

6. ƯU TIÊN TÍNH LIÊN QUAN THEO BỐI CẢNH:
   - Nếu người dùng đang ở một nghề hiện tại và muốn nâng cấp kỹ năng, hãy ưu tiên các nghề cùng miền chuyên môn hoặc lân cận hợp lý.
   - KHÔNG nhảy sang nhóm nghề xa ngữ cảnh nếu không có bằng chứng rõ ràng.
   - Ví dụ: người dùng là giáo viên và muốn phát triển kỹ năng sinh học -> ưu tiên nhóm Education/Science trước, không ưu tiên các nghề Business/Marketing không liên quan.

7. KHÔNG BỊA nghề lạ. Chỉ dùng nghề phổ biến, rõ ràng, có thật và bám sát dữ liệu người dùng.

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

  const parsed = safeParseRecommendations(content, {
    userType: safeUserType,
    profile,
    memoryAnswers
  });
  console.log('[LLM] Career Recommendations:', JSON.stringify(parsed, null, 2));
  return parsed;
}

/**
 * Parse AI response for career recommendations
 */
function safeParseRecommendations(content, context = null) {
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
  const normalizedRecommendations = parsed.recommendations
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

  const recommendations = postProcessRecommendations(normalizedRecommendations, context || {});

  if (!recommendations.length) {
    console.error('[LLM] No valid recommendations after post-process filtering');
    return null;
  }

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
  generateCareerRecommendations,
  classifyUserTurnIntent,
  isFollowUpToQuestion,
  // New functions for career consultation mode
  generateCareerConsultationReply,
  isFollowUpCareerQuestion
};
