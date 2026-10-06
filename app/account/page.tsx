'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CONFIG } from '@/lib/config';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { User, Package, Heart, MapPin, LogIn, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

type AuthView = 'login' | 'register' | 'forgot';

export default function AccountPage() {
  const [view, setView] = useState<AuthView>('login');
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToast();

  // Form state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [forgotForm, setForgotForm] = useState({ email: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('LOGIN FEATURE REQUIRES SUPABASE AUTH CONFIG');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('REGISTRATION REQUIRES SUPABASE AUTH CONFIG');
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('PASSWORD RESET EMAIL SENT (DEMO)');
    setView('login');
  };

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left: Auth Form */}
        <div className="flex flex-col">
          {view === 'login' && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tighter uppercase">
                  SIGN IN
                </h1>
                <p className="font-body text-sm text-charcoal mt-2">
                  Access your account, orders, and saved items.
                </p>
              </div>

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal pointer-events-none" />
                  <Input
                    type="email"
                    placeholder="EMAIL ADDRESS"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal pointer-events-none" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="PASSWORD"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal hover:text-black"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setView('forgot')}
                    className="font-display text-[11px] tracking-wider text-charcoal hover:text-cyan underline uppercase"
                  >
                    FORGOT PASSWORD?
                  </button>
                </div>

                <Button type="submit" variant="primary" size="lg" fullWidth>
                  <LogIn className="w-4 h-4 mr-2" />
                  SIGN IN
                </Button>
              </form>

              <div className="relative flex items-center my-2">
                <div className="flex-1 border-t border-grey" />
                <span className="px-4 font-display text-[10px] tracking-widest text-charcoal uppercase">
                  NEW HERE?
                </span>
                <div className="flex-1 border-t border-grey" />
              </div>

              <Button variant="ghost" size="lg" fullWidth onClick={() => setView('register')}>
                CREATE AN ACCOUNT
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {view === 'register' && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tighter uppercase">
                  CREATE ACCOUNT
                </h1>
                <p className="font-body text-sm text-charcoal mt-2">
                  Join {CONFIG.brandName} for a curated fashion experience.
                </p>
              </div>

              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <Input
                  placeholder="FULL NAME *"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  required
                />
                <Input
                  type="email"
                  placeholder="EMAIL ADDRESS *"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  required
                />
                <Input
                  type="tel"
                  placeholder="PHONE NUMBER *"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  required
                />
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="CREATE PASSWORD *"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal hover:text-black"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <p className="font-body text-[11px] text-charcoal">
                  By creating an account, you agree to our{' '}
                  <Link href="/terms" className="underline hover:text-cyan">Terms & Conditions</Link> and{' '}
                  <Link href="/privacy" className="underline hover:text-cyan">Privacy Policy</Link>.
                </p>

                <Button type="submit" variant="primary" size="lg" fullWidth>
                  CREATE ACCOUNT
                </Button>
              </form>

              <button
                onClick={() => setView('login')}
                className="font-display text-xs tracking-wider text-charcoal hover:text-cyan underline uppercase text-center"
              >
                ALREADY HAVE AN ACCOUNT? SIGN IN
              </button>
            </div>
          )}

          {view === 'forgot' && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tighter uppercase">
                  RESET PASSWORD
                </h1>
                <p className="font-body text-sm text-charcoal mt-2">
                  Enter your email and we&apos;ll send you a magic link to reset your password.
                </p>
              </div>

              <form onSubmit={handleForgot} className="flex flex-col gap-4">
                <Input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  value={forgotForm.email}
                  onChange={(e) => setForgotForm({ ...forgotForm, email: e.target.value })}
                  required
                />
                <Button type="submit" variant="primary" size="lg" fullWidth>
                  SEND RESET LINK
                </Button>
              </form>

              <button
                onClick={() => setView('login')}
                className="font-display text-xs tracking-wider text-charcoal hover:text-cyan underline uppercase text-center"
              >
                BACK TO SIGN IN
              </button>
            </div>
          )}
        </div>

        {/* Right: Benefits Panel */}
        <div className="bg-black text-cream p-8 md:p-12 flex flex-col justify-center gap-8">
          <h2 className="font-display text-2xl font-bold tracking-tighter uppercase text-cyan">
            WHY {CONFIG.brandName}?
          </h2>

          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 border border-cyan flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-cyan" />
              </div>
              <div>
                <h3 className="font-display text-xs font-bold tracking-widest uppercase mb-1">
                  ORDER TRACKING
                </h3>
                <p className="font-body text-xs text-grey leading-relaxed">
                  Real-time tracking and updates on every order from dispatch to delivery.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 border border-cyan flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-cyan" />
              </div>
              <div>
                <h3 className="font-display text-xs font-bold tracking-widest uppercase mb-1">
                  SAVED WISHLIST
                </h3>
                <p className="font-body text-xs text-grey leading-relaxed">
                  Save your favourites and get notified when they drop or go on sale.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 border border-cyan flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-cyan" />
              </div>
              <div>
                <h3 className="font-display text-xs font-bold tracking-widest uppercase mb-1">
                  SAVED ADDRESSES
                </h3>
                <p className="font-body text-xs text-grey leading-relaxed">
                  Faster checkout with your saved delivery addresses across India.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 border border-cyan flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-cyan" />
              </div>
              <div>
                <h3 className="font-display text-xs font-bold tracking-widest uppercase mb-1">
                  EXCLUSIVE ACCESS
                </h3>
                <p className="font-body text-xs text-grey leading-relaxed">
                  Early access to new drops and member-only editorial pieces.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Tracking / Admin Jump */}
          <div className="pt-6 border-t border-grey/30 flex flex-col gap-3 font-display text-xs">
            <span className="text-cyan font-bold tracking-wider uppercase">
              LOOKING FOR AN EXISTING DISPATCH?
            </span>
            <Link
              href="/account/orders/BRD-2026-981245"
              className="text-cream hover:text-cyan underline uppercase flex items-center justify-between"
            >
              <span>TRACK LIVE ORDER #BRD-2026-981245</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
