import DOMPurify from 'dompurify';
import MarkdownIt from 'markdown-it';

const markdown = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true
});

const ALLOWED_TAGS = [
  'b',
  'strong',
  'i',
  'em',
  'u',
  's',
  'del',
  'span',
  'p',
  'br',
  'div',
  'ul',
  'ol',
  'li',
  'a',
  'code',
  'pre',
  'blockquote',
  'hr',
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'th',
  'td',
  'caption',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6'
];

const ALLOWED_ATTR = [
  'href',
  'target',
  'rel',
  'title',
  'style',
  'colspan',
  'rowspan',
  'align'
];

const ALLOWED_CSS_PROPERTIES = [
  'color',
  'background-color',
  'font-weight',
  'font-style',
  'text-decoration',
  'text-decoration-line',
  'text-decoration-style',
  'text-decoration-color',
  'border',
  'border-color',
  'border-width',
  'border-style',
  'border-radius',
  'text-align',
  'vertical-align',
  'padding',
  'padding-left',
  'padding-right',
  'padding-top',
  'padding-bottom',
  'margin',
  'margin-left',
  'margin-right',
  'margin-top',
  'margin-bottom',
  'display',
  'font-size',
  'line-height',
  'white-space',
  'list-style-type'
];

const ALLOWED_URI_REGEXP = /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+\.\-]+(?:[^a-z+\.\-:]|$))/i;

let hooksInitialized = false;

function extractJsonSlice(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  return text.slice(start, end + 1);
}

function decodeEscapes(value) {
  const stringValue = String(value ?? '');
  const normalized = stringValue
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t');
  try {
    return JSON.parse(`"${normalized}"`);
  } catch {
    return stringValue
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');
  }
}

function normalizeChatText(input) {
  if (input == null) return '';
  if (typeof input === 'object') {
    if (Object.prototype.hasOwnProperty.call(input, 'bot_reply')) {
      return String(input?.bot_reply ?? '');
    }
    try {
      return JSON.stringify(input, null, 2);
    } catch {
      return String(input);
    }
  }
  const raw = String(input ?? '');
  const trimmed = raw.trim();
  if (!trimmed) return raw;
  if (!trimmed.includes('"bot_reply"')) return raw;

  const slice = extractJsonSlice(trimmed);
  if (slice) {
    try {
      const parsed = JSON.parse(slice);
      if (parsed && Object.prototype.hasOwnProperty.call(parsed, 'bot_reply')) {
        return String(parsed.bot_reply ?? '');
      }
    } catch {
      // Ignore JSON parse errors and fallback to regex extraction.
    }
    const match = slice.match(/"bot_reply"\s*:\s*"([\s\S]*?)"\s*(?:,|\})/);
    if (match) return decodeEscapes(match[1]);
  }

  const prefixRegex = /^\s*\{\s*"bot_reply"\s*:\s*"/;
  if (prefixRegex.test(trimmed)) {
    const stripped = trimmed.replace(prefixRegex, '').replace(/"\s*\}\s*$/, '');
    return decodeEscapes(stripped);
  }

  return raw;
}

function initHooks() {
  if (hooksInitialized) return;
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName !== 'A') return;
    const target = node.getAttribute('target');
    if (target === '_blank') {
      const rel = node.getAttribute('rel') || '';
      const tokens = new Set(rel.split(/\s+/).filter(Boolean));
      tokens.add('noopener');
      tokens.add('noreferrer');
      node.setAttribute('rel', Array.from(tokens).join(' '));
    }
  });
  hooksInitialized = true;
}

export function sanitizeChatHtml(html) {
  initHooks();
  return DOMPurify.sanitize(String(html ?? ''), {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_CSS_PROPERTIES,
    ALLOWED_URI_REGEXP,
    ALLOW_DATA_ATTR: false
  });
}

export function renderChatHtml(input) {
  const raw = normalizeChatText(input);
  const html = markdown.render(raw);
  return sanitizeChatHtml(html);
}
