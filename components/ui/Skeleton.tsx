'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SkeletonProps {
  className?: string;
  aspectRatio?: '4/5' | '1/1' | 'auto';
}

export function Skeleton({ className, aspectRatio }: SkeletonProps) {
  const aspectClasses = {
    '4/5': 'aspect-[4/5]',
    '1/1': 'aspect-square',
    auto: '',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'bg-grey/40 animate-pulse rounded-none',
          aspectRatio && aspectClasses[aspectRatio],
          className
        )
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 w-full border border-grey/30 bg-offwhite p-3">
      <Skeleton aspectRatio="4/5" className="w-full" />
      <div className="flex flex-col gap-1.5 pt-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-4 w-1/3 mt-1" />
      </div>
    </div>
  );
}
