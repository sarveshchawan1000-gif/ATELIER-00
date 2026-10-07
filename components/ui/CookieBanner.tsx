'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './Button';

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('brand_cookie_consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('brand_cookie_consent', 'accepted');
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem('brand_cookie_consent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Cookie Preferences Banner"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white text-[#111111] border-t border-[#E8E6E1] p-4 md:p-6 shadow-lg animate-in slide-in-from-bottom duration-300"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1 pr-4">
          <h3 className="text-xs font-medium uppercase tracking-[0.04em] text-[#111111] mb-1">
            Privacy & Cookie Preferences
          </h3>
          <p className="text-xs text-[#6B6B6B] leading-relaxed">
            We use essential cookies to maintain your shopping bag and security session. Read our{' '}
            <a href="/privacy" className="underline hover:text-[#111111]">
              Privacy Policy
            </a>
            .
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="secondary" size="sm" onClick={handleDecline}>
            Decline
          </Button>
          <Button variant="primary" size="sm" onClick={handleAccept}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
