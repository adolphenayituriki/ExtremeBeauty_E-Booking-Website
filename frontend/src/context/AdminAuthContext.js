import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAdmin, setAuth, clearAuth, getToken } from '../utils/adminApi';
import { requestJson } from '../utils/adminApi';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const stored = getAdmin();
    if (token && stored) {
      setAdmin(stored);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const json = await requestJson('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuth(json.data.token, json.data);
    setAdmin(json.data);
    return json.data;
  };

  const requestOtp = async (email, password) => {
    const json = await requestJson('/api/admin/otp/request', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return json;
  };

  const verifyOtp = async (email, code) => {
    const json = await requestJson('/api/admin/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
    setAuth(json.data.token, json.data);
    setAdmin(json.data);
    return json.data;
  };

  const logout = () => {
    clearAuth();
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, setAdmin, login, requestOtp, verifyOtp, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
