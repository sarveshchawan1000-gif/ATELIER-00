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
    accent: 'bg-cyan text-black font-bold border border-cyan',
    outline: 'bg-offwhite text-charcoal border border-grey',
    error: 'bg-error-red text-cream font-bold border border-error-red',
    dark: 'bg-black text-cream font-bold border border-black',
  };

  return (
    <span
      onClick={onClick}
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center px-2 py-0.5 font-display text-[10px] tracking-widest uppercase rounded-none leading-none select-none',
          variantStyles[variant],
          onClick && 'cursor-pointer hover:opacity-90',
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
}
