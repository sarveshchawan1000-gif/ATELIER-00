'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Ruler, HelpCircle } from 'lucide-react';

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
    <main className="min-h-screen pt-24 md:pt-32 pb-24 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b-2 border-black pb-8">
          <span className="font-display text-xs tracking-widest text-cyan uppercase bg-black px-2.5 py-1 inline-block mb-3">
            ATELIER METRICS
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tighter uppercase text-black">
            SIZE & PROPORTION GUIDE
          </h1>
          <p className="font-body text-sm md:text-base text-charcoal max-w-2xl mt-4">
            Our garments feature intentional relaxed boxy architecture with drop shoulders. 
            All measurements reflect actual garment dimensions laid flat.
          </p>
        </div>

        {/* Controls Bar: Category Tabs & Unit Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-black pb-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('tee')}
              className={`font-display text-xs font-bold tracking-wider uppercase px-4 py-2 border-2 transition-colors ${
                activeTab === 'tee'
                  ? 'bg-black text-cyan border-black'
                  : 'bg-offwhite text-black border-grey hover:border-black'
              }`}
            >
              OVERSIZED TEES
            </button>
            <button
              onClick={() => setActiveTab('hoodie')}
              className={`font-display text-xs font-bold tracking-wider uppercase px-4 py-2 border-2 transition-colors ${
                activeTab === 'hoodie'
                  ? 'bg-black text-cyan border-black'
                  : 'bg-offwhite text-black border-grey hover:border-black'
              }`}
            >
              HEAVY HOODIES
            </button>
            <button
              onClick={() => setActiveTab('shirt')}
              className={`font-display text-xs font-bold tracking-wider uppercase px-4 py-2 border-2 transition-colors ${
                activeTab === 'shirt'
                  ? 'bg-black text-cyan border-black'
                  : 'bg-offwhite text-black border-grey hover:border-black'
              }`}
            >
              TAILORED SHIRTS
            </button>
            <button
              onClick={() => setActiveTab('trouser')}
              className={`font-display text-xs font-bold tracking-wider uppercase px-4 py-2 border-2 transition-colors ${
                activeTab === 'trouser'
                  ? 'bg-black text-cyan border-black'
                  : 'bg-offwhite text-black border-grey hover:border-black'
              }`}
            >
              PLEATED TROUSERS
            </button>
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center border-2 border-black bg-offwhite">
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1.5 font-display text-xs font-bold uppercase transition-colors ${
                unit === 'cm' ? 'bg-cyan text-black' : 'text-charcoal hover:text-black'
              }`}
            >
              CM
            </button>
            <button
              onClick={() => setUnit('in')}
              className={`px-3 py-1.5 font-display text-xs font-bold uppercase transition-colors ${
                unit === 'in' ? 'bg-cyan text-black' : 'text-charcoal hover:text-black'
              }`}
            >
              INCHES
            </button>
          </div>
        </div>

        {/* Sizing Table */}
        <div className="bg-offwhite border-2 border-black overflow-x-auto shadow-[6px_6px_0px_0px_#111111]">
          {activeTab !== 'trouser' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black text-cream border-b-2 border-black font-display text-xs uppercase tracking-wider">
                  <th className="p-4 border-r border-grey/30">SIZE</th>
                  <th className="p-4 border-r border-grey/30">CHEST ({unitLabel})</th>
                  <th className="p-4 border-r border-grey/30">SHOULDER ({unitLabel})</th>
                  <th className="p-4 border-r border-grey/30">LENGTH ({unitLabel})</th>
                  <th className="p-4">SLEEVE ({unitLabel})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-grey font-display text-xs">
                {(activeTab === 'tee' ? TEE_SIZES : activeTab === 'hoodie' ? HOODIE_SIZES : SHIRT_SIZES).map(
                  (row) => (
                    <tr key={row.size} className="hover:bg-cyan/10 transition-colors">
                      <td className="p-4 font-bold text-black border-r border-grey">{row.size}</td>
                      <td className="p-4 border-r border-grey">{row.chest[unitIdx]}</td>
                      <td className="p-4 border-r border-grey">{row.shoulder[unitIdx]}</td>
                      <td className="p-4 border-r border-grey">{row.length[unitIdx]}</td>
                      <td className="p-4">{row.sleeve[unitIdx]}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black text-cream border-b-2 border-black font-display text-xs uppercase tracking-wider">
                  <th className="p-4 border-r border-grey/30">SIZE</th>
                  <th className="p-4 border-r border-grey/30">WAIST ({unitLabel})</th>
                  <th className="p-4 border-r border-grey/30">HIP ({unitLabel})</th>
                  <th className="p-4 border-r border-grey/30">TOTAL LENGTH ({unitLabel})</th>
                  <th className="p-4">LEG OPENING ({unitLabel})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-grey font-display text-xs">
                {TROUSER_SIZES.map((row) => (
                  <tr key={row.size} className="hover:bg-cyan/10 transition-colors">
                    <td className="p-4 font-bold text-black border-r border-grey">{row.size}</td>
                    <td className="p-4 border-r border-grey">{row.waist[unitIdx]}</td>
                    <td className="p-4 border-r border-grey">{row.hip[unitIdx]}</td>
                    <td className="p-4 border-r border-grey">{row.length[unitIdx]}</td>
                    <td className="p-4">{row.legOpening[unitIdx]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Anatomical Measurement Guide */}
        <div className="bg-offwhite border-2 border-black p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-black pb-3">
            <Ruler className="w-5 h-5 text-black" />
            <h2 className="font-display text-lg font-bold tracking-wider uppercase">
              HOW TO MEASURE YOUR BODY
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-body text-xs text-charcoal">
            <div className="space-y-2">
              <span className="font-display font-bold text-black uppercase block">1. CHEST / BUST</span>
              <p className="leading-relaxed">
                Measure horizontally around the fullest circumference of your chest, keeping the tape flat across your back.
              </p>
            </div>
            <div className="space-y-2">
              <span className="font-display font-bold text-black uppercase block">2. SHOULDERS</span>
              <p className="leading-relaxed">
                Measure straight from the edge of one shoulder point across the collar base to the opposite shoulder point.
              </p>
            </div>
            <div className="space-y-2">
              <span className="font-display font-bold text-black uppercase block">3. BODY LENGTH</span>
              <p className="leading-relaxed">
                Measure vertically from the highest shoulder seam down along your torso to the desired hem finishing point.
              </p>
            </div>
          </div>
        </div>

        {/* Fit Consultation Banner */}
        <div className="bg-black text-cream p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-black">
          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold uppercase tracking-wider text-cream">
              NEED BESPOKE SIZING ADVICE?
            </h3>
            <p className="font-body text-xs text-grey">
              Send your height, weight, and preferred drape to our atelier stylists for immediate fit recommendation.
            </p>
          </div>
          <Link href="/contact">
            <Button variant="primary" className="bg-cyan text-black hover:bg-cream">
              CONSULT STYLIST <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
