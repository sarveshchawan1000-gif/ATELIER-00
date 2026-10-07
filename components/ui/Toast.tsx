'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface ToastMessage {
  id: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastContextType {
  showToast: (message: string, actionLabel?: string, onAction?: () => void) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, actionLabel?: string, onAction?: () => void) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, actionLabel, onAction }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        id="__toast"
        aria-live="polite"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none max-w-md w-full px-4"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-[#111111] text-[#FAFAF8] px-5 py-3 text-xs font-normal flex items-center justify-between shadow-lg border border-[#333333] rounded-none animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            <span>{toast.message}</span>
            {toast.actionLabel && (
              <button
                onClick={() => {
                  toast.onAction?.();
                  setToasts((prev) => prev.filter((t) => t.id !== toast.id));
                }}
                className="ml-4 text-xs font-normal text-white hover:text-white/80 underline"
              >
                {toast.actionLabel}
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
