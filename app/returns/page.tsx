'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CONFIG } from '@/lib/config';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { RefreshCw, ShieldAlert, CheckCircle, Clock, Truck, ArrowRight, HelpCircle } from 'lucide-react';

export default function ReturnsPage() {
  const { showToast } = useToast();
  const [orderNo, setOrderNo] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('size-too-large');
  const [initiated, setInitiated] = useState(false);

  const handleStartReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNo || !email) {
      showToast('PLEASE ENTER YOUR ORDER NUMBER AND EMAIL');
      return;
    }
    setInitiated(true);
    showToast('RETURN REQUEST SUBMITTED FOR ATELIER VERIFICATION');
  };

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-24 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <div className="border-b-2 border-black pb-8">
          <span className="font-display text-xs tracking-widest text-cyan uppercase bg-black px-2.5 py-1 inline-block mb-3">
            ASSURANCE & SATISFACTION
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tighter uppercase text-black">
            RETURNS & EXCHANGES
          </h1>
          <p className="font-body text-sm md:text-base text-charcoal max-w-2xl mt-4">
            We offer a frictionless {CONFIG.returns.windowDays}-day return and exchange window 
            for all unworn artifacts in their pristine, original condition with security tags intact.
          </p>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-offwhite border-2 border-black p-6 space-y-3">
            <span className="font-display text-xs font-bold text-cyan uppercase tracking-wider block">
              RETURN WINDOW
            </span>
            <div className="font-display text-2xl font-bold text-black">
              {CONFIG.returns.windowDays} CALENDAR DAYS
            </div>
            <p className="font-body text-xs text-charcoal">
              Calculated strictly from the courier timestamp of successful doorstep delivery.
            </p>
          </div>

          <div className="bg-black text-cream border-2 border-black p-6 space-y-3">
            <span className="font-display text-xs font-bold text-cyan uppercase tracking-wider block">
              REFUND SPEED
            </span>
            <div className="font-display text-2xl font-bold text-cyan">
              {CONFIG.returns.refundTimelineDays}
            </div>
            <p className="font-body text-xs text-grey">
              Processed directly to original payment source upon atelier quality audit.
            </p>
          </div>

          <div className="bg-offwhite border-2 border-black p-6 space-y-3">
            <span className="font-display text-xs font-bold text-cyan uppercase tracking-wider block">
              REVERSE PICKUP
            </span>
            <div className="font-display text-2xl font-bold text-black">
              COMPLIMENTARY
            </div>
            <p className="font-body text-xs text-charcoal">
              Our courier team coordinates doorstep collection at zero extra charge.
            </p>
          </div>
        </div>

        {/* Interactive Return Request Box */}
        <div className="bg-offwhite border-2 border-black p-8 md:p-10 shadow-[6px_6px_0px_0px_#111111]">
          <div className="flex items-center gap-3 mb-6 border-b border-black pb-4">
            <RefreshCw className="w-6 h-6 text-black" />
            <h2 className="font-display text-xl font-bold tracking-wider uppercase">
              INITIATE RETURN OR SIZE EXCHANGE
            </h2>
          </div>

          {initiated ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-12 h-12 bg-black text-cyan mx-auto flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold uppercase tracking-wider">
                RETURN REQUEST #{orderNo.toUpperCase()} LOGGED
              </h3>
              <p className="font-body text-xs md:text-sm text-charcoal max-w-md mx-auto">
                A prepaid reverse airway bill and pickup confirmation have been dispatched to{' '}
                <span className="font-bold text-black">{email}</span>. A pickup representative 
                will arrive within 24 to 48 hours.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setInitiated(false);
                  setOrderNo('');
                  setEmail('');
                }}
              >
                SUBMIT ANOTHER REQUEST
              </Button>
            </div>
          ) : (
            <form onSubmit={handleStartReturn} className="space-y-6">
              <p className="font-body text-xs text-charcoal">
                Enter your order credentials to look up eligible items for size exchange or full refund.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-display text-xs font-bold tracking-wider uppercase block mb-1.5">
                    ORDER NUMBER *
                  </label>
                  <Input
                    placeholder="E.G. BRD-2026-0049"
                    value={orderNo}
                    onChange={(e) => setOrderNo(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="font-display text-xs font-bold tracking-wider uppercase block mb-1.5">
                    BILLING EMAIL *
                  </label>
                  <Input
                    type="email"
                    placeholder="NAME@DOMAIN.COM"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-display text-xs font-bold tracking-wider uppercase block mb-1.5">
                  REASON FOR RETURN / EXCHANGE
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-offwhite border-2 border-black px-4 py-3 font-display text-xs tracking-wider uppercase focus:outline-none focus:border-cyan"
                >
                  <option value="size-too-large">SIZE TOO LARGE (EXCHANGE REQUESTED)</option>
                  <option value="size-too-small">SIZE TOO SMALL (EXCHANGE REQUESTED)</option>
                  <option value="silhouette">DRAPE / SILHOUETTE DID NOT MEET EXPECTATION</option>
                  <option value="fabric-weight">FABRIC WEIGHT NOT PREFERRED</option>
                  <option value="defect">QUALITY / TRANSIT DEFECT</option>
                </select>
              </div>

              <Button type="submit" variant="primary" size="lg">
                LOOKUP ORDER & REQUEST RETURN <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )}
        </div>

        {/* Policy Checklist Guidelines */}
        <div className="space-y-8 divide-y divide-grey">
          <div className="pt-8 first:pt-0 space-y-4">
            <h3 className="font-display text-lg font-bold tracking-wider uppercase">
              ELIGIBILITY CRITERIA
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 font-body text-xs text-charcoal">
              <li className="flex items-start gap-2 bg-offwhite p-3 border border-grey">
                <span className="text-cyan font-bold">✓</span>
                <span>Garment must remain completely unworn, unwashed, and unscented.</span>
              </li>
              <li className="flex items-start gap-2 bg-offwhite p-3 border border-grey">
                <span className="text-cyan font-bold">✓</span>
                <span>Monograph serial hangtag and security zip-seal must remain intact.</span>
              </li>
              <li className="flex items-start gap-2 bg-offwhite p-3 border border-grey">
                <span className="text-cyan font-bold">✓</span>
                <span>Returned in original protective dust jacket and rigid carton box.</span>
              </li>
              <li className="flex items-start gap-2 bg-offwhite p-3 border border-grey">
                <span className="text-cyan font-bold">✓</span>
                <span>Requested within {CONFIG.returns.windowDays} calendar days from delivery date.</span>
              </li>
            </ul>
          </div>

          <div className="pt-8 space-y-4">
            <h3 className="font-display text-lg font-bold tracking-wider uppercase">
              REFUND MODALITIES & REVERSALS
            </h3>
            <p className="font-body text-sm text-charcoal leading-relaxed">
              Once returned packages are received at our Mumbai quality control atelier, our team 
              inspects garment tags and fabric integrity within 24 hours. Upon approval:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-body text-xs text-charcoal">
              <li>
                <strong>Prepaid UPI & Net Banking:</strong> Credits reflect in your account within 24–48 banking hours.
              </li>
              <li>
                <strong>Credit & Debit Cards:</strong> Banks typically settle the credit line within 5–7 business days.
              </li>
              <li>
                <strong>Store Credit Option:</strong> Instant wallet credit issued with an additional 5% bonus courtesy.
              </li>
            </ul>
          </div>
        </div>

        {/* Help Banner */}
        <div className="bg-black text-cream p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <HelpCircle className="w-8 h-8 text-cyan" />
            <div>
              <h4 className="font-display text-base font-bold uppercase tracking-wider text-cream">
                HAVE QUESTIONS ABOUT FIT OR RETURN STATUS?
              </h4>
              <p className="font-body text-xs text-grey">
                Our concierge is standing by to guide you through size exchanges.
              </p>
            </div>
          </div>
          <Link href="/contact">
            <Button variant="primary" className="bg-cyan text-black hover:bg-cream">
              TALK TO CONCIERGE
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
