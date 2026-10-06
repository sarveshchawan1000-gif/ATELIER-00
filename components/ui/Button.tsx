'use client';

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-display uppercase tracking-wider font-bold transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none min-h-[44px] rounded-none';

    const variantStyles = {
      primary: 'bg-black text-cream hover:bg-cyan hover:text-black active:bg-cyan/90 border border-black',
      secondary: 'bg-transparent text-black border border-black hover:bg-black hover:text-cream active:bg-black/90',
      ghost: 'bg-transparent text-black underline underline-offset-4 hover:bg-cyan hover:text-black border border-transparent',
      danger: 'bg-error-red text-cream hover:bg-black hover:text-cream border border-error-red',
    };

    const sizeStyles = {
      sm: 'px-4 py-2 text-xs leading-none',
      md: 'px-6 py-3.5 text-xs leading-none',
      lg: 'px-8 py-4 text-sm leading-none',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(
          clsx(
            baseStyles,
            variantStyles[variant],
            sizeStyles[size],
            fullWidth && 'w-full',
            className
          )
        )}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 currentColor"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>LOADING...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
