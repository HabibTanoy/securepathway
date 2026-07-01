import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, clearTokens } from '../lib/api';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('sp_at');
    if (!token) { setLoading(false); return; }
    authAPI.me()
      .then(u => setUser(u))
      .catch(() => clearTokens())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password, mfaToken = null) => {
    const data = await authAPI.login({ email, password, ...(mfaToken ? { mfaToken } : {}) });
    if (data.mfaRequired && !mfaToken) return { mfaRequired: true, userId: data.userId };
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (fields) => {
    const data = await authAPI.register(fields);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await authAPI.logout();
    setUser(null);
  }, []);

  const updateUser = useCallback(u => setUser(prev => ({ ...prev, ...u })), []);

  return (
    <AuthCtx.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
