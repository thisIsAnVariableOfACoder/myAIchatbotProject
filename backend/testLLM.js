require('dotenv').config();
const https = require('https');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
const GROQ_BASE_URL = process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1';
const LLM_CHAT_URL = `${GROQ_BASE_URL.replace(/\/$/, '')}/chat/completions`;

console.log('Testing Groq LLM Connection...');
console.log('URL:', LLM_CHAT_URL);
console.log('Model:', GROQ_MODEL);
console.log('Token starts with:', GROQ_API_KEY ? GROQ_API_KEY.substring(0, 10) + '...' : 'MISSING');

const payload = {
    model: GROQ_MODEL,
    messages: [
        { role: 'user', content: 'Hello, respond with a simple JSON object: {"greeting": "hello"}' }
    ],
    max_tokens: 100
};

const data = JSON.stringify(payload);
const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'Authorization': `Bearer ${GROQ_API_KEY}`
    }
};

const req = https.request(LLM_CHAT_URL, options, (res) => {
    console.log('Status:', res.statusCode);
    let raw = '';
    res.on('data', (chunk) => { raw += chunk; });
    res.on('end', () => {
        console.log('Response:', raw);
        try {
            const parsed = JSON.parse(raw);
            if (parsed.choices) {
                console.log('Parsed Choices:', JSON.stringify(parsed.choices, null, 2));
            } else {
                console.log('Error from API:', JSON.stringify(parsed, null, 2));
            }
        } catch (e) {
            console.error('Failed to parse response as JSON');
        }
    });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(data);
req.end();
