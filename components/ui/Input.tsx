'use client';

import React, { InputHTMLAttributes, forwardRef, useId } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  rightSlot?: React.ReactNode;
  reserveHelperSpace?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      rightSlot,
      reserveHelperSpace = false,
      className,
      id,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[13px] font-medium text-[#111111] flex items-center justify-between"
          >
            <span>{label}</span>
            {required && <span className="text-[#6B6B6B] text-[11px] font-normal">Required</span>}
          </label>
        )}
        <div className="relative w-full">
          <input
            ref={ref}
            id={inputId}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            required={required}
            className={twMerge(
              clsx(
                'w-full min-h-[48px] px-4 py-3 bg-white text-[#111111] text-[15px] border border-[#D9D6D0] hover:border-[#111111] placeholder:text-[#6B6B6B]/60 rounded-[2px] transition-colors focus:border-[#111111] focus:ring-2 focus:ring-[#111111] focus:ring-offset-2 focus:outline-none disabled:opacity-50 disabled:bg-[#FAFAF8]',
                rightSlot && 'pr-11',
                error && 'border-[#B3261E] focus:border-[#B3261E] focus:ring-[#B3261E]',
                className
              )
            )}
            {...props}
          />
          {rightSlot && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center">
              {rightSlot}
            </div>
          )}
        </div>
        {(reserveHelperSpace || error || helperText) && (
          <div className="min-h-[18px]">
            {error && (
              <p id={errorId} aria-live="polite" className="text-[12px] text-[#B3261E]">
                {error}
              </p>
            )}
            {!error && helperText && (
              <p id={helperId} className="text-[12px] text-[#6B6B6B]">
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
