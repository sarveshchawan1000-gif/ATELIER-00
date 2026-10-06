import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CONFIG } from '@/lib/config';
import { formatINR } from '@/lib/pricing';
import { Button } from '@/components/ui/Button';
import { Truck, ShieldCheck, Clock, MapPin, Package, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy',
  description: `Domestic delivery across India. Free shipping over ${formatINR(CONFIG.shipping.freeShippingThresholdPaise)}.`,
};

export default function ShippingPage() {
  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-24 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <div className="border-b-2 border-black pb-8">
          <span className="font-display text-xs tracking-widest text-cyan uppercase bg-black px-2.5 py-1 inline-block mb-3">
            LOGISTICS & DISPATCH
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tighter uppercase text-black">
            SHIPPING & DELIVERY
          </h1>
          <p className="font-body text-sm md:text-base text-charcoal max-w-2xl mt-4">
            All orders are processed from our Mumbai logistics hub using climate-sealed, 
            tamper-evident luxury packaging and insured transit partners.
          </p>
        </div>

        {/* Quick Rate Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-offwhite border-2 border-black p-6 space-y-3">
            <span className="font-display text-xs font-bold text-cyan uppercase tracking-wider block">
              STANDARD DOMESTIC
            </span>
            <div className="font-display text-2xl font-bold text-black">
              {formatINR(CONFIG.shipping.flatRatePaise)}
            </div>
            <p className="font-body text-xs text-charcoal">
              Flat rate for orders below {formatINR(CONFIG.shipping.freeShippingThresholdPaise)}.
            </p>
          </div>

          <div className="bg-black text-cream border-2 border-black p-6 space-y-3">
            <span className="font-display text-xs font-bold text-cyan uppercase tracking-wider block">
              COMPLIMENTARY DISPATCH
            </span>
            <div className="font-display text-2xl font-bold text-cyan">
              FREE
            </div>
            <p className="font-body text-xs text-grey">
              Automatically applied on orders totaling {formatINR(CONFIG.shipping.freeShippingThresholdPaise)} or above.
            </p>
          </div>

          <div className="bg-offwhite border-2 border-black p-6 space-y-3">
            <span className="font-display text-xs font-bold text-cyan uppercase tracking-wider block">
              TRANSIT WINDOW
            </span>
            <div className="font-display text-2xl font-bold text-black">
              {CONFIG.shipping.estimatedDays}
            </div>
            <p className="font-body text-xs text-charcoal">
              Metro cities: 2-3 business days. Non-metro & tier-2/3 regions: 4-5 business days.
            </p>
          </div>
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-12 divide-y divide-grey">
          {/* 1. Fulfillment */}
          <div className="pt-8 first:pt-0 space-y-4">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-black" />
              <h2 className="font-display text-lg font-bold tracking-wider uppercase">
                1. DISPATCH & PROCESSING SCHEDULE
              </h2>
            </div>
            <p className="font-body text-sm text-charcoal leading-relaxed">
              Orders placed before 14:00 IST Monday through Friday are processed and handed to 
              our logistics partners on the same business day. Orders placed on weekends or national holidays 
              are dispatched on the immediate following business working day.
            </p>
            <p className="font-body text-sm text-charcoal leading-relaxed">
              Upon dispatch, a confirmed AWB tracking link is generated and sent via SMS and Email to the 
              contact coordinates provided at checkout.
            </p>
          </div>

          {/* 2. Coverage & Couriers */}
          <div className="pt-8 space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-black" />
              <h2 className="font-display text-lg font-bold tracking-wider uppercase">
                2. SERVICED PINCODES & TRANSIT PARTNERS
              </h2>
            </div>
            <p className="font-body text-sm text-charcoal leading-relaxed">
              We service over 19,000+ PIN codes across all 28 states and 8 union territories in India 
              via premium tier-1 courier partners (Blue Dart, Delhivery Express, and DTDC Air). 
              Deliveries require an OTP or physical signature to ensure strict custody transfer.
            </p>
          </div>

          {/* 3. Luxury Packaging */}
          <div className="pt-8 space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-black" />
              <h2 className="font-display text-lg font-bold tracking-wider uppercase">
                3. ARCHIVAL PACKAGING & TRANSIT SECURITY
              </h2>
            </div>
            <p className="font-body text-sm text-charcoal leading-relaxed">
              Every garment is folded in acid-free tissue paper, encased in a matte black waterproof bio-degradable 
              garment sleeve, and packaged inside an architectural rigid cardboard carton with reinforced security tape. 
              If your external security seal appears broken upon delivery, please decline receipt and notify us immediately.
            </p>
          </div>

          {/* 4. Taxes & Duties */}
          <div className="pt-8 space-y-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-black" />
              <h2 className="font-display text-lg font-bold tracking-wider uppercase">
                4. TAXES & STATUTORY COMPLIANCE
              </h2>
            </div>
            <p className="font-body text-sm text-charcoal leading-relaxed">
              {CONFIG.taxes.gstInclusiveNote}. There are zero hidden destination surcharges or surprise courier charges at delivery.
            </p>
          </div>
        </div>

        {/* Support Callout */}
        <div className="bg-offwhite border-2 border-black p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-lg font-bold uppercase tracking-wider">
              NEED IMMEDIATE TRANSIT ASSISTANCE?
            </h3>
            <p className="font-body text-xs text-charcoal mt-1">
              Have your order number or AWB ready for expedited concierge lookup.
            </p>
          </div>
          <Link href="/contact">
            <Button variant="primary">
              CONTACT CONCIERGE <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
