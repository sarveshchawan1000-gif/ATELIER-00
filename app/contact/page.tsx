'use client';

import React, { useState } from 'react';
import { CONFIG } from '@/lib/config';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { Mail, Phone, MapPin, Clock, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const { showToast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    orderNo: '',
    subject: 'general',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      showToast('PLEASE FILL IN ALL REQUIRED FIELDS');
      return;
    }
    setSubmitted(true);
    showToast('YOUR INQUIRY HAS BEEN SENT TO THE ATELIER');
  };

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="border-b-2 border-black pb-8">
          <span className="font-display text-xs tracking-widest text-cyan uppercase bg-black px-2.5 py-1 inline-block mb-3">
            CONCIERGE & ATELIER
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tighter uppercase text-black">
            CONTACT THE ARCHIVE
          </h1>
          <p className="font-body text-sm md:text-base text-charcoal max-w-2xl mt-4">
            Our atelier team in Mumbai is available to assist with bespoke fit guidance, 
            order status inquiries, or private studio exhibition appointments.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Inquiry Form */}
          <div className="lg:col-span-7 bg-offwhite border-2 border-black p-6 md:p-10 shadow-[6px_6px_0px_0px_#111111]">
            {submitted ? (
              <div className="text-center py-16 space-y-6">
                <div className="w-16 h-16 bg-black text-cyan mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-display text-2xl font-bold tracking-tight uppercase">
                    INQUIRY RECEIVED
                  </h2>
                  <p className="font-body text-sm text-charcoal max-w-md mx-auto">
                    Thank you, <span className="font-bold text-black">{form.name}</span>. An atelier concierge representative 
                    will review your note and respond to <span className="font-bold text-black">{form.email}</span> within 24 business hours.
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: '', email: '', phone: '', orderNo: '', subject: 'general', message: '' });
                  }}
                >
                  SEND ANOTHER NOTE
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="font-display text-lg font-bold tracking-wider uppercase border-b border-black pb-3">
                  TRANSACTIONAL OR EDITORIAL INQUIRY
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-display text-xs font-bold tracking-wider uppercase block mb-1.5">
                      FULL NAME *
                    </label>
                    <Input
                      placeholder="ENTER FULL NAME"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="font-display text-xs font-bold tracking-wider uppercase block mb-1.5">
                      EMAIL ADDRESS *
                    </label>
                    <Input
                      type="email"
                      placeholder="NAME@DOMAIN.COM"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-display text-xs font-bold tracking-wider uppercase block mb-1.5">
                      PHONE NUMBER (OPTIONAL)
                    </label>
                    <Input
                      type="tel"
                      placeholder="+91 98000 00000"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="font-display text-xs font-bold tracking-wider uppercase block mb-1.5">
                      ORDER ID (IF APPLICABLE)
                    </label>
                    <Input
                      placeholder="E.G. BRD-2026-0049"
                      value={form.orderNo}
                      onChange={(e) => setForm({ ...form, orderNo: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="font-display text-xs font-bold tracking-wider uppercase block mb-1.5">
                    INQUIRY NATURE
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-offwhite border-2 border-black px-4 py-3 font-display text-xs tracking-wider uppercase focus:outline-none focus:border-cyan"
                  >
                    <option value="general">GENERAL CONCIERGE</option>
                    <option value="order">ORDER & SHIPPING STATUS</option>
                    <option value="returns">RETURNS & EXCHANGES</option>
                    <option value="sizing">BESPOKE FIT & SIZING CONSULTATION</option>
                    <option value="press">PRESS & EDITORIAL INQUIRY</option>
                  </select>
                </div>

                <div>
                  <label className="font-display text-xs font-bold tracking-wider uppercase block mb-1.5">
                    MESSAGE / SPECIFICATION *
                  </label>
                  <textarea
                    rows={5}
                    placeholder="DESCRIBE YOUR INQUIRY IN DETAIL..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    className="w-full bg-offwhite border-2 border-black p-4 font-body text-xs focus:outline-none focus:border-cyan text-black resize-y"
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" fullWidth>
                  TRANSMIT TO ATELIER <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            )}
          </div>

          {/* Contact Details & Atelier Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-black text-cream p-8 border-2 border-black space-y-6">
              <span className="font-display text-xs font-bold tracking-widest text-cyan uppercase block">
                DIRECT CHANNELS
              </span>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-cyan flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-display text-[10px] tracking-widest text-grey uppercase block">
                      CLIENT CONCIERGE
                    </span>
                    <a href="mailto:concierge@brand.fashion" className="font-display text-sm font-bold text-cream hover:text-cyan transition-colors">
                      concierge@{CONFIG.brandName.toLowerCase()}.fashion
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-cyan flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-display text-[10px] tracking-widest text-grey uppercase block">
                      TELEPHONE CONCIERGE
                    </span>
                    <a href="tel:+912249876543" className="font-display text-sm font-bold text-cream hover:text-cyan transition-colors">
                      +91 (022) 4987 6543
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-cyan flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-display text-[10px] tracking-widest text-grey uppercase block">
                      OPERATING HOURS
                    </span>
                    <p className="font-body text-xs text-grey">
                      Monday through Saturday: 10:00 – 19:00 IST<br />
                      Sunday & National Holidays: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-offwhite border-2 border-black p-8 space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-black" />
                <h3 className="font-display text-sm font-bold tracking-wider uppercase">
                  MUMBAI DESIGN CHAMBER
                </h3>
              </div>
              <p className="font-body text-xs text-charcoal leading-relaxed">
                Unit 402, Mathuradas Mills Compound<br />
                NM Joshi Marg, Lower Parel West<br />
                Mumbai, Maharashtra 400013, India
              </p>
              <div className="pt-2 border-t border-grey text-[11px] font-display text-charcoal uppercase">
                Visits by confirmed appointment only.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
