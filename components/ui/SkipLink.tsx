'use client';

import React from 'react';

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-black focus:text-cream focus:font-display focus:text-xs focus:tracking-widest focus:uppercase"
    >
      Skip to Main Content
    </a>
  );
}
