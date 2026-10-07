'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CONFIG } from '@/lib/config';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { Package, Heart, MapPin, Eye, EyeOff } from 'lucide-react';

type AuthView = 'login' | 'register' | 'forgot';

export default function AccountPage() {
  const [view, setView] = useState<AuthView>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  // Form state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [forgotForm, setForgotForm] = useState({ email: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('LOGIN FEATURE REQUIRES SUPABASE AUTH CONFIG');
    }, 400);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('REGISTRATION REQUIRES SUPABASE AUTH CONFIG');
    }, 400);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('PASSWORD RESET EMAIL SENT (DEMO)');
      setView('login');
    }, 400);
  };

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-20 md:pb-24 px-6 bg-[#FAFAF8]">
      <div className="max-w-[1140px] mx-auto min-h-[calc(100vh-14rem)] flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Form */}
          <div className="w-full max-w-[440px] mx-auto lg:mx-0 lg:col-span-6 flex flex-col justify-center">
            {view === 'login' && (
              <div className="flex flex-col">
                <div>
                  <h1 className="text-[28px] md:text-[32px] font-medium text-[#111111] tracking-[-0.01em]">
                    Sign in
                  </h1>
                  <p className="text-[14px] text-[#6B6B6B] mt-2">
                    Access your account, orders and saved items.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="mt-8 flex flex-col space-y-6">
                  <Input
                    label="Email address"
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                  />

                  <div>
                    <Input
                      label="Password"
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                      rightSlot={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-[#6B6B6B] hover:text-[#111111] transition-colors p-1"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                          ) : (
                            <Eye className="w-4 h-4" strokeWidth={1.5} />
                          )}
                        </button>
                      }
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => setView('forgot')}
                        className="text-[13px] text-[#6B6B6B] hover:text-[#111111] hover:underline transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      isLoading={isSubmitting}
                    >
                      {isSubmitting ? 'Signing in…' : 'Sign in'}
                    </Button>
                  </div>
                </form>

                <div className="relative flex items-center my-6">
                  <div className="flex-1 border-t border-[#E8E6E1]" />
                  <span className="px-4 text-[13px] text-[#8A8A8A]">
                    New to {CONFIG.brandName}?
                  </span>
                  <div className="flex-1 border-t border-[#E8E6E1]" />
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={() => setView('register')}
                >
                  Create an account
                </Button>

                <div className="mt-6 flex flex-col items-center text-center gap-3">
                  <p className="text-[12px] text-[#6B6B6B] leading-relaxed">
                    By signing in you agree to our{' '}
                    <Link href="/terms" className="underline hover:text-[#111111] transition-colors">
                      Terms & Conditions
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="underline hover:text-[#111111] transition-colors">
                      Privacy Policy
                    </Link>
                    .
                  </p>

                  <Link
                    href="/account/orders/BRD-2026-981245"
                    className="text-[13px] text-[#6B6B6B] hover:text-[#111111] hover:underline transition-colors inline-flex items-center gap-1"
                  >
                    <span>Track an order</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            )}

            {view === 'register' && (
              <div className="flex flex-col">
                <div>
                  <h1 className="text-[28px] md:text-[32px] font-medium text-[#111111] tracking-[-0.01em]">
                    Create account
                  </h1>
                  <p className="text-[14px] text-[#6B6B6B] mt-2">
                    Join {CONFIG.brandName} for a curated fashion experience.
                  </p>
                </div>

                <form onSubmit={handleRegister} className="mt-8 flex flex-col space-y-6">
                  <Input
                    label="Full name"
                    id="register-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Jane Doe"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    required
                  />

                  <Input
                    label="Email address"
                    id="register-email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    required
                  />

                  <Input
                    label="Phone number"
                    id="register-phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+91 98765 43210"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                    required
                  />

                  <Input
                    label="Password"
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    required
                    rightSlot={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[#6B6B6B] hover:text-[#111111] transition-colors p-1"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                        ) : (
                          <Eye className="w-4 h-4" strokeWidth={1.5} />
                        )}
                      </button>
                    }
                  />

                  <p className="text-[12px] text-[#6B6B6B] leading-relaxed">
                    By creating an account, you agree to our{' '}
                    <Link href="/terms" className="underline hover:text-[#111111] transition-colors">
                      Terms & Conditions
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="underline hover:text-[#111111] transition-colors">
                      Privacy Policy
                    </Link>
                    .
                  </p>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      isLoading={isSubmitting}
                    >
                      {isSubmitting ? 'Creating account…' : 'Create account'}
                    </Button>
                  </div>
                </form>

                <div className="relative flex items-center my-6">
                  <div className="flex-1 border-t border-[#E8E6E1]" />
                  <span className="px-4 text-[13px] text-[#8A8A8A]">
                    Already have an account?
                  </span>
                  <div className="flex-1 border-t border-[#E8E6E1]" />
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={() => setView('login')}
                >
                  Sign in
                </Button>

                <div className="mt-6 flex justify-center">
                  <Link
                    href="/account/orders/BRD-2026-981245"
                    className="text-[13px] text-[#6B6B6B] hover:text-[#111111] hover:underline transition-colors inline-flex items-center gap-1"
                  >
                    <span>Track an order</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            )}

            {view === 'forgot' && (
              <div className="flex flex-col">
                <div>
                  <h1 className="text-[28px] md:text-[32px] font-medium text-[#111111] tracking-[-0.01em]">
                    Reset password
                  </h1>
                  <p className="text-[14px] text-[#6B6B6B] mt-2">
                    Enter your email address and we&apos;ll send you a link to reset your password.
                  </p>
                </div>

                <form onSubmit={handleForgot} className="mt-8 flex flex-col space-y-6">
                  <Input
                    label="Email address"
                    id="forgot-email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={forgotForm.email}
                    onChange={(e) => setForgotForm({ ...forgotForm, email: e.target.value })}
                    required
                  />

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      isLoading={isSubmitting}
                    >
                      {isSubmitting ? 'Sending link…' : 'Send reset link'}
                    </Button>
                  </div>
                </form>

                <div className="relative flex items-center my-6">
                  <div className="flex-1 border-t border-[#E8E6E1]" />
                  <span className="px-4 text-[13px] text-[#8A8A8A]">
                    Remember your password?
                  </span>
                  <div className="flex-1 border-t border-[#E8E6E1]" />
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={() => setView('login')}
                >
                  Back to sign in
                </Button>

                <div className="mt-6 flex justify-center">
                  <Link
                    href="/account/orders/BRD-2026-981245"
                    className="text-[13px] text-[#6B6B6B] hover:text-[#111111] hover:underline transition-colors inline-flex items-center gap-1"
                  >
                    <span>Track an order</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Editorial Image Panel */}
          <div className="hidden lg:block lg:col-span-6 h-full">
            <div className="relative w-full aspect-[4/5] min-h-[580px] max-h-[680px] overflow-hidden rounded-[2px]">
              <Image
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop&q=85"
                alt="Editorial fashion preview"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/[0.08]" />

              {/* Frosted Caption Card at bottom */}
              <div className="absolute inset-x-6 bottom-6 bg-[#FAFAF8]/95 backdrop-blur-md p-6 sm:p-7 border border-[#E8E6E1] rounded-[2px] shadow-sm">
                <h2 className="text-[19px] font-medium text-[#111111] tracking-[-0.01em] mb-4">
                  Your wardrobe, saved.
                </h2>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-[13px] text-[#6B6B6B]">
                    <Package className="w-4 h-4 text-[#111111] flex-shrink-0" strokeWidth={1.5} />
                    <span>Track every order, from dispatch to delivery</span>
                  </li>
                  <li className="flex items-center gap-3 text-[13px] text-[#6B6B6B]">
                    <Heart className="w-4 h-4 text-[#111111] flex-shrink-0" strokeWidth={1.5} />
                    <span>Save favourites and get drop alerts</span>
                  </li>
                  <li className="flex items-center gap-3 text-[13px] text-[#6B6B6B]">
                    <MapPin className="w-4 h-4 text-[#111111] flex-shrink-0" strokeWidth={1.5} />
                    <span>Faster checkout with saved addresses across India</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
