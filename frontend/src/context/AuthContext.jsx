import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { API_BASE } from '../config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadMe() {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();
        if (!cancelled) {
          if (json?.success) {
            setUser(json?.data || null);
          } else {
            localStorage.removeItem('token');
            setToken('');
            setUser(null);
          }
        }
      } catch {
        if (!cancelled) {
          localStorage.removeItem('token');
          setToken('');
          setUser(null);
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
    login: (data) => {
      const newToken = data?.token || '';
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser({
        user_id: data?.user_id,
        email: data?.email,
        user_type: data?.user_type
      });
    },
    logout: () => {
      localStorage.removeItem('token');
      setToken('');
      setUser(null);
    }
  }), [token, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
