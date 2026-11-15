'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/common/Button';

export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authModalTab, setAuthModalTab, login, register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setSubmitting(true);
    try {
      const res =
        authModalTab === 'login'
          ? await login(email, password)
          : await register(firstName, lastName, email, password);

      if (!res?.success) {
        setAuthError(res?.error || 'Authentication failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#5B4752]/70 backdrop-blur-xs"
        onClick={() => setIsAuthModalOpen(false)}
      />

      <div
        role="dialog"
        aria-labelledby="auth-modal-title"
        className="relative bg-white rounded-[28px] w-full max-w-[460px] p-6 sm:p-8 shadow-[0_40px_80px_-30px_rgba(20,8,14,0.6)] z-10 flex flex-col gap-5 animate-in zoom-in-95 duration-200"
      >
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="icb absolute right-4 top-4"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-brand-dark" />
        </button>

        <h2 id="auth-modal-title" className="d text-[30px] text-brand-dark m-0">
          {authModalTab === 'login' ? (
            <>
              Welcome <span className="s text-brand-rose font-normal">back</span>
            </>
          ) : (
            <>
              Create <span className="s text-brand-rose font-normal">account</span>
            </>
          )}
        </h2>

        {/* Tab switcher: Sign in / Create account */}
        <div role="tablist" className="grid grid-cols-2 bg-[#F8F1F3] rounded-full p-1">
          <button
            type="button"
            role="tab"
            aria-selected={authModalTab === 'login'}
            onClick={() => {
              setAuthModalTab('login');
              setAuthError('');
            }}
            className={`h-10 rounded-full font-bold text-[14px] transition-all ${
              authModalTab === 'login'
                ? 'bg-white text-brand-dark shadow-xs'
                : 'text-brand-muted hover:text-brand-dark'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={authModalTab === 'register'}
            onClick={() => {
              setAuthModalTab('register');
              setAuthError('');
            }}
            className={`h-10 rounded-full font-semibold text-[14px] transition-all ${
              authModalTab === 'register'
                ? 'bg-white text-brand-dark shadow-xs'
                : 'text-brand-muted hover:text-brand-dark'
            }`}
          >
            Create account
          </button>
        </div>

        {authError && (
          <div className="p-3 rounded-xl bg-brand-roseLight border border-brand-rose/30 text-[13px] font-medium text-[#A3244B]">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {authModalTab === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-semibold text-brand-dark mb-1">First name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full h-[50px] border border-brand-borderDark rounded-xl px-4 text-[15px] outline-none focus:border-brand-rose"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-brand-dark mb-1">Last name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full h-[50px] border border-brand-borderDark rounded-xl px-4 text-[15px] outline-none focus:border-brand-rose"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[13px] font-semibold text-brand-dark mb-1">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-[50px] border border-brand-borderDark rounded-xl px-4 text-[15px] outline-none focus:border-brand-rose"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-brand-dark mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-[50px] border border-brand-borderDark rounded-xl px-4 text-[15px] outline-none focus:border-brand-rose"
            />
          </div>

          <div className="flex items-center justify-between text-[14px]">
            <label className="flex items-center gap-2 cursor-pointer select-none text-brand-dark">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-brand-rose rounded cursor-pointer"
              />
              <span>Remember me</span>
            </label>
          </div>

          <Button type="submit" variant="primary" disabled={submitting} className="w-full !h-[50px] mt-1">
            {submitting
              ? authModalTab === 'login'
                ? 'Signing in...'
                : 'Creating account...'
              : authModalTab === 'login'
              ? 'Sign in'
              : 'Create account'}
          </Button>
        </form>
      </div>
    </div>
  );
};
