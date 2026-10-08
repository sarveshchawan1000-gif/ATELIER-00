'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CONFIG } from '@/lib/config';
import { formatINR } from '@/lib/pricing';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search, ChevronDown, ChevronUp, HelpCircle, ArrowRight } from 'lucide-react';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'f-1',
    category: 'orders',
    question: 'Which payment methods are accepted?',
    answer: 'We accept all major Indian payment rails via Razorpay: UPI (Google Pay, PhonePe, Paytm, BHIM), Indian and International Credit/Debit Cards (Visa, MasterCard, RuPay, Amex), Net Banking across 50+ Indian banks, and approved digital wallets.',
  },
  {
    id: 'f-2',
    category: 'orders',
    question: 'Are taxes (GST) included in the displayed price?',
    answer: `Yes. All prices listed on ${CONFIG.brandName} are fully inclusive of statutory Goods and Services Tax (GST). A detailed tax invoice containing our GSTIN number will accompany your dispatch and be emailed upon fulfillment.`,
  },
  {
    id: 'f-3',
    category: 'orders',
    question: 'Do you offer Cash on Delivery (COD)?',
    answer: 'To ensure seamless transit security for limited drops and eliminate high reverse logistics waste, our store operates exclusively on prepaid payment methods at this time.',
  },
  {
    id: 'f-4',
    category: 'shipping',
    question: 'How much does shipping cost and how long does it take?',
    answer: `Orders of ${formatINR(CONFIG.shipping.freeShippingThresholdPaise)} or more receive complimentary standard shipping. For orders below this threshold, a flat delivery fee of ${formatINR(CONFIG.shipping.flatRatePaise)} is applied. Deliveries across metropolitan hubs take 2-3 business days, while regional pincodes arrive in 4-5 business days.`,
  },
  {
    id: 'f-5',
    category: 'shipping',
    question: 'How can I track my shipment?',
    answer: 'As soon as your package leaves our Mumbai fulfillment hub, an Airway Bill (AWB) tracking link is dispatched via SMS and email. You can view live checkpoint scans directly through our courier partner portal.',
  },
  {
    id: 'f-6',
    category: 'sizing',
    question: 'How do your garments fit?',
    answer: 'Our silhouettes feature deliberate architectural draping—typically characterized by dropped shoulder lines, boxy chest measurements, and structured heavy drape. If you prefer a tailored, standard fit, we recommend sizing down one size. Review our comprehensive Size Guide for exact garment measurements.',
  },
  {
    id: 'f-7',
    category: 'sizing',
    question: 'What does "GSM" mean for your fabrics?',
    answer: 'GSM (Grams per Square Metre) denotes the density of the knit. Standard commercial tees are 160–180 GSM. Our tees are engineered at 320 GSM, while our hoodies are crafted from 450 GSM French Terry, delivering exceptional structure, durability, and luxury tactile presence.',
  },
  {
    id: 'f-8',
    category: 'returns',
    question: `What is your return and exchange window?`,
    answer: `We provide a ${CONFIG.returns.windowDays}-calendar-day return and exchange policy from the verified delivery timestamp. Garments must remain in unworn, unwashed condition with all original security seals and tags attached.`,
  },
  {
    id: 'f-9',
    category: 'returns',
    question: `How long does a refund take to reflect?`,
    answer: `Once your return passes quality inspection, refunds are initiated within 24 hours. UPI payments settle in 24–48 banking hours; credit/debit card refunds typically credit your statement in ${CONFIG.returns.refundTimelineDays}.`,
  },
  {
    id: 'f-10',
    category: 'care',
    question: 'How should I wash and care for heavyweight organic cotton?',
    answer: 'Wash cold inside out at 30°C or below on a gentle cycle with neutral liquid detergent. Do not tumble dry. Dry flat in the shade to preserve garment shape and avoid direct sun bleaching. Use a cool iron on reverse.',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'orders', label: 'Orders & Payment' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'sizing', label: 'Sizing & Fabric' },
  { id: 'returns', label: 'Returns' },
  { id: 'care', label: 'Garment Care' },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({ 'f-1': true, 'f-4': true });

  const toggleFAQ = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFAQs = FAQ_DATA.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesQuery =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-24 px-4 md:px-8 bg-cream text-black">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="border-b border-grey/60 pb-8">
          <span className="font-body text-xs font-medium tracking-wider text-charcoal uppercase block mb-3">
            Help Center
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-black">
            Frequently Asked Questions
          </h1>
          <p className="font-body text-sm md:text-base text-charcoal max-w-2xl mt-4 leading-relaxed">
            Guidance on orders, sizing, payment, shipping, and garment care.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/50 pointer-events-none" />
          <Input
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 py-3 bg-white border border-grey/60 rounded-sm text-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`font-body text-sm font-medium px-4 py-2 border rounded-full transition-all ${
                activeCategory === cat.id
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-charcoal border-grey/60 hover:border-black/30'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {filteredFAQs.length === 0 ? (
            <div className="bg-offwhite border border-grey/30 rounded-sm p-12 text-center space-y-4">
              <HelpCircle className="w-7 h-7 text-charcoal/40 mx-auto" />
              <p className="font-display text-base font-medium text-black">
                No matching questions found
              </p>
              <p className="font-body text-sm text-charcoal">
                Try a different keyword or reach out to our support team.
              </p>
              <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }} className="font-medium">
                Clear Filters
              </Button>
            </div>
          ) : (
            filteredFAQs.map((faq) => {
              const isOpen = !!openIds[faq.id];
              return (
                <div
                  key={faq.id}
                  className="bg-offwhite border border-grey/30 rounded-sm overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-body text-sm md:text-base font-medium text-black hover:bg-black/[0.02] transition-colors"
                  >
                    <span>{faq.question}</span>
                    <span className="text-charcoal/40 flex-shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 border-t border-grey/20 font-body text-sm text-charcoal leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Help Banner */}
        <div className="bg-black text-white rounded-sm p-8 md:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-lg font-semibold text-white">
              Have a specific question?
            </h3>
            <p className="font-body text-sm text-white/50 mt-1">
              Our team is available Monday to Saturday, 10:00 – 19:00 IST.
            </p>
          </div>
          <Link href="/contact" className="w-full sm:w-auto">
            <Button variant="primary" className="bg-white text-black hover:bg-white/90 w-full sm:w-auto font-medium transition-all">
              Contact Support <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
