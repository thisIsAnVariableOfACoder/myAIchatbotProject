import { useEffect, useState } from 'react';
import { applyTheme, getStoredTheme } from '../theme';

export default function ThemeEditor() {
  const [theme, setTheme] = useState(() => getStoredTheme().theme);
  const [showSplash, setShowSplash] = useState(localStorage.getItem('showSplash') !== 'false');

  useEffect(() => {
    applyTheme(theme, 'custom');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('showSplash', String(showSplash));
  }, [showSplash]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
      <section className="rounded-2xl border border-[#E8E2D8] bg-white p-4 shadow-sm">
        <div className="text-lg font-semibold mb-3">Theme & Animation Editor</div>
        <div className="grid grid-cols-2 gap-3">
          <ColorInput label="Primary" value={theme.primary} onChange={(v) => setTheme({ ...theme, primary: v })} />
          <ColorInput label="Accent" value={theme.accent} onChange={(v) => setTheme({ ...theme, accent: v })} />
          <ColorInput label="Background" value={theme.bg} onChange={(v) => setTheme({ ...theme, bg: v })} />
          <ColorInput label="Surface" value={theme.surface} onChange={(v) => setTheme({ ...theme, surface: v })} />
          <ColorInput label="Text" value={theme.text} onChange={(v) => setTheme({ ...theme, text: v })} />
        </div>

        <label className="flex items-center gap-2 text-sm mt-4">
          <input type="checkbox" checked={showSplash} onChange={(e) => setShowSplash(e.target.checked)} />
          Hiển thị animation logo khi khởi động
        </label>
      </section>

      <section className="rounded-2xl border border-[#E8E2D8] bg-white p-4 shadow-sm">
        <div className="text-sm font-semibold mb-3">Preview</div>
        <div className="rounded-2xl p-4" style={{ background: 'var(--c-bg)', color: 'var(--c-text)' }}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl text-white grid place-content-center" style={{ background: 'var(--c-primary)' }}>
              CG
            </div>
            <div>
              <div className="font-semibold">Career Guidance</div>
              <div className="text-xs text-[#5B5B57]">Preview UI</div>
            </div>
          </div>
          <button
            className="mt-4 w-full rounded-lg py-2 text-white"
            style={{ background: 'var(--c-accent)' }}
          >
            Primary Action
          </button>
        </div>
      </section>
    </div>
  );
}

function ColorInput({ label, value, onChange }) {
  return (
    <label className="text-xs text-[#5B5B57]">
      {label}
      <div className="mt-1 flex items-center gap-2">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
        <input
          className="w-full rounded-lg border border-[#E2D8C8] px-2 py-1 text-xs"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </label>
  );
}

// color helper now handled in theme.js
