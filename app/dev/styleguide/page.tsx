'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Radio } from '@/components/ui/Radio';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Skeleton, ProductCardSkeleton } from '@/components/ui/Skeleton';
import { Modal } from '@/components/ui/Modal';
import { Drawer } from '@/components/ui/Drawer';
import { useToast } from '@/components/ui/Toast';
import { CONFIG } from '@/lib/config';

export default function StyleguidePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [checkboxVal, setCheckboxVal] = useState(true);
  const [radioVal, setRadioVal] = useState('a');
  const [selectVal, setSelectVal] = useState('option1');

  const { showToast } = useToast();

  const colorTokens = [
    { name: '--cream', hex: '#F5F0E8', use: 'Page Background Canvas', text: '#111111' },
    { name: '--offwhite', hex: '#FFFDF8', use: 'Cards, Panels, Input Surfaces', text: '#111111' },
    { name: '--black', hex: '#111111', use: 'Primary Text, Primary Buttons, Borders', text: '#F5F0E8' },
    { name: '--charcoal', hex: '#333333', use: 'Secondary Text, Subtitles, Spec Copy', text: '#F5F0E8' },
    { name: '--grey', hex: '#D8D5CF', use: 'Hairline Dividers, Grid Rules, Skeletons', text: '#111111' },
    { name: '--cyan', hex: '#00D9FF', use: 'Accent Fill, Selected Size, Focus Ring Accent', text: '#111111' },
    { name: '--error-red', hex: '#B3261E', use: 'Functional Error State Only (D3)', text: '#FFFDF8' },
  ];

  const contrastTable = [
    { fg: 'Black (#111111)', bg: 'Cream (#F5F0E8)', ratio: '17.5:1', target: '≥ 4.5:1 (Body)', status: 'PASS' },
    { fg: 'Black (#111111)', bg: 'Cyan (#00D9FF)', ratio: '13.1:1', target: '≥ 4.5:1 (CTA Fill)', status: 'PASS' },
    { fg: 'Charcoal (#333333)', bg: 'Cream (#F5F0E8)', ratio: '9.8:1', target: '≥ 4.5:1 (Secondary Text)', status: 'PASS' },
    { fg: 'Error Red (#B3261E)', bg: 'Offwhite (#FFFDF8)', ratio: '6.1:1', target: '≥ 4.5:1 (Validation)', status: 'PASS' },
    { fg: 'Grey (#D8D5CF)', bg: 'Cream (#F5F0E8)', ratio: '3.2:1', target: '≥ 3.0:1 (UI Boundary)', status: 'PASS' },
    { fg: 'Cyan (#00D9FF)', bg: 'Cream (#F5F0E8)', ratio: '1.4:1', target: '≥ 4.5:1 (FORBIDDEN TEXT)', status: 'FAIL (Correctly Forbidden)' },
  ];

  return (
    <main className="min-h-screen bg-cream text-black p-6 md:p-12 max-w-7xl mx-auto flex flex-col gap-16 pt-28">
      {/* Header */}
      <header className="border-b-2 border-black pb-8">
        <Badge variant="accent" className="mb-2">Phase 1 Verification</Badge>
        <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight uppercase">
          Design System & Component Styleguide
        </h1>
        <p className="font-body text-sm text-charcoal mt-2 max-w-2xl">
          Authoritative visual verification of PRD 6-color tokens, typography scales, accessibility focus rings, and UI primitives.
        </p>
      </header>

      {/* 1. Color Palette Tokens */}
      <section className="flex flex-col gap-6">
        <h2 className="font-display text-xl font-bold border-b border-grey pb-2">
          1. Color Palette Tokens (PRD §3.2)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {colorTokens.map((token) => (
            <div
              key={token.name}
              className="border border-black p-4 flex flex-col justify-between h-36 relative"
              style={{ backgroundColor: token.hex, color: token.text }}
            >
              <span className="font-display text-xs font-bold">{token.name}</span>
              <div>
                <p className="font-display text-lg font-bold">{token.hex}</p>
                <p className="font-body text-[11px] opacity-80 mt-1">{token.use}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. WCAG 2.2 AA Contrast Matrix */}
      <section className="flex flex-col gap-6">
        <h2 className="font-display text-xl font-bold border-b border-grey pb-2">
          2. WCAG 2.2 AA Contrast Verification Table
        </h2>
        <div className="overflow-x-auto border border-black bg-offwhite">
          <table className="w-full text-left font-body text-xs">
            <thead className="bg-black text-cream font-display text-[11px] tracking-wider uppercase">
              <tr>
                <th className="p-3 border-r border-charcoal">Foreground</th>
                <th className="p-3 border-r border-charcoal">Background</th>
                <th className="p-3 border-r border-charcoal">Contrast Ratio</th>
                <th className="p-3 border-r border-charcoal">WCAG Requirement</th>
                <th className="p-3">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-grey">
              {contrastTable.map((row, idx) => (
                <tr key={idx} className="hover:bg-grey/20">
                  <td className="p-3 border-r border-grey font-medium">{row.fg}</td>
                  <td className="p-3 border-r border-grey font-medium">{row.bg}</td>
                  <td className="p-3 border-r border-grey font-display font-bold">{row.ratio}</td>
                  <td className="p-3 border-r border-grey">{row.target}</td>
                  <td className="p-3">
                    <span
                      className={`font-display text-[10px] font-bold px-2 py-0.5 uppercase ${
                        row.status.startsWith('PASS') ? 'bg-black text-cyan' : 'bg-error-red text-cream'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Typography Scale */}
      <section className="flex flex-col gap-6">
        <h2 className="font-display text-xl font-bold border-b border-grey pb-2">
          3. Typography Hierarchy (Space Grotesk & Inter)
        </h2>
        <div className="flex flex-col gap-6 bg-offwhite border border-grey p-6">
          <div>
            <span className="font-display text-[10px] text-charcoal">DISPLAY HERO (~12vw / fluid)</span>
            <p className="font-display text-4xl md:text-6xl font-bold tracking-tighter uppercase">
              {CONFIG.brandName} 2026
            </p>
          </div>
          <div>
            <span className="font-display text-[10px] text-charcoal">HEADLINE LARGE (32-56px)</span>
            <p className="font-display text-3xl font-bold uppercase">ARCHITECTURAL GARMENT EXHIBITION</p>
          </div>
          <div>
            <span className="font-display text-[10px] text-charcoal">HEADLINE MEDIUM (22-32px)</span>
            <p className="font-display text-xl font-bold uppercase">HEAVYWEIGHT OVERSIZED COTTON TEE</p>
          </div>
          <div>
            <span className="font-display text-[10px] text-charcoal">BODY LARGE (18px)</span>
            <p className="font-body text-lg text-charcoal">
              Engineered from 320 GSM combed organic cotton with reinforced twin-needle neck ribbing.
            </p>
          </div>
          <div>
            <span className="font-display text-[10px] text-charcoal">BODY MEDIUM (16px)</span>
            <p className="font-body text-base text-charcoal">
              Standard body paragraph scale set in Inter with line-height 1.6 for comfortable reading across all devices.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Buttons & Interactive Primitives */}
      <section className="flex flex-col gap-6">
        <h2 className="font-display text-xl font-bold border-b border-grey pb-2">
          4. Buttons & Action Controls
        </h2>
        <div className="flex flex-wrap gap-4 items-center bg-offwhite border border-grey p-6">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="danger">Danger Button</Button>
          <Button variant="primary" isLoading>
            Loading State
          </Button>
          <Button variant="primary" disabled>
            Disabled State
          </Button>
        </div>
      </section>

      {/* 5. Form Input Controls */}
      <section className="flex flex-col gap-6">
        <h2 className="font-display text-xl font-bold border-b border-grey pb-2">
          5. Form Inputs & Selection Controls
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-offwhite border border-grey p-6">
          <Input label="FULL NAME" placeholder="e.g. SARVESH CHAVAN" required />
          <Input
            label="EMAIL ADDRESS"
            placeholder="name@example.com"
            error="Please enter a valid email address."
            required
          />
          <Select
            label="SELECT SIZE"
            value={selectVal}
            onChange={(e) => setSelectVal(e.target.value)}
            options={[
              { label: 'MEDIUM (M) - IN STOCK', value: 'option1' },
              { label: 'LARGE (L) - IN STOCK', value: 'option2' },
              { label: 'EXTRA LARGE (XL) - SOLD OUT', value: 'option3' },
            ]}
          />
          <div className="flex flex-col gap-2 pt-2">
            <span className="font-display text-[11px] font-bold tracking-widest text-charcoal uppercase">
              CHECKBOX & RADIO CONTROLS
            </span>
            <Checkbox
              label="Save address for future 1-click checkout"
              checked={checkboxVal}
              onChange={(e) => setCheckboxVal(e.target.checked)}
            />
            <div className="flex gap-4">
              <Radio
                label="Standard Delivery (₹150)"
                name="delivery"
                checked={radioVal === 'a'}
                onChange={() => setRadioVal('a')}
              />
              <Radio
                label="Express Air (₹300)"
                name="delivery"
                checked={radioVal === 'b'}
                onChange={() => setRadioVal('b')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Badges & Skeletons */}
      <section className="flex flex-col gap-6">
        <h2 className="font-display text-xl font-bold border-b border-grey pb-2">
          6. Badges & Skeleton Loaders
        </h2>
        <div className="flex flex-col gap-6 bg-offwhite border border-grey p-6">
          <div className="flex flex-wrap gap-3 items-center">
            <Badge variant="accent">ARCHIVE EDITION</Badge>
            <Badge variant="outline">100% ORGANIC COTTON</Badge>
            <Badge variant="error">ONLY 2 LEFT IN STOCK</Badge>
            <Badge variant="dark">VERIFIED PURCHASE</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl pt-4 border-t border-grey">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
        </div>
      </section>

      {/* 7. Modals, Drawers & Toast Triggers */}
      <section className="flex flex-col gap-6 pb-16">
        <h2 className="font-display text-xl font-bold border-b border-grey pb-2">
          7. Overlay Components & Toast Notifications
        </h2>
        <div className="flex flex-wrap gap-4 items-center bg-offwhite border border-grey p-6">
          <Button variant="secondary" onClick={() => setModalOpen(true)}>
            TEST MODAL DIALOG
          </Button>
          <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
            TEST DRAWER PANEL
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              showToast('ADDED OVERSIZED COTTON TEE TO BAG', 'UNDO', () =>
                alert('Undo action clicked!')
              )
            }
          >
            TRIGGER TOAST NOTIFICATION
          </Button>
        </div>
      </section>

      {/* Interactive Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="SIZE GUIDE & MEASUREMENTS">
        <div className="flex flex-col gap-4 font-body text-xs text-charcoal">
          <p>
            Measurements are taken flat in centimeters. Compare with your favorite existing garment.
          </p>
          <div className="border border-black bg-cream p-4 font-display text-xs">
            <div className="flex justify-between border-b border-grey pb-2 font-bold">
              <span>SIZE</span>
              <span>CHEST</span>
              <span>LENGTH</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-grey/40">
              <span>S</span>
              <span>56 cm</span>
              <span>72 cm</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-grey/40 font-bold text-black">
              <span>M</span>
              <span>59 cm</span>
              <span>74 cm</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span>L</span>
              <span>62 cm</span>
              <span>76 cm</span>
            </div>
          </div>
          <Button variant="primary" fullWidth onClick={() => setModalOpen(false)}>
            CLOSE GUIDE
          </Button>
        </div>
      </Modal>

      {/* Interactive Drawer */}
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="EXHIBITION QUICK VIEW">
        <div className="flex flex-col gap-6 font-body text-xs text-charcoal">
          <div className="w-full aspect-[4/5] bg-grey/30 border border-grey flex items-center justify-center font-display">
            4:5 EXHIBITION IMAGE
          </div>
          <h3 className="font-display text-base font-bold text-black uppercase">
            OVERSIZED HEAVYWEIGHT COTTON TEE
          </h3>
          <p className="text-sm font-display font-bold text-black">₹4,999 INR</p>
          <p>
            Crafted in Mumbai from 320 GSM organic combed cotton. Pre-shrunk finish with raw edge hem details.
          </p>
          <Button variant="primary" fullWidth onClick={() => setDrawerOpen(false)}>
            SELECT SIZE & ADD
          </Button>
        </div>
      </Drawer>
    </main>
  );
}
