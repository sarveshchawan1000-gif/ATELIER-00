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
      'inline-flex items-center justify-center font-medium text-[14px] transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none min-h-[44px] rounded-[2px] focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2';

    const variantStyles = {
      primary: 'bg-[#111111] text-white hover:bg-[#333333] active:bg-[#222222] border-0',
      secondary: 'bg-transparent text-[#111111] border border-[#111111] hover:bg-[#111111] hover:text-white active:bg-[#222222]',
      ghost: 'bg-transparent text-[#111111] hover:text-[#6B6B6B] border border-transparent underline-offset-4 hover:underline',
      danger: 'bg-error-red text-white hover:bg-black border-0',
    };

    const sizeStyles = {
      sm: 'px-4 py-2 text-[13px] leading-tight min-h-[38px]',
      md: 'px-7 py-3.5 text-[14px] leading-tight min-h-[44px]',
      lg: 'px-8 py-3.5 text-[15px] leading-tight min-h-[48px] tracking-[0.01em]',
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
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
