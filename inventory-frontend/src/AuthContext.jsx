import { createContext, useContext, useState } from 'react';
import { loginApi, registerApi, logoutApi } from './api.js';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });

  const login = async (identifier, password) => {
    const data = await loginApi(identifier, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };
  const register = (payload) => registerApi(payload);
  const logout = async () => {
    try { await logoutApi(); } catch { /* token may already be invalid */ }
    localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null);
  };

  return <Ctx.Provider value={{ user, isAdmin: user?.role === 'ADMIN', login, register, logout }}>{children}</Ctx.Provider>;
}
