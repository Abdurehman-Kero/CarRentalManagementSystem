import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin]     = useState(null);
  const [loading, setLoading] = useState(true); // true while verifying stored token

  // ── Verify stored token on mount ─────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setLoading(false);
      return;
    }
    api.get('/auth/me')
      .then(res => {
        const a = res.data.data;
        setAdmin({ id: a.AdminID, fullName: a.FullName, email: a.Email, role: a.Role });
      })
      .catch(() => {
        localStorage.removeItem('authToken');
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Login ─────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, admin: a } = res.data.data;
    localStorage.setItem('authToken', token);
    setAdmin(a);
    return a;
  }, []);

  // ── Logout ────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setAdmin(null);
  }, []);

  const isSuperAdmin = admin?.email === 'keroabdurehman@gmail.com';

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isSuperAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
