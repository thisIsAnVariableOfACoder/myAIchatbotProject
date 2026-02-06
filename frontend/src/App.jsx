import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TopNav from './components/TopNav';
import Chat from './pages/Chat';
import Admin from './pages/Admin';
import Analytics from './pages/Analytics';
import Auth from './pages/Auth';
import Design from './pages/Design';
import SplashScreen from './components/SplashScreen';
import { applyTheme, getStoredTheme } from './theme';
import Explore from './pages/Explore';

export default function App() {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const routerBase = baseUrl === './' ? '/' : baseUrl;
  const [showSplash, setShowSplash] = useState(() => localStorage.getItem('showSplash') !== 'false');
  const [splashVisible, setSplashVisible] = useState(showSplash);

  useEffect(() => {
    const { theme, mode } = getStoredTheme();
    applyTheme(theme, mode);
  }, []);

  useEffect(() => {
    if (!showSplash) return;
    const timer = setTimeout(() => setSplashVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [showSplash]);

  return (
    <BrowserRouter basename={routerBase}>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_var(--c-accent-soft)_0,_var(--c-bg)_45%,_var(--c-bg)_100%)] text-[var(--c-text)]">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 bg-white px-3 py-2 rounded shadow">
          Skip to main content
        </a>
        <TopNav />
        <main id="main" className="mx-auto max-w-7xl px-4 py-6">
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/design" element={<Design />} />
          </Routes>
        </main>
        <footer className="border-t border-[#E8E2D8] bg-[var(--c-bg)]/60">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <div className="text-base font-semibold text-[var(--c-text)]">
                  AI Young Guru 2026
                </div>
                <div className="text-sm text-[#5B5B57]">
                  Made by Phạm Khôi Nguyên · Team LLMagik
                </div>
              </div>
              <a
                href="https://github.com/thisIsAnVariableOfACoder"
                className="inline-flex items-center gap-2 rounded-xl border border-[#E2D8C8] px-4 py-2 text-sm text-[var(--c-primary)] hover:border-[var(--c-accent)] hover:text-[var(--c-accent)] transition"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub thisIsAnVariableOfACoder"
              >
                <span className="font-medium">GitHub</span>
                <span className="text-[#7A6D5B]">github.com/thisIsAnVariableOfACoder</span>
              </a>
            </div>
          </div>
        </footer>
        {splashVisible && <SplashScreen onClose={() => setSplashVisible(false)} />}
      </div>
    </BrowserRouter>
  );
}
