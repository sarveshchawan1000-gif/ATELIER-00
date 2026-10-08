'use client';

import React, { useState } from 'react';
import { CONFIG } from '@/lib/config';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { Mail, Phone, MapPin, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

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
      showToast('Please fill in all required fields.');
      return;
    }
    setSubmitted(true);
    showToast('Your inquiry has been sent to client care.');
  };

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-24 px-4 md:px-8 bg-cream text-black">
      <div className="max-w-6xl mx-auto space-y-14">
        {/* Header */}
        <div className="border-b border-grey/60 pb-8">
          <span className="font-body text-xs font-medium tracking-wider text-charcoal uppercase block mb-3">
            Client Concierge
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-black">
            Contact Us
          </h1>
          <p className="font-body text-sm md:text-base text-charcoal max-w-2xl mt-4 leading-relaxed">
            Our client care team is on hand to assist with bespoke fit consultations, order tracking, and private appointments.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Inquiry Form */}
          <div className="lg:col-span-7 bg-offwhite border border-grey/50 rounded-sm p-6 sm:p-10">
            {submitted ? (
              <div className="text-center py-12 space-y-6">
                <div className="w-14 h-14 bg-black/5 text-black rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-tight">
                    Inquiry Received
                  </h2>
                  <p className="font-body text-sm text-charcoal max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="font-medium text-black">{form.name}</span>. A concierge representative 
                    will review your note and respond to <span className="font-medium text-black">{form.email}</span> within 24 business hours.
                  </p>
                </div>
                <Button
                  variant="primary"
                  className="bg-black text-white hover:bg-charcoal rounded-sm font-medium"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: '', email: '', phone: '', orderNo: '', subject: 'general', message: '' });
                  }}
                >
                  Send Another Note
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b border-grey/30 pb-3">
                  <h2 className="font-display text-base font-semibold tracking-tight text-black">
                    Send a Message
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs font-medium text-charcoal uppercase tracking-wider block mb-1.5">
                      Full Name *
                    </label>
                    <Input
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      className="bg-white border-grey/40 rounded-sm focus:border-black text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs font-medium text-charcoal uppercase tracking-wider block mb-1.5">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      placeholder="name@domain.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="bg-white border-grey/40 rounded-sm focus:border-black text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs font-medium text-charcoal uppercase tracking-wider block mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <Input
                      type="tel"
                      placeholder="+91 98000 00000"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="bg-white border-grey/40 rounded-sm focus:border-black text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs font-medium text-charcoal uppercase tracking-wider block mb-1.5">
                      Order ID (Optional)
                    </label>
                    <Input
                      placeholder="e.g. BRD-2026-0049"
                      value={form.orderNo}
                      onChange={(e) => setForm({ ...form, orderNo: e.target.value })}
                      className="bg-white border-grey/40 rounded-sm focus:border-black text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-body text-xs font-medium text-charcoal uppercase tracking-wider block mb-1.5">
                    Subject / Topic
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-white border border-grey/40 rounded-sm px-4 py-2.5 font-body text-xs text-black focus:outline-none focus:border-black transition-colors"
                  >
                    <option value="general">General Concierge</option>
                    <option value="order">Order &amp; Shipping Status</option>
                    <option value="returns">Returns &amp; Exchanges</option>
                    <option value="sizing">Bespoke Fit &amp; Sizing Advice</option>
                    <option value="press">Press &amp; Collaborations</option>
                  </select>
                </div>

                <div>
                  <label className="font-body text-xs font-medium text-charcoal uppercase tracking-wider block mb-1.5">
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Describe your inquiry in detail..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    className="w-full bg-white border border-grey/40 rounded-sm p-4 font-body text-xs focus:outline-none focus:border-black text-black resize-y transition-colors"
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" fullWidth className="bg-black text-white hover:bg-charcoal rounded-sm font-medium">
                  Transmit Message <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            )}
          </div>

          {/* Contact Details & Atelier Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-black text-cream rounded-sm p-8 space-y-6">
              <span className="font-body text-xs font-medium tracking-wider text-white/50 uppercase block">
                Direct Channels
              </span>

              <div className="space-y-5">
                <div className="flex items-start gap-3.5">
                  <Mail className="w-4 h-4 text-white/60 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-body text-[11px] font-medium tracking-wider text-white/50 uppercase block">
                      Client Concierge
                    </span>
                    <a href={`mailto:concierge@${CONFIG.brandName.toLowerCase()}.fashion`} className="font-body text-sm font-medium text-white hover:text-white/80 transition-colors">
                      concierge@{CONFIG.brandName.toLowerCase()}.fashion
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Phone className="w-4 h-4 text-white/60 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-body text-[11px] font-medium tracking-wider text-white/50 uppercase block">
                      Telephone Concierge
                    </span>
                    <a href="tel:+912249876543" className="font-body text-sm font-medium text-white hover:text-white/80 transition-colors">
                      +91 (022) 4987 6543
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Clock className="w-4 h-4 text-white/60 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-body text-[11px] font-medium tracking-wider text-white/50 uppercase block">
                      Operating Hours
                    </span>
                    <p className="font-body text-xs text-white/70 leading-relaxed mt-0.5">
                      Monday through Saturday: 10:00 – 19:00 IST<br />
                      Sunday &amp; National Holidays: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-offwhite border border-grey/50 rounded-sm p-8 space-y-3">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-charcoal" />
                <h3 className="font-display text-sm font-semibold tracking-tight text-black">
                  Mumbai Design Chamber
                </h3>
              </div>
              <p className="font-body text-xs text-charcoal leading-relaxed">
                Unit 402, Mathuradas Mills Compound<br />
                NM Joshi Marg, Lower Parel West<br />
                Mumbai, Maharashtra 400013, India
              </p>
              <div className="pt-3 border-t border-grey/30 text-[11px] font-body text-charcoal/70">
                Studio visits by confirmed appointment only.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
