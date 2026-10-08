import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CONFIG } from '@/lib/config';
import { formatINR } from '@/lib/pricing';
import { Button } from '@/components/ui/Button';
import { Truck, ShieldCheck, Clock, MapPin, Package, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping & Delivery',
  description: `Domestic delivery across India. Free shipping over ${formatINR(CONFIG.shipping.freeShippingThresholdPaise)}.`,
};

export default function ShippingPage() {
  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-14">
        {/* Header */}
        <div className="border-b border-grey/60 pb-8">
          <span className="font-body text-xs font-medium tracking-wider text-charcoal uppercase block mb-3">
            Logistics & Dispatch
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-black">
            Shipping & Delivery
          </h1>
          <p className="font-body text-sm md:text-base text-charcoal max-w-2xl mt-4 leading-relaxed">
            All orders are processed from our Mumbai logistics hub using climate-sealed, 
            tamper-evident packaging and insured transit partners.
          </p>
        </div>

        {/* Rate Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-offwhite border border-grey/50 rounded-sm p-6 space-y-3">
            <span className="font-body text-xs font-medium text-charcoal uppercase tracking-wider block">
              Standard Domestic
            </span>
            <div className="font-display text-2xl font-semibold text-black">
              {formatINR(CONFIG.shipping.flatRatePaise)}
            </div>
            <p className="font-body text-xs text-charcoal leading-relaxed">
              Flat rate for orders below {formatINR(CONFIG.shipping.freeShippingThresholdPaise)}.
            </p>
          </div>

          <div className="bg-black text-cream rounded-sm p-6 space-y-3">
            <span className="font-body text-xs font-medium text-white/50 uppercase tracking-wider block">
              Free Shipping
            </span>
            <div className="font-display text-2xl font-semibold text-white">
              Free
            </div>
            <p className="font-body text-xs text-white/50 leading-relaxed">
              Automatically applied on orders totaling {formatINR(CONFIG.shipping.freeShippingThresholdPaise)} or above.
            </p>
          </div>

          <div className="bg-offwhite border border-grey/50 rounded-sm p-6 space-y-3">
            <span className="font-body text-xs font-medium text-charcoal uppercase tracking-wider block">
              Transit Window
            </span>
            <div className="font-display text-2xl font-semibold text-black">
              {CONFIG.shipping.estimatedDays}
            </div>
            <p className="font-body text-xs text-charcoal leading-relaxed">
              Metro cities: 2–3 days. Non-metro & tier-2/3 regions: 4–5 days.
            </p>
          </div>
        </div>

        {/* Policy Content */}
        <div className="space-y-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 text-charcoal" />
              <h2 className="font-display text-base font-semibold tracking-tight">
                1. Dispatch & Processing
              </h2>
            </div>
            <p className="font-body text-sm text-charcoal leading-relaxed pl-7">
              Orders placed before 14:00 IST Monday through Friday are processed and handed to 
              our logistics partners on the same business day. Orders placed on weekends or national holidays 
              are dispatched on the next business day.
            </p>
            <p className="font-body text-sm text-charcoal leading-relaxed pl-7">
              Upon dispatch, a confirmed AWB tracking link is sent via SMS and email to the 
              contact details provided at checkout.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-charcoal" />
              <h2 className="font-display text-base font-semibold tracking-tight">
                2. Coverage & Couriers
              </h2>
            </div>
            <p className="font-body text-sm text-charcoal leading-relaxed pl-7">
              We service over 19,000+ PIN codes across all 28 states and 8 union territories in India 
              via premium tier-1 courier partners (Blue Dart, Delhivery Express, and DTDC Air). 
              Deliveries require an OTP or physical signature for secure handover.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-charcoal" />
              <h2 className="font-display text-base font-semibold tracking-tight">
                3. Packaging & Transit Security
              </h2>
            </div>
            <p className="font-body text-sm text-charcoal leading-relaxed pl-7">
              Every garment is folded in acid-free tissue paper, encased in a waterproof bio-degradable 
              garment sleeve, and packaged inside a rigid cardboard carton with reinforced security tape. 
              If your security seal appears broken upon delivery, please decline receipt and notify us immediately.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-charcoal" />
              <h2 className="font-display text-base font-semibold tracking-tight">
                4. Taxes & Compliance
              </h2>
            </div>
            <p className="font-body text-sm text-charcoal leading-relaxed pl-7">
              {CONFIG.taxes.gstInclusiveNote}. There are no hidden destination surcharges or surprise courier charges at delivery.
            </p>
          </div>
        </div>

        {/* Support Callout */}
        <div className="bg-offwhite border border-grey/40 rounded-sm p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-base font-semibold text-black">
              Need transit assistance?
            </h3>
            <p className="font-body text-sm text-charcoal mt-1">
              Have your order number or AWB ready for quick lookup.
            </p>
          </div>
          <Link href="/contact">
            <Button variant="primary" className="bg-black text-white hover:bg-charcoal font-medium transition-all">
              Contact Support <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
