'use client';

import React, { SelectHTMLAttributes, forwardRef, useId } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className, id, required, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="font-display text-[11px] font-bold tracking-widest text-charcoal uppercase flex items-center gap-1"
          >
            {label}
            {required && <span className="text-error-red">*</span>}
          </label>
        )}
        <div className="relative w-full">
          <select
            ref={ref}
            id={selectId}
            required={required}
            className={twMerge(
              clsx(
                'w-full min-h-[44px] px-4 py-3 bg-offwhite text-black text-sm font-body border border-black rounded-none appearance-none cursor-pointer pr-10',
                error && 'border-error-red',
                className
              )
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black font-bold text-xs">
            ▼
          </div>
        </div>
        {error && <p className="text-xs text-error-red font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
