'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Star, CheckCircle, XCircle, EyeOff, ShieldCheck } from 'lucide-react';

interface ReviewRecord {
  id: string;
  productName: string;
  author: string;
  rating: number;
  body: string;
  isVerified: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  createdAt: string;
}

const INITIAL_REVIEWS: ReviewRecord[] = [
  {
    id: 'rev-1',
    productName: 'OVERSIZED COTTON TEE',
    author: 'Vikram R.',
    rating: 5,
    body: 'The 320 GSM weight is extraordinary. Drapes boxy and stiff exactly as architectural streetwear should. Worth every rupee.',
    isVerified: true,
    status: 'approved',
    createdAt: '2026-10-05',
  },
  {
    id: 'rev-2',
    productName: 'HEAVYWEIGHT ZIP HOODIE',
    author: 'Ananya S.',
    rating: 5,
    body: 'Substantial French Terry with genuine heft. The hood stays structured without collapsing. Exceptional Indian craftsmanship.',
    isVerified: true,
    status: 'approved',
    createdAt: '2026-10-04',
  },
  {
    id: 'rev-3',
    productName: 'STRUCTURED TAILORED SHIRT',
    author: 'Rohan D.',
    rating: 4,
    body: 'Crisp poplin with sharp geometric collar. Slightly long on sleeve length, but tailors beautifully when tucked.',
    isVerified: true,
    status: 'pending',
    createdAt: '2026-10-06',
  },
  {
    id: 'rev-4',
    productName: 'TECHNICAL BOMBER JACKET',
    author: 'Siddharth M.',
    rating: 1,
    body: 'Suspicious spam review with external promotional url link https://spam-link.example',
    isVerified: false,
    status: 'pending',
    createdAt: '2026-10-06',
  },
];

export default function AdminReviewsPage() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<ReviewRecord[]>(INITIAL_REVIEWS);
  const [filter, setFilter] = useState<string>('all');

  const filtered = reviews.filter((r) => filter === 'all' || r.status === filter);

  const updateStatus = (id: string, newStatus: ReviewRecord['status']) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    showToast(`REVIEW MARKED AS ${newStatus.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-b-2 border-black pb-4">
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight uppercase">
          CUSTOMER REVIEW MODERATION QUEUE [{reviews.length}]
        </h1>
        <p className="font-body text-xs text-charcoal mt-1">
          Pre-publication moderation for verified customer submissions per PRD §6.9.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 font-display text-xs font-bold uppercase">
        {['all', 'pending', 'approved', 'rejected'].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3 py-1.5 border transition-colors ${
              filter === st
                ? 'bg-black text-cyan border-black'
                : 'bg-offwhite text-black border-grey hover:border-black'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Reviews Cards List */}
      <div className="space-y-4">
        {filtered.map((rev) => (
          <div
            key={rev.id}
            className="bg-offwhite border-2 border-black p-5 shadow-[4px_4px_0px_0px_#111111] space-y-4"
          >
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-grey pb-3 font-display text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-black uppercase">{rev.productName}</span>
                {rev.isVerified && (
                  <span className="bg-cyan/20 text-black border border-cyan px-2 py-0.5 text-[10px] flex items-center gap-1 font-bold">
                    <ShieldCheck className="w-3 h-3 text-black" /> VERIFIED ORDER
                  </span>
                )}
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                    rev.status === 'approved'
                      ? 'bg-green-700 text-cream'
                      : rev.status === 'pending'
                      ? 'bg-yellow-300 text-black'
                      : 'bg-error-red text-cream'
                  }`}
                >
                  {rev.status}
                </span>
              </div>
              <div className="text-charcoal font-body text-xs">
                By {rev.author} on {rev.createdAt}
              </div>
            </div>

            {/* Rating Stars & Body */}
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-black">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rev.rating ? 'fill-black text-black' : 'text-grey'
                    }`}
                  />
                ))}
              </div>
              <p className="font-body text-xs md:text-sm text-charcoal leading-relaxed">
                {rev.body}
              </p>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-grey flex items-center justify-end gap-2 font-display text-xs font-bold uppercase">
              {rev.status !== 'approved' && (
                <button
                  onClick={() => updateStatus(rev.id, 'approved')}
                  className="px-3 py-1.5 bg-black text-cyan hover:bg-cyan hover:text-black transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> APPROVE & PUBLISH
                </button>
              )}
              {rev.status !== 'rejected' && (
                <button
                  onClick={() => updateStatus(rev.id, 'rejected')}
                  className="px-3 py-1.5 border border-error-red text-error-red hover:bg-error-red hover:text-cream transition-colors flex items-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" /> REJECT
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
