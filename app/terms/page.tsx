import React from 'react';
import type { Metadata } from 'next';
import { CONFIG } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: `${CONFIG.brandName} terms and conditions of sale, usage, and intellectual property.`,
};

export default function TermsPage() {
  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b-2 border-black pb-8">
          <span className="font-display text-xs tracking-widest text-cyan uppercase bg-black px-2.5 py-1 inline-block mb-3">
            LEGAL PROTOCOL
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tighter uppercase text-black">
            TERMS & CONDITIONS
          </h1>
          <p className="font-body text-xs text-charcoal uppercase tracking-wider mt-4">
            LAST REVISED: OCTOBER 2026 // JURISDICTION: MUMBAI, MAHARASHTRA, INDIA
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 font-body text-xs md:text-sm text-charcoal leading-relaxed divide-y divide-grey">
          <section className="space-y-3">
            <h2 className="font-display text-base font-bold uppercase tracking-wider text-black">
              1. ACCEPTANCE OF DIGITAL STOREFRONT TERMS
            </h2>
            <p>
              By accessing, browsing, or purchasing garments through this digital exhibition website ({CONFIG.brandName}), 
              you confirm that you are at least {CONFIG.auth.minimumAge} years of age and legally competent to enter into binding 
              contracts under the Indian Contract Act, 1872.
            </p>
          </section>

          <section className="pt-6 space-y-3">
            <h2 className="font-display text-base font-bold uppercase tracking-wider text-black">
              2. PRICING, CURRENCY & STATUTORY TAXATION
            </h2>
            <p>
              All prices displayed on the storefront are denominated exclusively in Indian Rupees ({CONFIG.currency}). 
              {CONFIG.taxes.gstInclusiveNote}. We reserve the explicit right to adjust monograph prices or correct typographical 
              clerical errors prior to order acceptance. In the rare event of an incorrect price display, you will be notified 
              and provided the opportunity to confirm the revised transaction or receive an immediate 100% refund.
            </p>
          </section>

          <section className="pt-6 space-y-3">
            <h2 className="font-display text-base font-bold uppercase tracking-wider text-black">
              3. INVENTORY ALLOCATION & ORDER ACCEPTANCE
            </h2>
            <p>
              Our collections are produced in finite, limited-run monograph allocations. Adding an item to your digital bag does 
              not constitute a reserved holding until checkout payment is authoritatively captured by Razorpay. An order confirmation 
              email represents acknowledgment of your offer; acceptance is finalized upon physical dispatch from our fulfillment facility.
            </p>
          </section>

          <section className="pt-6 space-y-3">
            <h2 className="font-display text-base font-bold uppercase tracking-wider text-black">
              4. DELIVERY, TRANSIT & RISK PASSING
            </h2>
            <p>
              Delivery timeframes ({CONFIG.shipping.estimatedDays}) represent estimated logistics windows. Title and risk of loss 
              for all purchased items pass to you upon successful delivery confirmed via carrier electronic signature or OTP 
              verification. If an external parcel shows evidence of severe tampering, you must decline delivery and alert our concierge.
            </p>
          </section>

          <section className="pt-6 space-y-3">
            <h2 className="font-display text-base font-bold uppercase tracking-wider text-black">
              5. INTELLECTUAL PROPERTY RIGHTS
            </h2>
            <p>
              All trademarks, typography designs, bespoke garment silhouettes, pattern blueprints, photography monograph assets, 
              and editorial copy displayed on this website are the proprietary intellectual property of {CONFIG.brandName}. 
              Any reproduction, redistribution, or commercial exploitation without prior written authorization is strictly prohibited.
            </p>
          </section>

          <section className="pt-6 space-y-3">
            <h2 className="font-display text-base font-bold uppercase tracking-wider text-black">
              6. GOVERNING LAW & DISPUTE RESOLUTION
            </h2>
            <p>
              These Terms and Conditions shall be governed by and interpreted in accordance with the substantive laws of the 
              Republic of India. Any legal dispute, controversy, or claim arising out of or relating to transactions on this platform 
              shall be subject to the exclusive jurisdiction of the competent courts of <strong>Mumbai, Maharashtra, India</strong>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
