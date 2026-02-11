function normalizeBaseUrl(url) {
  return String(url || '').trim().replace(/\/+$/, '');
}

const runtimeApiBase = normalizeBaseUrl(
  typeof window !== 'undefined' ? window.__API_BASE__ : ''
);
const envApiBase = normalizeBaseUrl(import.meta.env.VITE_API_BASE);
const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
const isGithubPages = /(^|\.)github\.io$/i.test(hostname);

const fallbackApiBase = isGithubPages ? '' : 'http://localhost:3001';
const configuredApiBase = runtimeApiBase || envApiBase || fallbackApiBase;

const runtimeOffline = typeof window !== 'undefined' ? window.__IS_OFFLINE__ : undefined;
const envOffline = import.meta.env.VITE_OFFLINE_MODE === 'true';
const autoOfflineForGithub = isGithubPages && !configuredApiBase;

export const API_BASE = configuredApiBase;
export const IS_OFFLINE = Boolean(runtimeOffline ?? envOffline ?? autoOfflineForGithub);
