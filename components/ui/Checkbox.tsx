'use client';

import React, { InputHTMLAttributes, forwardRef, useId } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, id, checked, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={inputId}
          className="inline-flex items-center gap-3 cursor-pointer select-none min-h-[44px] py-1 text-xs font-body text-black"
        >
          <div className="relative w-5 h-5 flex items-center justify-center border border-black bg-offwhite flex-shrink-0">
            <input
              ref={ref}
              type="checkbox"
              id={inputId}
              checked={checked}
              className="sr-only peer"
              {...props}
            />
            <div className="w-3 h-3 bg-black opacity-0 peer-checked:opacity-100 transition-opacity rounded-none" />
          </div>
          {label && <span className="leading-snug">{label}</span>}
        </label>
        {error && <p className="text-xs text-error-red font-medium pl-8">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
