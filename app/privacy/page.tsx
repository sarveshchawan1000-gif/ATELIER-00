import React from 'react';
import type { Metadata } from 'next';
import { CONFIG } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `${CONFIG.brandName} Privacy Policy and compliance with India Digital Personal Data Protection Act.`,
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-24 px-4 md:px-8 bg-cream text-black">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-grey/60 pb-8">
          <span className="font-body text-xs font-medium tracking-wider text-charcoal uppercase block mb-3">
            Statutory Governance
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-black">
            Privacy Policy
          </h1>
          <p className="font-body text-xs text-charcoal/80 uppercase tracking-wider mt-4">
            Effective Date: October 2026 · Compliant with Digital Personal Data Protection Act (India)
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 font-body text-xs md:text-sm text-charcoal leading-relaxed divide-y divide-grey/30">
          <section className="space-y-3">
            <h2 className="font-display text-base font-semibold tracking-tight text-black">
              1. Preamble &amp; Data Fiduciary
            </h2>
            <p>
              This Privacy Policy describes how {CONFIG.brandName} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) collects, 
              processes, stores, and protects personal data when you visit our digital storefront or purchase our 
              garment editions. We act as the Data Fiduciary in full accordance with the Digital Personal Data Protection Act 
              (DPDPA) 2023 of the Republic of India.
            </p>
          </section>

          <section className="pt-6 space-y-3">
            <h2 className="font-display text-base font-semibold tracking-tight text-black">
              2. Categories of Personal Data Collected
            </h2>
            <p>We collect only the minimum data strictly necessary for order processing and logistics fulfillment:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li><strong>Identity &amp; Contact:</strong> Full name, telephone number, and billing/shipping email address.</li>
              <li><strong>Delivery Coordinates:</strong> Postal address, city, state, PIN code, and optional landmarks.</li>
              <li><strong>Transactional Data:</strong> Order reference number, purchased variant specifications, and payment reference tokens.</li>
              <li><strong>Technical Identifiers:</strong> IP address, device viewport, operating system, and essential cookies.</li>
            </ul>
          </section>

          <section className="pt-6 space-y-3">
            <h2 className="font-display text-base font-semibold tracking-tight text-black">
              3. Payment Processing Security (Razorpay)
            </h2>
            <p>
              We do <strong>NOT</strong> process, store, or view full credit/debit card numbers, CVVs, or UPI PINs on our servers. 
              All financial transactions are tokenized and processed via <strong>Razorpay</strong>, a PCI-DSS Level 1 certified 
              payment aggregator licensed by the Reserve Bank of India (RBI).
            </p>
          </section>

          <section className="pt-6 space-y-3">
            <h2 className="font-display text-base font-semibold tracking-tight text-black">
              4. Purposes of Processing
            </h2>
            <p>Your data is processed exclusively for lawful, specified purposes:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Fulfilling orders, generating delivery manifests, and issuing GST tax invoices.</li>
              <li>Dispatching transactional notifications (order confirmation, AWB tracking updates).</li>
              <li>Coordinating reverse-pickup logistics for verified return or exchange requests.</li>
              <li>Preventing payment fraud and verifying suspicious transactions.</li>
            </ul>
          </section>

          <section className="pt-6 space-y-3">
            <h2 className="font-display text-base font-semibold tracking-tight text-black">
              5. Data Retention &amp; Security
            </h2>
            <p>
              Personal data is maintained in secure, encrypted cloud facilities with row-level security access policies. 
              Transactional logs and invoice records are preserved for the statutory duration mandated under the Indian GST Act 
              (7 years), following which data is permanently sanitized or pseudonymized.
            </p>
          </section>

          <section className="pt-6 space-y-3">
            <h2 className="font-display text-base font-semibold tracking-tight text-black">
              6. Your Statutory Rights
            </h2>
            <p>
              Under Indian data protection laws, you retain the right to:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Request a summary of personal data held in our repositories.</li>
              <li>Request correction or updating of inaccurate delivery credentials.</li>
              <li>Withdraw consent for optional newsletter dispatches at any time.</li>
              <li>Request erasure of your customer profile subject to mandatory statutory retention rules.</li>
            </ul>
          </section>

          <section className="pt-6 space-y-3">
            <h2 className="font-display text-base font-semibold tracking-tight text-black">
              7. Grievance Redressal Officer
            </h2>
            <p>
              In accordance with the Information Technology Act 2000 and DPDP Act 2023, questions or grievances regarding 
              personal data handling may be addressed directly to our appointed Grievance Officer:
            </p>
            <div className="bg-offwhite border border-grey/50 rounded-sm p-5 space-y-1.5 font-body text-xs text-charcoal">
              <p><strong className="text-black">Attn:</strong> Grievance Officer · Data Privacy Dept</p>
              <p><strong className="text-black">Entity:</strong> {CONFIG.brandName} Luxury Apparel Private Limited</p>
              <p><strong className="text-black">Address:</strong> Lower Parel West, Mumbai, Maharashtra 400013, India</p>
              <p><strong className="text-black">Email:</strong> privacy@{CONFIG.brandName.toLowerCase()}.fashion</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
