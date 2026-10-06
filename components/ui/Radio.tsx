'use client';

import React, { InputHTMLAttributes, forwardRef, useId } from 'react';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, className, id, checked, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <label
        htmlFor={inputId}
        className="inline-flex items-center gap-3 cursor-pointer select-none min-h-[44px] py-1 text-xs font-body text-black"
      >
        <div className="relative w-5 h-5 flex items-center justify-center border border-black bg-offwhite flex-shrink-0">
          <input
            ref={ref}
            type="radio"
            id={inputId}
            checked={checked}
            className="sr-only peer"
            {...props}
          />
          <div className="w-2.5 h-2.5 bg-black opacity-0 peer-checked:opacity-100 transition-opacity rounded-none" />
        </div>
        {label && <span className="leading-snug">{label}</span>}
      </label>
    );
  }
);

Radio.displayName = 'Radio';
