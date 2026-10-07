'use client';

import React, { HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'accent' | 'outline' | 'error' | 'dark';
  className?: string;
}

export function Badge({ children, variant = 'outline', className, onClick, ...props }: BadgeProps) {
  const variantStyles = {
    accent: 'bg-[#111111] text-white border-0',
    outline: 'bg-transparent text-[#6B6B6B] border border-[#D9D6D0]',
    error: 'bg-error-red text-white border-0',
    dark: 'bg-[#111111] text-white border-0',
  };

  return (
    <span
      onClick={onClick}
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center px-2 py-0.5 text-[11px] tracking-[0.04em] uppercase rounded-none leading-none select-none',
          variantStyles[variant],
          onClick && 'cursor-pointer hover:opacity-80',
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
}
