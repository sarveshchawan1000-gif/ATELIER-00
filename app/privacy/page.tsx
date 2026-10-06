import React from 'react';
import type { Metadata } from 'next';
import { CONFIG } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `${CONFIG.brandName} Privacy Policy and compliance with India Digital Personal Data Protection Act.`,
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b-2 border-black pb-8">
          <span className="font-display text-xs tracking-widest text-cyan uppercase bg-black px-2.5 py-1 inline-block mb-3">
            STATUTORY GOVERNANCE
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tighter uppercase text-black">
            PRIVACY POLICY
          </h1>
          <p className="font-body text-xs text-charcoal uppercase tracking-wider mt-4">
            EFFECTIVE DATE: OCTOBER 2026 // COMPLIANT WITH DIGITAL PERSONAL DATA PROTECTION ACT (INDIA)
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 font-body text-xs md:text-sm text-charcoal leading-relaxed divide-y divide-grey">
          <section className="space-y-3">
            <h2 className="font-display text-base font-bold uppercase tracking-wider text-black">
              1. PREAMBLE & DATA FIDUCIARY
            </h2>
            <p>
              This Privacy Policy describes how {CONFIG.brandName} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) collects, 
              processes, stores, and protects personal data when you visit our digital exhibition storefront or purchase our 
              garment monographs. We act as the Data Fiduciary in full accordance with the Digital Personal Data Protection Act 
              (DPDPA) 2023 of the Republic of India.
            </p>
          </section>

          <section className="pt-6 space-y-3">
            <h2 className="font-display text-base font-bold uppercase tracking-wider text-black">
              2. CATEGORIES OF PERSONAL DATA COLLECTED
            </h2>
            <p>We collect only the minimum data strictly necessary for order processing and logistics fulfillment:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Identity & Contact:</strong> Full name, telephone number, and billing/shipping email address.</li>
              <li><strong>Delivery Coordinates:</strong> Postal address, city, state, PIN code, and optional landmarks.</li>
              <li><strong>Transactional Data:</strong> Order reference number, purchased variant specifications, and payment reference tokens.</li>
              <li><strong>Technical Identifiers:</strong> IP address, device viewport, operating system, and essential cookies.</li>
            </ul>
          </section>

          <section className="pt-6 space-y-3">
            <h2 className="font-display text-base font-bold uppercase tracking-wider text-black">
              3. PAYMENT PROCESSING SECURITY (RAZORPAY)
            </h2>
            <p>
              We do <strong>NOT</strong> process, store, or view full credit/debit card numbers, CVVs, or UPI PINs on our servers. 
              All financial transactions are tokenized and processed via <strong>Razorpay</strong>, a PCI-DSS Level 1 certified 
              payment aggregator licensed by the Reserve Bank of India (RBI).
            </p>
          </section>

          <section className="pt-6 space-y-3">
            <h2 className="font-display text-base font-bold uppercase tracking-wider text-black">
              4. PURPOSES OF PROCESSING
            </h2>
            <p>Your data is processed exclusively for lawful, specified purposes:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Fulfilling orders, generating delivery manifests, and issuing GST tax invoices.</li>
              <li>Dispatching transactional notifications (order confirmation, AWB tracking updates).</li>
              <li>Coordinating reverse-pickup logistics for verified return or exchange requests.</li>
              <li>Preventing payment fraud and verifying suspicious transactions.</li>
            </ul>
          </section>

          <section className="pt-6 space-y-3">
            <h2 className="font-display text-base font-bold uppercase tracking-wider text-black">
              5. DATA RETENTION & SECURITY
            </h2>
            <p>
              Personal data is maintained in secure, encrypted cloud facilities with row-level security access policies. 
              Transactional logs and invoice records are preserved for the statutory duration mandated under the Indian GST Act 
              (7 years), following which data is permanently sanitized or pseudonymized.
            </p>
          </section>

          <section className="pt-6 space-y-3">
            <h2 className="font-display text-base font-bold uppercase tracking-wider text-black">
              6. YOUR STATUTORY RIGHTS AS A DATA PRINCIPAL
            </h2>
            <p>
              Under Indian data protection laws, you retain the right to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Request a summary of personal data held in our repositories.</li>
              <li>Request correction or updating of inaccurate delivery credentials.</li>
              <li>Withdraw consent for optional newsletter dispatches at any time.</li>
              <li>Request erasure of your customer profile subject to mandatory statutory retention rules.</li>
            </ul>
          </section>

          <section className="pt-6 space-y-3">
            <h2 className="font-display text-base font-bold uppercase tracking-wider text-black">
              7. GRIEVANCE REDRESSAL OFFICER
            </h2>
            <p>
              In accordance with the Information Technology Act 2000 and DPDP Act 2023, questions or grievances regarding 
              personal data handling may be addressed directly to our appointed Grievance Officer:
            </p>
            <div className="bg-offwhite border-2 border-black p-4 space-y-1 font-display text-xs uppercase">
              <p><strong>ATTN:</strong> GRIEVANCE OFFICER // DATA PRIVACY DEPT</p>
              <p><strong>ENTITY:</strong> {CONFIG.brandName} LUXURY APPAREL PRIVATE LIMITED</p>
              <p><strong>ADDRESS:</strong> LOWER PAREL WEST, MUMBAI, MAHARASHTRA 400013, INDIA</p>
              <p><strong>EMAIL:</strong> PRIVACY@{CONFIG.brandName.toLowerCase()}.FASHION</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
