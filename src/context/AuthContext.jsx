'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { safeStorage } from '@/utils/storage';
import { api } from '@/api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // Clean up any legacy demo/mock storage entries from previous sessions
    safeStorage.removeItem('abf_local_orders');
    const saved = safeStorage.getJSON('abf_user', null);
    if (saved && typeof saved === 'object' && saved.id && saved.id !== 'user_demo_01') {
      setUser(saved);
    } else if (saved) {
      safeStorage.removeItem('abf_user');
    }
    setAuthReady(true);
  }, []);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register'

  useEffect(() => {
    if (!authReady) return;
    if (user) {
      safeStorage.setJSON('abf_user', user);
    } else {
      safeStorage.removeItem('abf_user');
    }
  }, [user, authReady]);

  const login = async (email, password) => {
    const res = await api.loginUser({ email, password });
    if (res.success && res.user) {
      setUser(res.user);
      setIsAuthModalOpen(false);
    }
    return res;
  };

  const register = async (firstName, lastName, email, password) => {
    const res = await api.registerUser({ firstName, lastName, email, password });
    if (res.success && res.user) {
      setUser(res.user);
      setIsAuthModalOpen(false);
    }
    return res;
  };

  const updateProfile = async (updates) => {
    if (!user?.id) {
      return { success: false, error: 'Please log in to update your profile.' };
    }
    const res = await api.updateUserProfile(user.id, updates);
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    setUser(null);
    safeStorage.removeItem('abf_user');
  };

  const openLoginModal = () => {
    setAuthModalTab('login');
    setIsAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthModalTab('register');
    setIsAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        isAuthenticated: !!user,
        login,
        register,
        updateProfile,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        openLoginModal,
        openRegisterModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
