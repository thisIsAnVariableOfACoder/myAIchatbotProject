import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStoredTheme, setThemeMode } from '../theme';

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm transition ${isActive ? 'bg-[var(--c-primary)] text-white' : 'text-[var(--c-text)] hover:bg-[var(--c-accent-soft)]'}`;

export default function TopNav() {
  const { user, logout } = useAuth();
  const isAdmin = user?.user_type === 'admin';
  const baseUrl = import.meta.env.BASE_URL || '/';
  const logoSrc = `${baseUrl}ai-young-guru-logo.png`;
  const fallbackLogo = `${baseUrl}icon.svg`;
  const [themeModeState, setThemeModeState] = useState(() => {
    const stored = getStoredTheme().mode;
    return stored === 'dark' ? 'dark' : 'light';
  });

  return (
    <header className="sticky top-0 z-40 border-b border-[#E8E2D8] bg-[var(--c-bg)]/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-auto">
            <img
              src={logoSrc}
              alt="AI Young Guru"
              className="h-12 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.src = fallbackLogo;
              }}
            />
          </div>
          <div>
            <div className="text-lg font-semibold">Career Guidance Chatbot</div>
            <div className="text-sm text-[#5B5B57]">Bản thử nghiệm</div>
          </div>
        </div>
        <nav className="flex items-center gap-2">
          <NavLink to="/" className={linkClass}>Chat</NavLink>
          <NavLink to="/explore" className={linkClass}>Explore</NavLink>
          {isAdmin && <NavLink to="/analytics" className={linkClass}>Analytics</NavLink>}
          {isAdmin && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
          {isAdmin && <NavLink to="/design" className={linkClass}>Design</NavLink>}
          <div className="flex items-center gap-1 rounded-xl border border-[#E2D8C8] px-1.5 py-1.5">
            <button
              className={`px-3 py-2 text-sm rounded-lg flex items-center gap-2 ${themeModeState === 'light' ? 'bg-[var(--c-primary)] text-white' : 'text-[var(--c-text)]'}`}
              onClick={() => {
                setThemeMode('light');
                setThemeModeState('light');
              }}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path fill="currentColor" d="M12 4a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V5a1 1 0 0 1 1-1zm6.36 2.64a1 1 0 0 1 0 1.41l-1.42 1.42a1 1 0 0 1-1.41-1.41l1.41-1.42a1 1 0 0 1 1.42 0zM20 11a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2h2zM6.64 6.64a1 1 0 0 1 1.41 0l1.42 1.42a1 1 0 1 1-1.41 1.41L6.64 8.05a1 1 0 0 1 0-1.41zM6 11a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2h2zm5 9a1 1 0 1 1 2 0v-2a1 1 0 1 1-2 0v2zm7.78-2.22a1 1 0 0 1-1.41 0l-1.42-1.42a1 1 0 1 1 1.41-1.41l1.42 1.41a1 1 0 0 1 0 1.42zM8.05 16.95a1 1 0 1 1-1.41 1.41L5.22 16.95a1 1 0 1 1 1.41-1.41l1.42 1.41zM12 8a4 4 0 1 1 0 8a4 4 0 0 1 0-8z"/>
              </svg>
              Sáng
            </button>
            <button
              className={`px-3 py-2 text-sm rounded-lg flex items-center gap-2 ${themeModeState === 'dark' ? 'bg-[var(--c-primary)] text-white' : 'text-[var(--c-text)]'}`}
              onClick={() => {
                setThemeMode('dark');
                setThemeModeState('dark');
              }}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path fill="currentColor" d="M21 14.5A8.5 8.5 0 1 1 9.5 3a7 7 0 0 0 11.5 11.5z"/>
              </svg>
              Tối
            </button>
          </div>
          {!user && <NavLink to="/auth" className={linkClass}>Đăng nhập</NavLink>}
          {user && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#5B5B57] hidden md:inline">{user.email}</span>
              <button className="px-3 py-2 rounded-lg text-sm border" onClick={logout}>
                Đăng xuất
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
