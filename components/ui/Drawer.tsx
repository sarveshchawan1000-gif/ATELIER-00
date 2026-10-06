'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'left' | 'right';
}

export function Drawer({ isOpen, onClose, title, children, position = 'right' }: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
          return;
        }

        if (e.key === 'Tab' && drawerRef.current) {
          const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusables.length === 0) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => drawerRef.current?.focus(), 50);

      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const positionClasses = position === 'right' ? 'right-0 border-l' : 'left-0 border-r';

  const drawerContent = (
    <div
      tabIndex={-1}
      className="fixed inset-0 z-50 flex bg-black/40 backdrop-blur-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? 'drawer-title' : undefined}
    >
      <div
        ref={drawerRef}
        className={`fixed top-0 bottom-0 ${positionClasses} w-full max-w-md bg-offwhite border-black flex flex-col z-50 shadow-2xl animate-in slide-in-from-${position} duration-200`}
      >
        <div className="flex items-center justify-between p-6 border-b border-grey">
          {title ? (
            <h2 id="drawer-title" className="font-display text-sm font-bold tracking-widest text-black uppercase">
              {title}
            </h2>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="p-2 -mr-2 text-black hover:bg-cyan hover:text-black transition-colors font-bold text-sm"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );

  return typeof window !== 'undefined' ? createPortal(drawerContent, document.body) : null;
}
