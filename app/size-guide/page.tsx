'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Ruler, Sparkles } from 'lucide-react';

type Unit = 'cm' | 'in';

interface SizeRow {
  size: string;
  chest: [number, number]; // [cm, in]
  shoulder: [number, number];
  length: [number, number];
  sleeve: [number, number];
}

const TEE_SIZES: SizeRow[] = [
  { size: 'XS', chest: [106, 41.7], shoulder: [52, 20.5], length: [71, 28.0], sleeve: [23, 9.1] },
  { size: 'S', chest: [112, 44.1], shoulder: [54, 21.3], length: [73, 28.7], sleeve: [24, 9.4] },
  { size: 'M', chest: [118, 46.5], shoulder: [56, 22.0], length: [75, 29.5], sleeve: [25, 9.8] },
  { size: 'L', chest: [124, 48.8], shoulder: [58, 22.8], length: [77, 30.3], sleeve: [26, 10.2] },
  { size: 'XL', chest: [130, 51.2], shoulder: [60, 23.6], length: [79, 31.1], sleeve: [27, 10.6] },
  { size: 'XXL', chest: [136, 53.5], shoulder: [62, 24.4], length: [81, 31.9], sleeve: [28, 11.0] },
];

const HOODIE_SIZES: SizeRow[] = [
  { size: 'XS', chest: [116, 45.7], shoulder: [56, 22.0], length: [67, 26.4], sleeve: [62, 24.4] },
  { size: 'S', chest: [122, 48.0], shoulder: [58, 22.8], length: [69, 27.2], sleeve: [63, 24.8] },
  { size: 'M', chest: [128, 50.4], shoulder: [60, 23.6], length: [71, 28.0], sleeve: [64, 25.2] },
  { size: 'L', chest: [134, 52.8], shoulder: [62, 24.4], length: [73, 28.7], sleeve: [65, 25.6] },
  { size: 'XL', chest: [140, 55.1], shoulder: [64, 25.2], length: [75, 29.5], sleeve: [66, 26.0] },
  { size: 'XXL', chest: [146, 57.5], shoulder: [66, 26.0], length: [77, 30.3], sleeve: [67, 26.4] },
];

const SHIRT_SIZES: SizeRow[] = [
  { size: 'S', chest: [108, 42.5], shoulder: [49, 19.3], length: [74, 29.1], sleeve: [64, 25.2] },
  { size: 'M', chest: [114, 44.9], shoulder: [51, 20.1], length: [76, 29.9], sleeve: [65, 25.6] },
  { size: 'L', chest: [120, 47.2], shoulder: [53, 20.9], length: [78, 30.7], sleeve: [66, 26.0] },
  { size: 'XL', chest: [126, 49.6], shoulder: [55, 21.7], length: [80, 31.5], sleeve: [67, 26.4] },
];

interface TrouserRow {
  size: string;
  waist: [number, number];
  hip: [number, number];
  length: [number, number];
  legOpening: [number, number];
}

const TROUSER_SIZES: TrouserRow[] = [
  { size: 'S', waist: [76, 29.9], hip: [104, 40.9], length: [106, 41.7], legOpening: [48, 18.9] },
  { size: 'M', waist: [82, 32.3], hip: [110, 43.3], length: [108, 42.5], legOpening: [50, 19.7] },
  { size: 'L', waist: [88, 34.6], hip: [116, 45.7], length: [110, 43.3], legOpening: [52, 20.5] },
  { size: 'XL', waist: [94, 37.0], hip: [122, 48.0], length: [112, 44.1], legOpening: [54, 21.3] },
];

