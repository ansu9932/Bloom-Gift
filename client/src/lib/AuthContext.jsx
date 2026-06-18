import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthAPI, getToken, setToken } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount if a token exists.
  useEffect(() => {
    let active = true;
    async function bootstrap() {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const { user: me } = await AuthAPI.me();
        if (active) setUser(me);
      } catch {
        setToken(null);
      } finally {
        if (active) setLoading(false);
      }
    }
    bootstrap();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const { token, user: me } = await AuthAPI.login({ email, password });
    setToken(token);
    setUser(me);
    return me;
  }, []);

  const register = useCallback(async (username, email, password) => {
    const { token, user: me } = await AuthAPI.register({ username, email, password });
    setToken(token);
    setUser(me);
    return me;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const upgrade = useCallback(async (plan) => {
    const { user: me } = await AuthAPI.upgrade(plan);
    setUser(me);
    return me;
  }, []);

  const value = {
    user,
    loading,
    isAuthed: !!user,
    plan: user?.plan || 'free',
    login,
    register,
    logout,
    upgrade,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
