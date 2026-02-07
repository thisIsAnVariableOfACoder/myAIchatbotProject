export const API_BASE = (
  (typeof window !== 'undefined' && window.__API_BASE__) ||
  import.meta.env.VITE_API_BASE ||
  'http://localhost:5000'
);

export const IS_OFFLINE = !API_BASE;
