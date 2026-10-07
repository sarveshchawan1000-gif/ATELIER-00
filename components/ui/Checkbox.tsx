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
          className="inline-flex items-center gap-2.5 cursor-pointer select-none min-h-[44px] py-1 text-xs text-[#111111]"
        >
          <div className="relative w-4 h-4 flex items-center justify-center border border-[#D9D6D0] hover:border-[#111111] bg-white flex-shrink-0 transition-colors">
            <input
              ref={ref}
              type="checkbox"
              id={inputId}
              checked={checked}
              className="sr-only peer"
              {...props}
            />
            <div className="w-2.5 h-2.5 bg-[#111111] opacity-0 peer-checked:opacity-100 transition-opacity rounded-none" />
          </div>
          {label && <span className="leading-snug">{label}</span>}
        </label>
        {error && <p className="text-xs text-error-red pl-7">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