export default function SizeGuidePage() {
  const [unit, setUnit] = useState<Unit>('cm');
  const [activeTab, setActiveTab] = useState<'tee' | 'hoodie' | 'shirt' | 'trouser'>('tee');

  const unitIdx = unit === 'cm' ? 0 : 1;
  const unitLabel = unit === 'cm' ? 'CM' : 'INCHES';

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-24 px-4 md:px-8 bg-cream text-black">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-grey/60 pb-8">
          <span className="font-body text-xs font-medium tracking-wider text-charcoal uppercase block mb-3">
            Garment Dimensions
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-black">
            Size &amp; Proportion Guide
          </h1>
          <p className="font-body text-sm md:text-base text-charcoal max-w-2xl mt-4 leading-relaxed">
            Our silhouettes feature deliberate architectural draping with relaxed boxy cuts and dropped shoulders. 
            All measurements reflect actual garment dimensions laid flat.
          </p>
        </div>

        {/* Controls Bar: Category Tabs & Unit Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-grey/40 pb-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('tee')}
              className={`font-body text-xs font-medium tracking-wider uppercase px-4 py-2 rounded-full transition-all ${
                activeTab === 'tee'
                  ? 'bg-black text-white'
                  : 'bg-offwhite text-charcoal border border-grey/40 hover:text-black hover:border-grey'
              }`}
            >
              Oversized Tees
            </button>
            <button
              onClick={() => setActiveTab('hoodie')}
              className={`font-body text-xs font-medium tracking-wider uppercase px-4 py-2 rounded-full transition-all ${
                activeTab === 'hoodie'
                  ? 'bg-black text-white'
                  : 'bg-offwhite text-charcoal border border-grey/40 hover:text-black hover:border-grey'
              }`}
            >
              Heavy Hoodies
            </button>
            <button
              onClick={() => setActiveTab('shirt')}
              className={`font-body text-xs font-medium tracking-wider uppercase px-4 py-2 rounded-full transition-all ${
                activeTab === 'shirt'
                  ? 'bg-black text-white'
                  : 'bg-offwhite text-charcoal border border-grey/40 hover:text-black hover:border-grey'
              }`}
            >
              Tailored Shirts
            </button>
            <button
              onClick={() => setActiveTab('trouser')}
              className={`font-body text-xs font-medium tracking-wider uppercase px-4 py-2 rounded-full transition-all ${
                activeTab === 'trouser'
                  ? 'bg-black text-white'
                  : 'bg-offwhite text-charcoal border border-grey/40 hover:text-black hover:border-grey'
              }`}
            >
              Pleated Trousers
            </button>
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center p-1 bg-offwhite border border-grey/50 rounded-full">
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 font-body text-xs font-medium rounded-full transition-all ${
                unit === 'cm' ? 'bg-black text-white' : 'text-charcoal hover:text-black'
              }`}
            >
              CM
            </button>
            <button
              onClick={() => setUnit('in')}
              className={`px-3 py-1 font-body text-xs font-medium rounded-full transition-all ${
                unit === 'in' ? 'bg-black text-white' : 'text-charcoal hover:text-black'
              }`}
            >
              INCHES
            </button>
          </div>
        </div>

        {/* Sizing Table */}
        <div className="bg-offwhite border border-grey/40 rounded-sm overflow-hidden overflow-x-auto">
          {activeTab !== 'trouser' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cream/60 border-b border-grey/40 font-body text-xs uppercase tracking-wider text-charcoal">
                  <th className="p-4 font-semibold text-black">Size</th>
                  <th className="p-4 font-medium">Chest ({unitLabel})</th>
                  <th className="p-4 font-medium">Shoulder ({unitLabel})</th>
                  <th className="p-4 font-medium">Length ({unitLabel})</th>
                  <th className="p-4 font-medium">Sleeve ({unitLabel})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-grey/20 font-body text-xs">
                {(activeTab === 'tee' ? TEE_SIZES : activeTab === 'hoodie' ? HOODIE_SIZES : SHIRT_SIZES).map(
                  (row) => (
                    <tr key={row.size} className="hover:bg-cream/40 transition-colors">
                      <td className="p-4 font-semibold text-black">{row.size}</td>
                      <td className="p-4 text-charcoal">{row.chest[unitIdx]}</td>
                      <td className="p-4 text-charcoal">{row.shoulder[unitIdx]}</td>
                      <td className="p-4 text-charcoal">{row.length[unitIdx]}</td>
                      <td className="p-4 text-charcoal">{row.sleeve[unitIdx]}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cream/60 border-b border-grey/40 font-body text-xs uppercase tracking-wider text-charcoal">
                  <th className="p-4 font-semibold text-black">Size</th>
                  <th className="p-4 font-medium">Waist ({unitLabel})</th>
                  <th className="p-4 font-medium">Hip ({unitLabel})</th>
                  <th className="p-4 font-medium">Total Length ({unitLabel})</th>
                  <th className="p-4 font-medium">Leg Opening ({unitLabel})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-grey/20 font-body text-xs">
                {TROUSER_SIZES.map((row) => (
                  <tr key={row.size} className="hover:bg-cream/40 transition-colors">
                    <td className="p-4 font-semibold text-black">{row.size}</td>
                    <td className="p-4 text-charcoal">{row.waist[unitIdx]}</td>
                    <td className="p-4 text-charcoal">{row.hip[unitIdx]}</td>
                    <td className="p-4 text-charcoal">{row.length[unitIdx]}</td>
                    <td className="p-4 text-charcoal">{row.legOpening[unitIdx]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Anatomical Measurement Guide */}
        <div className="bg-offwhite border border-grey/40 rounded-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-grey/30 pb-3">
            <Ruler className="w-4 h-4 text-charcoal" />
            <h2 className="font-display text-base font-semibold tracking-tight text-black">
              How to Measure
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-body text-xs text-charcoal">
            <div className="space-y-2">
              <span className="font-medium text-black uppercase tracking-wider block">1. Chest / Bust</span>
              <p className="leading-relaxed">
                Measure horizontally around the fullest circumference of your chest, keeping the tape flat across your back.
              </p>
            </div>
            <div className="space-y-2">
              <span className="font-medium text-black uppercase tracking-wider block">2. Shoulders</span>
              <p className="leading-relaxed">
                Measure straight from the edge of one shoulder point across the collar base to the opposite shoulder point.
              </p>
            </div>
            <div className="space-y-2">
              <span className="font-medium text-black uppercase tracking-wider block">3. Body Length</span>
              <p className="leading-relaxed">
                Measure vertically from the highest shoulder seam down along your torso to the desired hem finishing point.
              </p>
            </div>
          </div>
        </div>

        {/* Fit Consultation Banner */}
        <div className="bg-black text-cream rounded-sm p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-display text-base font-semibold text-white">
              Need personal sizing advice?
            </h3>
            <p className="font-body text-xs text-white/60">
              Share your height, weight, and desired drape with our concierge for an immediate recommendation.
            </p>
          </div>
          <Link href="/contact">
            <Button variant="primary" className="bg-white text-black hover:bg-cream rounded-sm font-medium transition-all">
              Consult Stylist <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
