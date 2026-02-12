import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      const stored = localStorage.getItem('token');
      return stored && stored.trim() !== '' ? stored : '';
    } catch {
      return '';
    }
  });
  const [user, setUser] = useState(null);
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
      
      try {
        const json = await api.me(token);
        if (!cancelled) {
          if (json?.success && json?.data) {
            setUser(json.data);
            setError(null);
          } else {
            // Token invalid - clear it
            console.log('[AuthContext] Token invalid, clearing');
            localStorage.removeItem('token');
            setToken('');
            setUser(null);
            setError('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.log('[AuthContext] API error:', err);
          // Don't immediately clear token on network error - might be temporary
          setError('Không thể kết nối máy chủ xác thực');
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
        try {
          localStorage.setItem('token', newToken);
        } catch (e) {
          console.error('[AuthContext] Failed to save token:', e);
        }
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
      try {
        localStorage.removeItem('token');
      } catch (e) {
        console.error('[AuthContext] Failed to clear token:', e);
      }
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
