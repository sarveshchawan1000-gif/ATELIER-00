'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CONFIG } from '@/lib/config';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { RefreshCw, CheckCircle, ArrowRight, HelpCircle } from 'lucide-react';

export default function ReturnsPage() {
  const { showToast } = useToast();
  const [orderNo, setOrderNo] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('size-too-large');
  const [initiated, setInitiated] = useState(false);

  const handleStartReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNo || !email) {
      showToast('Please enter your order number and email.');
      return;
    }
    setInitiated(true);
    showToast('Return request submitted for verification.');
  };

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-24 px-4 md:px-8 bg-cream text-black">
      <div className="max-w-4xl mx-auto space-y-14">
        {/* Header */}
        <div className="border-b border-grey/60 pb-8">
          <span className="font-body text-xs font-medium tracking-wider text-charcoal uppercase block mb-3">
            Returns & Exchanges
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-black">
            Returns & Exchanges
          </h1>
          <p className="font-body text-sm md:text-base text-charcoal max-w-2xl mt-4 leading-relaxed">
            We offer a frictionless {CONFIG.returns.windowDays}-day return and exchange window 
            for all unworn garments in their original condition with tags intact.
          </p>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-offwhite border border-grey/50 rounded-sm p-6 space-y-3">
            <span className="font-body text-xs font-medium text-charcoal uppercase tracking-wider block">
              Return Window
            </span>
            <div className="font-display text-2xl font-semibold text-black">
              {CONFIG.returns.windowDays} Days
            </div>
            <p className="font-body text-xs text-charcoal leading-relaxed">
              From the courier timestamp of successful delivery.
            </p>
          </div>

          <div className="bg-black text-cream rounded-sm p-6 space-y-3">
            <span className="font-body text-xs font-medium text-white/50 uppercase tracking-wider block">
              Refund Speed
            </span>
            <div className="font-display text-2xl font-semibold text-white">
              {CONFIG.returns.refundTimelineDays}
            </div>
            <p className="font-body text-xs text-white/50 leading-relaxed">
              Processed to original payment source upon quality audit.
            </p>
          </div>

          <div className="bg-offwhite border border-grey/50 rounded-sm p-6 space-y-3">
            <span className="font-body text-xs font-medium text-charcoal uppercase tracking-wider block">
              Reverse Pickup
            </span>
            <div className="font-display text-2xl font-semibold text-black">
              Complimentary
            </div>
            <p className="font-body text-xs text-charcoal leading-relaxed">
              Doorstep collection at zero extra charge.
            </p>
          </div>
        </div>

        {/* Return Request Form */}
        <div className="bg-offwhite border border-grey/40 rounded-sm p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6 border-b border-grey/40 pb-4">
            <RefreshCw className="w-5 h-5 text-charcoal" />
            <h2 className="font-display text-lg font-semibold tracking-tight">
              Initiate Return or Exchange
            </h2>
          </div>

          {initiated ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-12 h-12 bg-black text-white mx-auto flex items-center justify-center rounded-full">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-semibold">
                Return Request #{orderNo.toUpperCase()} Logged
              </h3>
              <p className="font-body text-sm text-charcoal max-w-md mx-auto">
                A prepaid reverse airway bill and pickup confirmation have been sent to{' '}
                <span className="font-medium text-black">{email}</span>. A pickup representative 
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
                className="font-medium"
              >
                Submit Another Request
              </Button>
            </div>
          ) : (
            <form onSubmit={handleStartReturn} className="space-y-6">
              <p className="font-body text-sm text-charcoal">
                Enter your order details to look up eligible items for exchange or refund.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs font-medium tracking-wide text-charcoal uppercase block mb-1.5">
                    Order Number *
                  </label>
                  <Input
                    placeholder="e.g. BRD-2026-0049"
                    value={orderNo}
                    onChange={(e) => setOrderNo(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="font-body text-xs font-medium tracking-wide text-charcoal uppercase block mb-1.5">
                    Billing Email *
                  </label>
                  <Input
                    type="email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-body text-xs font-medium tracking-wide text-charcoal uppercase block mb-1.5">
                  Reason for Return
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-white border border-grey/60 rounded-sm px-4 py-3 font-body text-sm text-black focus:outline-none focus:border-black/40 transition-colors"
                >
                  <option value="size-too-large">Size too large (exchange requested)</option>
                  <option value="size-too-small">Size too small (exchange requested)</option>
                  <option value="silhouette">Silhouette did not meet expectation</option>
                  <option value="fabric-weight">Fabric weight not preferred</option>
                  <option value="defect">Quality / transit defect</option>
                </select>
              </div>

              <Button type="submit" variant="primary" size="lg" className="bg-black text-white hover:bg-charcoal font-medium transition-all">
                Lookup Order & Request Return <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )}
        </div>

        {/* Eligibility */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="font-display text-base font-semibold tracking-tight">
              Eligibility Criteria
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 font-body text-sm text-charcoal">
              <li className="flex items-start gap-2 bg-offwhite p-3 border border-grey/30 rounded-sm">
                <span className="text-black font-medium">✓</span>
                <span>Garment must remain completely unworn, unwashed, and unscented.</span>
              </li>
              <li className="flex items-start gap-2 bg-offwhite p-3 border border-grey/30 rounded-sm">
                <span className="text-black font-medium">✓</span>
                <span>Hangtag and security seal must remain intact.</span>
              </li>
              <li className="flex items-start gap-2 bg-offwhite p-3 border border-grey/30 rounded-sm">
                <span className="text-black font-medium">✓</span>
                <span>Returned in original protective packaging and carton box.</span>
              </li>
              <li className="flex items-start gap-2 bg-offwhite p-3 border border-grey/30 rounded-sm">
                <span className="text-black font-medium">✓</span>
                <span>Requested within {CONFIG.returns.windowDays} calendar days from delivery.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-base font-semibold tracking-tight">
              Refund Timeline
            </h3>
            <p className="font-body text-sm text-charcoal leading-relaxed">
              Once returned packages are received, our team inspects tags and fabric integrity within 24 hours. Upon approval:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-body text-sm text-charcoal">
              <li>
                <strong className="text-black">UPI & Net Banking:</strong> Credits reflect within 24–48 banking hours.
              </li>
              <li>
                <strong className="text-black">Credit & Debit Cards:</strong> Banks typically settle within 5–7 business days.
              </li>
              <li>
                <strong className="text-black">Store Credit:</strong> Instant wallet credit with an additional 5% bonus.
              </li>
            </ul>
          </div>
        </div>

        {/* Help Banner */}
        <div className="bg-black text-white rounded-sm p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <HelpCircle className="w-6 h-6 text-white/40 flex-shrink-0" />
            <div>
              <h4 className="font-display text-base font-semibold text-white">
                Questions about fit or return status?
              </h4>
              <p className="font-body text-sm text-white/50">
                Our team is ready to guide you through size exchanges.
              </p>
            </div>
          </div>
          <Link href="/contact">
            <Button variant="primary" className="bg-white text-black hover:bg-white/90 font-medium transition-all">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
