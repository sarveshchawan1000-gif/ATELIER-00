'use client';

import React, { InputHTMLAttributes, forwardRef, useId } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, required, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="font-display text-[11px] font-bold tracking-widest text-charcoal uppercase flex items-center gap-1"
          >
            {label}
            {required && <span className="text-error-red">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          required={required}
          className={twMerge(
            clsx(
              'w-full min-h-[44px] px-4 py-3 bg-offwhite text-black text-sm font-body border border-black placeholder:text-charcoal/50 rounded-none transition-colors focus:bg-offwhite',
              error && 'border-error-red focus:border-error-red',
              className
            )
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-xs font-body text-error-red font-medium flex items-center gap-1">
            <span aria-hidden="true">⚠</span>
            <span>{error}</span>
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-xs font-body text-charcoal/80">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
