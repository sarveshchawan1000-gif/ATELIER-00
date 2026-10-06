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
    question: 'WHICH PAYMENT METHODS ARE ACCEPTED?',
    answer: 'We accept all major Indian payment rails via Razorpay: UPI (Google Pay, PhonePe, Paytm, BHIM), Indian and International Credit/Debit Cards (Visa, MasterCard, RuPay, Amex), Net Banking across 50+ Indian banks, and approved digital wallets.',
  },
  {
    id: 'f-2',
    category: 'orders',
    question: 'ARE TAXES (GST) INCLUDED IN THE DISPLAYED PRICE?',
    answer: `Yes. All prices listed on ${CONFIG.brandName} are fully inclusive of statutory Goods and Services Tax (GST). A detailed tax invoice containing our GSTIN number will accompany your dispatch and be emailed upon fulfillment.`,
  },
  {
    id: 'f-3',
    category: 'orders',
    question: 'DO YOU OFFER CASH ON DELIVERY (COD)?',
    answer: 'To ensure seamless transit security for limited monograph drops and eliminate high reverse logistics waste, our store operates exclusively on prepaid payment methods at this time.',
  },
  {
    id: 'f-4',
    category: 'shipping',
    question: 'HOW MUCH DOES SHIPPING COST AND HOW LONG DOES IT TAKE?',
    answer: `Orders of ${formatINR(CONFIG.shipping.freeShippingThresholdPaise)} or more receive complimentary standard shipping. For orders below this threshold, a flat delivery fee of ${formatINR(CONFIG.shipping.flatRatePaise)} is applied. Deliveries across metropolitan hubs take 2-3 business days, while regional pincodes arrive in 4-5 business days.`,
  },
  {
    id: 'f-5',
    category: 'shipping',
    question: 'HOW CAN I TRACK MY SHIPMENT?',
    answer: 'As soon as your package leaves our Mumbai fulfillment hub, an Airway Bill (AWB) tracking link is dispatched via SMS and email. You can view live checkpoint scans directly through our courier partner portal.',
  },
  {
    id: 'f-6',
    category: 'sizing',
    question: 'HOW DO YOUR GARMENTS FIT?',
    answer: 'Our silhouettes feature deliberate architectural draping—typically characterized by dropped shoulder lines, boxy chest measurements, and structured heavy drape. If you prefer a tailored, standard fit, we recommend sizing down one size. Review our comprehensive Size Guide for exact garment measurements.',
  },
  {
    id: 'f-7',
    category: 'sizing',
    question: 'WHAT DOES "GSM" MEAN FOR YOUR FABRICS?',
    answer: 'GSM (Grams per Square Metre) denotes the density of the knit. Standard commercial tees are 160–180 GSM. Our tees are engineered at 320 GSM, while our hoodies are crafted from 450 GSM French Terry, delivering exceptional structure, durability, and luxury tactile presence.',
  },
  {
    id: 'f-8',
    category: 'returns',
    question: `WHAT IS YOUR RETURN AND EXCHANGE WINDOW?`,
    answer: `We provide a ${CONFIG.returns.windowDays}-calendar-day return and exchange policy from the verified delivery timestamp. Garments must remain in unworn, unwashed condition with all original security seals and tags attached.`,
  },
  {
    id: 'f-9',
    category: 'returns',
    question: `HOW LONG DOES A REFUND TAKE TO REFLECT?`,
    answer: `Once your return passes quality inspection at our atelier, refunds are initiated within 24 hours. UPI payments settle in 24–48 banking hours; credit/debit card refunds typically credit your statement in ${CONFIG.returns.refundTimelineDays}.`,
  },
  {
    id: 'f-10',
    category: 'care',
    question: 'HOW SHOULD I WASH AND CARE FOR HEAVYWEIGHT ORGANIC COTTON?',
    answer: 'Wash cold inside out at 30°C or below on a gentle cycle with neutral liquid detergent. Do not tumble dry. Dry flat in the shade to preserve garment shape and avoid direct sun bleaching. Use a cool iron on reverse.',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'ALL QUESTIONS' },
  { id: 'orders', label: 'ORDERS & PAYMENT' },
  { id: 'shipping', label: 'SHIPPING & LOGISTICS' },
  { id: 'sizing', label: 'SIZING & FABRIC' },
  { id: 'returns', label: 'RETURNS & EXCHANGES' },
  { id: 'care', label: 'GARMENT CARE' },
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
    <main className="min-h-screen pt-24 md:pt-32 pb-24 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b-2 border-black pb-8">
          <span className="font-display text-xs tracking-widest text-cyan uppercase bg-black px-2.5 py-1 inline-block mb-3">
            ASSISTANCE ARCHIVE
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tighter uppercase text-black">
            FREQUENTLY ASKED QUESTIONS
          </h1>
          <p className="font-body text-sm md:text-base text-charcoal max-w-2xl mt-4">
            Detailed guidance regarding order fulfillment, sizing specifications, payment rails, 
            and atelier care protocols.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal pointer-events-none" />
          <Input
            placeholder="SEARCH QUESTIONS (E.G. GST, SHIPPING, RETURN, SIZING)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-3.5 bg-offwhite border-2 border-black text-sm uppercase tracking-wider"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`font-display text-xs font-bold tracking-wider uppercase px-4 py-2 border-2 transition-colors ${
                activeCategory === cat.id
                  ? 'bg-black text-cyan border-black'
                  : 'bg-offwhite text-black border-grey hover:border-black'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="bg-offwhite border-2 border-black p-12 text-center space-y-4">
              <HelpCircle className="w-8 h-8 text-charcoal mx-auto" />
              <p className="font-display text-base font-bold uppercase tracking-wider">
                NO MATCHING QUESTIONS FOUND
              </p>
              <p className="font-body text-xs text-charcoal">
                Try searching for a different keyword or reach out directly to our concierge team.
              </p>
              <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
                CLEAR SEARCH FILTERS
              </Button>
            </div>
          ) : (
            filteredFAQs.map((faq) => {
              const isOpen = !!openIds[faq.id];
              return (
                <div
                  key={faq.id}
                  className="bg-offwhite border-2 border-black transition-colors"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-display text-sm md:text-base font-bold tracking-wider uppercase text-black hover:text-cyan hover:bg-black/5 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <span className="p-1 bg-black text-cyan flex-shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-grey font-body text-xs md:text-sm text-charcoal leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still Need Help Banner */}
        <div className="bg-black text-cream p-8 md:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 border-2 border-black">
          <div>
            <h3 className="font-display text-xl font-bold uppercase tracking-tight text-cream">
              HAVE A BESPOKE QUESTION?
            </h3>
            <p className="font-body text-xs text-grey mt-1">
              Our atelier client advisors are available Monday to Saturday, 10:00 - 19:00 IST.
            </p>
          </div>
          <Link href="/contact" className="w-full sm:w-auto">
            <Button variant="primary" className="bg-cyan text-black hover:bg-cream w-full sm:w-auto">
              CONTACT CONCIERGE <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
