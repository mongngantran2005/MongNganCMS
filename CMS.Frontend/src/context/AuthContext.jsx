import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [customerInfo, setCustomerInfo] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('customerInfo')) || null;
    } catch {
      return null;
    }
  });

  const login = (info) => {
    localStorage.setItem('customerInfo', JSON.stringify(info));
    setCustomerInfo(info);
    window.dispatchEvent(new Event('storage'));
  };

  const logout = () => {
    localStorage.removeItem('customerInfo');
    setCustomerInfo(null);
    window.dispatchEvent(new Event('storage'));
  };

  const updateInfo = (info) => {
    const updated = { ...customerInfo, ...info };
    localStorage.setItem('customerInfo', JSON.stringify(updated));
    setCustomerInfo(updated);
  };

  // Sync giữa các tab
  useEffect(() => {
    const handler = () => {
      const stored = localStorage.getItem('customerInfo');
      setCustomerInfo(stored ? JSON.parse(stored) : null);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <AuthContext.Provider value={{ customerInfo, login, logout, updateInfo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải được dùng trong AuthProvider');
  return ctx;
}

export default AuthContext;
