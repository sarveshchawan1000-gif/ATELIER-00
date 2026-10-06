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
      aria-label="Cookie Consent Banner"
      className="fixed bottom-0 left-0 right-0 z-40 bg-black text-cream border-t border-cyan p-4 md:p-6 shadow-2xl animate-in slide-in-from-bottom duration-300"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1 pr-4">
          <h3 className="font-display text-xs font-bold tracking-widest uppercase text-cyan mb-1">
            Privacy & Cookie Preferences
          </h3>
          <p className="font-body text-xs text-cream/90 leading-relaxed">
            We use essential cookies to maintain your shopping bag and security session. Non-essential performance and analytics cookies help us refine the exhibition experience only with your consent. Read our{' '}
            <a href="/privacy" className="underline hover:text-cyan">
              Privacy Policy
            </a>
            .
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="secondary" size="sm" onClick={handleDecline} className="text-cream border-cream hover:bg-cream hover:text-black">
            DECLINE
          </Button>
          <Button variant="primary" size="sm" onClick={handleAccept} className="bg-cyan text-black hover:bg-cream">
            ACCEPT ALL
          </Button>
        </div>
      </div>
    </div>
  );
}
