import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

function parseJwtPayload(token) {
  try {
    const raw = String(token || '').trim();
    if (!raw) return null;
    const parts = raw.split('.');
    if (parts.length !== 3) return null;

    const normalized = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4 || 4)) % 4);
    const decoded = atob(padded);
    const payload = JSON.parse(decoded);
    return payload && typeof payload === 'object' ? payload : null;
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  const payload = parseJwtPayload(token);
  const exp = Number(payload?.exp || 0);
  if (!Number.isFinite(exp) || exp <= 0) return false;
  // Grace period 30s to avoid edge-case race around expiration time.
  return exp * 1000 <= Date.now() + 30_000;
}

function persistAuthSession(payload) {
  const token = String(payload?.token || '').trim();
  const userId = payload?.user_id;
  if (!token || !userId) return;

  const snapshot = {
    token,
    user: {
      user_id: userId,
      username: payload?.username || payload?.email || '',
      email: payload?.email || '',
      user_type: payload?.user_type || 'high_school'
    },
    savedAt: Date.now()
  };

  try {
    localStorage.setItem('token', token);
    localStorage.setItem('auth:session', JSON.stringify(snapshot));
  } catch {
    // ignore storage failures
  }
}

function clearAuthSession() {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('auth:session');
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      const rawSnapshot = localStorage.getItem('auth:session');
      const parsedSnapshot = rawSnapshot ? JSON.parse(rawSnapshot) : null;
      const fromSnapshot = String(parsedSnapshot?.token || '').trim();
      const hasSnapshotUser = Boolean(parsedSnapshot?.user?.user_id);
      const candidate = hasSnapshotUser ? fromSnapshot : '';
      if (!candidate) return '';

      if (isTokenExpired(candidate)) {
        clearAuthSession();
        return '';
      }

      return candidate;
    } catch {
      return '';
    }
  });
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('auth:session');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed?.user?.user_id) return null;
      return parsed.user;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from token on mount or token change
  useEffect(() => {
    let cancelled = false;
    
    async function loadMe() {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      if (isTokenExpired(token)) {
        clearAuthSession();
        setToken('');
        setUser(null);
        setError('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
        setLoading(false);
        return;
      }
      
      try {
        const json = await api.me(token);
        if (!cancelled) {
          if (json?.success && json?.data) {
            setUser(json.data);
            setError(null);
          } else {
            const status = Number(json?.status || 0);
            const networkLike = !status || json?.network_error;

            if (networkLike) {
              // Keep current local session so reload does not force logout when backend is temporarily unreachable.
              setError('Không thể kết nối máy chủ xác thực. Đang giữ phiên đăng nhập cục bộ.');
            } else {
              // Token invalid/expired -> clear local session
              console.log('[AuthContext] Token invalid, clearing');
              clearAuthSession();
              setToken('');
              setUser(null);
              setError('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
            }
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.log('[AuthContext] API error:', err);
          // Keep current session on network errors to avoid losing login state on page reload.
          const status = Number(err?.status || 0);
          const networkLike = !status || err?.network_error;
          if (networkLike) {
            setError('Không thể kết nối máy chủ xác thực. Đang giữ phiên đăng nhập cục bộ.');
          } else {
            setError('Không thể kết nối máy chủ xác thực');
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    
    loadMe();
    return () => { cancelled = true; };
  }, [token]);

  const value = useMemo(() => ({
    token,
    user,
    loading,
    error,
    login: (data) => {
      const newToken = data?.token || '';
      if (newToken) {
        persistAuthSession(data);
      }
      setToken(newToken);
      
      // Set user immediately from login response (don't wait for api.me)
      if (data?.user_id) {
        setUser({
          user_id: data.user_id,
          username: data.username || data.email,
          email: data.email,
          user_type: data.user_type
        });
        setError(null);
      }
    },
    logout: () => {
      clearAuthSession();
      setToken('');
      setUser(null);
      setError(null);
    }
  }), [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
