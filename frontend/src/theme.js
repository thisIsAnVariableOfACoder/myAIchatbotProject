const LIGHT_THEME = {
  primary: '#0B4A6F',
  accent: '#22D3EE',
  bg: '#F1F7FB',
  surface: '#FFFFFF',
  text: '#0B1B2B'
};

const DARK_THEME = {
  primary: '#1E40AF',
  accent: '#22D3EE',
  bg: '#060B16',
  surface: '#0B1220',
  text: '#E6F0FF'
};

function lighten(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.round(((num >> 16) & 255) + 255 * amount));
  const g = Math.min(255, Math.round(((num >> 8) & 255) + 255 * amount));
  const b = Math.min(255, Math.round((num & 255) + 255 * amount));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

function applyTheme(theme, mode) {
  const root = document.documentElement;
  root.setAttribute('data-theme', mode === 'dark' ? 'dark' : 'light');
  root.classList.add('theme-animate');
  root.style.setProperty('--c-primary', theme.primary);
  root.style.setProperty('--c-accent', theme.accent);
  root.style.setProperty('--c-bg', theme.bg);
  root.style.setProperty('--c-surface', theme.surface);
  root.style.setProperty('--c-text', theme.text);
  const accentSoft = mode === 'dark'
    ? mix(theme.accent, theme.bg, 0.2)
    : lighten(theme.accent, 0.6);
  root.style.setProperty('--c-accent-soft', accentSoft);
  root.style.setProperty('color-scheme', mode === 'dark' ? 'dark' : 'light');
  localStorage.setItem('theme', JSON.stringify(theme));
  if (mode) localStorage.setItem('themeMode', mode);
  clearTimeout(window.__themeTimer);
  window.__themeTimer = setTimeout(() => {
    root.classList.remove('theme-animate');
  }, 800);
}

function getStoredTheme() {
  const mode = localStorage.getItem('themeMode');
  if (mode === 'dark') return { theme: DARK_THEME, mode };
  if (mode === 'light') return { theme: LIGHT_THEME, mode };
  const saved = localStorage.getItem('theme');
  if (saved) {
    try {
      return { theme: JSON.parse(saved), mode: 'custom' };
    } catch {
      return { theme: LIGHT_THEME, mode: 'light' };
    }
  }
  return { theme: LIGHT_THEME, mode: 'light' };
}

function setThemeMode(mode) {
  if (mode === 'dark') return applyTheme(DARK_THEME, 'dark');
  return applyTheme(LIGHT_THEME, 'light');
}

function mix(hexA, hexB, weight) {
  const a = parseInt(hexA.replace('#', ''), 16);
  const b = parseInt(hexB.replace('#', ''), 16);
  const ar = (a >> 16) & 255;
  const ag = (a >> 8) & 255;
  const ab = a & 255;
  const br = (b >> 16) & 255;
  const bg = (b >> 8) & 255;
  const bb = b & 255;
  const r = Math.round(ar * weight + br * (1 - weight));
  const g = Math.round(ag * weight + bg * (1 - weight));
  const b2 = Math.round(ab * weight + bb * (1 - weight));
  return `#${(r << 16 | g << 8 | b2).toString(16).padStart(6, '0')}`;
}

export { LIGHT_THEME, DARK_THEME, applyTheme, getStoredTheme, setThemeMode };
