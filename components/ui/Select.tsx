'use client';

import React, { SelectHTMLAttributes, forwardRef, useId } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChevronDown } from 'lucide-react';

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
            className="text-[12px] font-medium text-[#111111] flex items-center gap-1"
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
                'w-full min-h-[44px] px-3.5 py-2.5 bg-white text-[#111111] text-[13px] border border-[#E8E6E1] hover:border-[#111111] rounded-none appearance-none cursor-pointer pr-10 focus:outline-none focus:border-black transition-colors',
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
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#111111]">
            <ChevronDown className="w-4 h-4 stroke-[1.5]" />
          </div>
        </div>
        {error && <p className="text-xs text-error-red">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
