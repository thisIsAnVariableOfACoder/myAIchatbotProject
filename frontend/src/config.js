// Auto-detect GitHub Pages or local development
const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.includes('github.io');

export const API_BASE = (
  (typeof window !== 'undefined' && window.__API_BASE__) ||
  import.meta.env.VITE_API_BASE ||
  (isGitHubPages ? '' : 'http://localhost:5000') // Force offline on GitHub Pages, localhost otherwise
);

export const IS_OFFLINE = !API_BASE;
