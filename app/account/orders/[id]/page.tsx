import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { formatINR } from '@/lib/pricing';
import { CONFIG } from '@/lib/config';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Clock, Truck, Package, ArrowLeft, ShieldCheck, HelpCircle } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order Details #${id.toUpperCase()}`,
    description: `Track shipment and view order breakdown for #${id}`,
  };
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderNo = id.toUpperCase();

  // Simulated order details for demo tracking
  const order = {
    orderNo,
    placedAt: '06 OCT 2026, 18:30 IST',
    status: 'shipped', // 'paid' | 'processing' | 'shipped' | 'delivered'
    awb: 'BLUEDART-88291041',
    carrier: 'Blue Dart Air Express',
    estimatedDelivery: '08 OCT 2026',
    customerName: 'Aarav Mehta',
    email: 'aarav.mehta@example.com',
    phone: '+91 98200 12345',
    shippingAddress: {
      line1: 'Apt 12B, Sea Green Towers',
      line2: 'Worli Sea Face',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400018',
    },
    items: [
      {
        name: 'OVERSIZED COTTON TEE',
        size: 'M',
        colour: 'WASHED BLACK',
        unitPricePaise: 499900,
        quantity: 1,
      },
      {
        name: 'HEAVYWEIGHT ZIP HOODIE',
        size: 'L',
        colour: 'RAW CREAM',
        unitPricePaise: 899900,
        quantity: 1,
      },
    ],
    subtotalPaise: 1399800,
    shippingPaise: 0,
    totalPaise: 1399800,
  };

  const steps = [
    { label: 'PAYMENT CONFIRMED', done: true, time: '06 Oct, 18:30' },
    { label: 'ATELIER PROCESSING', done: true, time: '07 Oct, 09:15' },
    { label: 'DISPATCHED & IN TRANSIT', done: true, current: true, time: '07 Oct, 14:00' },
    { label: 'OUT FOR DELIVERY', done: false, time: 'Est. 08 Oct' },
  ];

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-24 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Navigation back */}
        <Link
          href="/account"
          className="inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-charcoal hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> BACK TO ACCOUNT
        </Link>

        {/* Header */}
        <div className="border-b-2 border-black pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight uppercase">
                ORDER #{order.orderNo}
              </h1>
              <span className="bg-black text-cyan px-2.5 py-0.5 font-display text-[10px] font-bold tracking-widest uppercase">
                {order.status.toUpperCase()}
              </span>
            </div>
            <p className="font-body text-xs text-charcoal mt-1">
              Placed on {order.placedAt} // Prepaid Razorpay
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/returns">
              <Button variant="ghost" size="sm">
                REQUEST RETURN
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="primary" size="sm">
                CONTACT CONCIERGE
              </Button>
            </Link>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="bg-offwhite border-2 border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_#111111] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-grey pb-4">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-black" />
              <div>
                <span className="font-display text-xs font-bold uppercase tracking-wider block">
                  CARRIER: {order.carrier}
                </span>
                <span className="font-body text-[11px] text-charcoal">
                  AWB NUMBER: <strong className="text-black">{order.awb}</strong>
                </span>
              </div>
            </div>
            <div className="font-display text-xs font-bold uppercase text-black bg-cyan/30 border border-cyan px-3 py-1">
              ESTIMATED ARRIVAL: {order.estimatedDelivery}
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
            {steps.map((st, i) => (
              <div key={st.label} className="flex flex-col gap-1.5 relative">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 flex items-center justify-center font-display text-xs font-bold ${
                      st.done
                        ? 'bg-black text-cyan'
                        : 'bg-cream border border-grey text-charcoal'
                    }`}
                  >
                    {st.done ? '✓' : i + 1}
                  </div>
                  <span className="font-display text-[11px] font-bold uppercase text-black">
                    {st.label}
                  </span>
                </div>
                <span className="font-body text-[10px] text-charcoal pl-8">
                  {st.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Details Split: Items & Destination */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Items breakdown */}
          <div className="md:col-span-7 bg-offwhite border-2 border-black p-6 space-y-4">
            <h2 className="font-display text-sm font-bold tracking-wider uppercase border-b border-black pb-3">
              GARMENT MONOGRAPHS
            </h2>

            <div className="divide-y divide-grey">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3.5 first:pt-0 flex items-center justify-between gap-4 font-display text-xs">
                  <div>
                    <span className="font-bold text-black uppercase block">{item.name}</span>
                    <span className="font-body text-[11px] text-charcoal uppercase">
                      {item.colour} // SIZE {item.size} // QTY {item.quantity}
                    </span>
                  </div>
                  <span className="font-bold text-black">
                    {formatINR(item.unitPricePaise * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div className="border-t-2 border-black pt-4 space-y-2 font-display text-xs">
              <div className="flex justify-between text-charcoal">
                <span>SUBTOTAL</span>
                <span className="text-black font-bold">{formatINR(order.subtotalPaise)}</span>
              </div>
              <div className="flex justify-between text-charcoal">
                <span>COMPLIMENTARY SHIPPING</span>
                <span className="text-cyan font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-base font-bold text-black border-t border-grey pt-2">
                <span>TOTAL PAID</span>
                <span>{formatINR(order.totalPaise)}</span>
              </div>
              <p className="font-body text-[10px] text-charcoal pt-1">
                {CONFIG.taxes.gstInclusiveNote} // Tax Invoice attached to parcel
              </p>
            </div>
          </div>

          {/* Delivery Coordinates & Help */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-offwhite border-2 border-black p-6 space-y-3 font-display text-xs">
              <h2 className="font-bold tracking-wider uppercase border-b border-black pb-2 text-black">
                DELIVERY ADDRESS
              </h2>
              <div className="font-body text-xs text-charcoal space-y-1">
                <p className="font-bold text-black font-display">{order.customerName}</p>
                <p>{order.shippingAddress.line1}</p>
                <p>{order.shippingAddress.line2}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
                </p>
                <p className="pt-1 text-black font-bold font-display">{order.phone}</p>
              </div>
            </div>

            <div className="bg-black text-cream p-6 border-2 border-black space-y-3">
              <div className="flex items-center gap-2 text-cyan font-display text-xs font-bold uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>ARCHIVAL TRANSIT GUARANTEE</span>
              </div>
              <p className="font-body text-[11px] text-grey leading-relaxed">
                If the security tamper-seal on your rigid carton appears compromised upon delivery, 
                kindly decline handover and notify our client concierge immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
