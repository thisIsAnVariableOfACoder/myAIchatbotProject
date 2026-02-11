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
import PolicyModal from './components/PolicyModal';
import { privacyPolicyContent, termsOfServiceContent, cookiePolicyContent } from './data/policies.jsx';

export default function App() {
  // Detect GitHub Pages subdirectory
  const isGitHubPages = window.location.hostname.includes('github.io');
  const routerBase = isGitHubPages ? '/myAIchatbotProject' : '/';
  const [showSplash, setShowSplash] = useState(() => localStorage.getItem('showSplash') !== 'false');
  const [splashVisible, setSplashVisible] = useState(showSplash);
  
  // Policy modal state
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [policyTitle, setPolicyTitle] = useState('');
  const [policyContent, setPolicyContent] = useState(null);

  useEffect(() => {
    const { theme, mode } = getStoredTheme();
    applyTheme(theme, mode);
  }, []);

  useEffect(() => {
    if (!showSplash) return;
    const timer = setTimeout(() => setSplashVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [showSplash]);

  // Functions to open policy modals
  const openPrivacyPolicy = (e) => {
    e.preventDefault();
    setPolicyTitle('Chính sách Quyền riêng tư');
    setPolicyContent(privacyPolicyContent);
    setPolicyModalOpen(true);
  };

  const openTermsOfService = (e) => {
    e.preventDefault();
    setPolicyTitle('Điều khoản Dịch vụ');
    setPolicyContent(termsOfServiceContent);
    setPolicyModalOpen(true);
  };

  const openCookiePolicy = (e) => {
    e.preventDefault();
    setPolicyTitle('Chính sách Cookie');
    setPolicyContent(cookiePolicyContent);
    setPolicyModalOpen(true);
  };

  const closePolicyModal = () => {
    setPolicyModalOpen(false);
    setPolicyContent(null);
  };

  return (
    <BrowserRouter basename={routerBase}>
      <div className="min-h-screen app-shell text-[var(--c-text)]">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 bg-white px-3 py-2 rounded shadow">
          Skip to main content
        </a>
        <TopNav />
        <main id="main" className="mx-auto max-w-screen-2xl px-4 py-6">
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/design" element={<Design />} />
          </Routes>
        </main>
        <footer className="border-t border-[var(--c-border)]/70 bg-[var(--c-bg)]/80 backdrop-blur">
          <div className="mx-auto max-w-screen-2xl px-4 py-8">
            <div className="grid gap-8 md:grid-cols-4">
              <div className="space-y-2 md:col-span-2">
                <div className="text-base font-semibold text-[var(--c-text)]">AI YOUNG GURU 2026</div>
                <div className="text-sm text-[#5B5B57]">© 2026 CGC</div>
                <div className="text-sm text-[#5B5B57]">Developed by Team LLMagik</div>
                <div className="text-sm text-[#5B5B57]">
                  Powered by{' '}
                  <a
                    href="https://console.groq.com/playground?model=openai/gpt-oss-120b"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-[var(--c-primary)] hover:underline"
                  >
                    GPT-OSS-120B (Via Groq)
                  </a>
                </div>
                <div className="text-sm text-[#5B5B57]">Version 1.0</div>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-semibold text-[var(--c-text)]">Resources</div>
                <div className="flex flex-col gap-2 text-sm">
                  <a className="text-[#5B5B57] hover:text-[var(--c-text)] hover:underline" href="https://thisisanvariableofacoder.github.io/myAIchatbotProject">Chat</a>
                  <a className="text-[#5B5B57] hover:text-[var(--c-text)] hover:underline" href="https://thisisanvariableofacoder.github.io/myAIchatbotProject/explore">Explore</a>
                  <a
                    className="text-[#5B5B57] hover:text-[var(--c-text)] hover:underline"
                    href="https://github.com/thisIsAnVariableOfACoder/myAIchatbotProject/tree/main"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Source code
                  </a>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-semibold text-[var(--c-text)]">Legal</div>
                <div className="flex flex-col gap-2 text-sm">
                  <button onClick={openPrivacyPolicy} className="text-left text-[#5B5B57] hover:text-[var(--c-text)] hover:underline">Privacy policy</button>
                  <button onClick={openTermsOfService} className="text-left text-[#5B5B57] hover:text-[var(--c-text)] hover:underline">Terms of service</button>
                  <button onClick={openCookiePolicy} className="text-left text-[#5B5B57] hover:text-[var(--c-text)] hover:underline">Cookie policy</button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-[var(--c-border)]/70 pt-6 md:flex-row md:items-center md:justify-between">
              <div className="text-xs text-[#5B5B57]">Career Guidance Chatbot (CGC) · All rights reserved.</div>
              <a
                href="https://github.com/thisIsAnVariableOfACoder/myAIchatbotProject/tree/main"
                className="btn-outline inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub repository"
              >
                <span className="font-medium">GitHub Repo</span>
                <span className="text-[#7A6D5B]">myAIchatbotProject</span>
              </a>
            </div>
          </div>
        </footer>
        {splashVisible && <SplashScreen onClose={() => setSplashVisible(false)} />}
        <PolicyModal
          isOpen={policyModalOpen}
          onClose={closePolicyModal}
          title={policyTitle}
          content={policyContent}
        />
      </div>
    </BrowserRouter>
  );
}
