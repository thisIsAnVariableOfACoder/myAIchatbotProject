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
  const raw = String(input ?? '');
  const html = markdown.render(raw);
  return sanitizeChatHtml(html);
}
