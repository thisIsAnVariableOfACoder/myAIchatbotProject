function normalizeBaseUrl(url) {
  return String(url || '').trim().replace(/\/+$/, '');
}

function parseBooleanLike(value) {
  if (typeof value === 'boolean') return value;
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on') return true;
  if (normalized === 'false' || normalized === '0' || normalized === 'no' || normalized === 'off') return false;
  return undefined;
}

const runtimeApiBase = normalizeBaseUrl(
  typeof window !== 'undefined' ? window.__API_BASE__ : ''
);
const envApiBase = normalizeBaseUrl(import.meta.env.VITE_API_BASE);
const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
const isLocalhost = /^(localhost|127\.0\.0\.1)$/i.test(hostname);
const isGithubPages = /(^|\.)github\.io$/i.test(hostname);

const isInvalidGithubApiBase = isGithubPages && /(^|\.)github\.io$/i.test(String(runtimeApiBase || envApiBase));

const fallbackApiBase = isLocalhost ? 'http://localhost:3001' : '';
const configuredApiBase = isInvalidGithubApiBase ? '' : (runtimeApiBase || envApiBase || fallbackApiBase);

const runtimeOfflineRaw = typeof window !== 'undefined' ? window.__IS_OFFLINE__ : undefined;
const runtimeOffline = parseBooleanLike(runtimeOfflineRaw);
const envOffline = parseBooleanLike(import.meta.env.VITE_OFFLINE_MODE);
const autoOfflineWithoutApi = !configuredApiBase && !isLocalhost;

export const API_BASE = configuredApiBase;
export const IS_OFFLINE = Boolean(runtimeOffline ?? envOffline ?? autoOfflineWithoutApi);
