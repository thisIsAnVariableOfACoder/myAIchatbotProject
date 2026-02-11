function normalizeBaseUrl(url) {
  return String(url || '').trim().replace(/\/+$/, '');
}

const runtimeApiBase = normalizeBaseUrl(
  typeof window !== 'undefined' ? window.__API_BASE__ : ''
);
const envApiBase = normalizeBaseUrl(import.meta.env.VITE_API_BASE);
const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
const isLocalhost = /^(localhost|127\.0\.0\.1)$/i.test(hostname);

const fallbackApiBase = isLocalhost
  ? 'http://localhost:3001'
  : 'https://api-myaichatbotproject.onrender.com';
const configuredApiBase = runtimeApiBase || envApiBase || fallbackApiBase;

const runtimeOffline = typeof window !== 'undefined' ? window.__IS_OFFLINE__ : undefined;
const envOffline = import.meta.env.VITE_OFFLINE_MODE === 'true';
const autoOfflineWithoutApi = !configuredApiBase && !isLocalhost;

export const API_BASE = configuredApiBase;
export const IS_OFFLINE = Boolean(runtimeOffline ?? envOffline ?? autoOfflineWithoutApi);
