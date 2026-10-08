import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { formatINR } from '@/lib/pricing';
import { CONFIG } from '@/lib/config';
import { Button } from '@/components/ui/Button';
import { Truck, ArrowLeft, ShieldCheck } from 'lucide-react';

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
    placedAt: '06 Oct 2026, 18:30 IST',
    status: 'shipped', // 'paid' | 'processing' | 'shipped' | 'delivered'
    awb: 'BLUEDART-88291041',
    carrier: 'Blue Dart Air Express',
    estimatedDelivery: '08 Oct 2026',
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
        name: 'Oversized Cotton Tee',
        size: 'M',
        colour: 'Washed Black',
        unitPricePaise: 499900,
        quantity: 1,
      },
      {
        name: 'Heavyweight Zip Hoodie',
        size: 'L',
        colour: 'Raw Cream',
        unitPricePaise: 899900,
        quantity: 1,
      },
    ],
    subtotalPaise: 1399800,
    shippingPaise: 0,
    totalPaise: 1399800,
  };

  const steps = [
    { label: 'Payment Confirmed', done: true, time: '06 Oct, 18:30' },
    { label: 'Order Processing', done: true, time: '07 Oct, 09:15' },
    { label: 'Dispatched & In Transit', done: true, current: true, time: '07 Oct, 14:00' },
    { label: 'Out for Delivery', done: false, time: 'Est. 08 Oct' },
  ];

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-24 px-4 md:px-8 bg-cream text-black">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Navigation back */}
        <Link
          href="/account"
          className="inline-flex items-center gap-2 font-body text-xs font-medium uppercase tracking-wider text-charcoal hover:text-black transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Account
        </Link>

        {/* Header */}
        <div className="border-b border-grey/60 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
                Order #{order.orderNo}
              </h1>
              <span className="bg-black text-white px-2.5 py-0.5 font-body text-[11px] font-medium tracking-wider uppercase rounded-full">
                {order.status}
              </span>
            </div>
            <p className="font-body text-xs text-charcoal mt-1">
              Placed on {order.placedAt} · Prepaid Razorpay
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/returns">
              <Button variant="ghost" size="sm" className="rounded-sm font-medium">
                Request Return
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="primary" size="sm" className="bg-black text-white hover:bg-charcoal rounded-sm font-medium">
                Contact Concierge
              </Button>
            </Link>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="bg-offwhite border border-grey/50 rounded-sm p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-grey/30 pb-4">
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-charcoal" />
              <div>
                <span className="font-body text-xs font-medium uppercase tracking-wider block text-black">
                  Carrier: {order.carrier}
                </span>
                <span className="font-body text-xs text-charcoal">
                  AWB Number: <strong className="text-black font-medium">{order.awb}</strong>
                </span>
              </div>
            </div>
            <div className="font-body text-xs font-medium text-black bg-cream border border-grey/40 px-3 py-1 rounded-sm">
              Estimated Arrival: {order.estimatedDelivery}
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
            {steps.map((st, i) => (
              <div key={st.label} className="flex flex-col gap-1.5 relative">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-body text-xs font-medium ${
                      st.done
                        ? 'bg-black text-white'
                        : 'bg-cream border border-grey/50 text-charcoal'
                    }`}
                  >
                    {st.done ? '✓' : i + 1}
                  </div>
                  <span className="font-body text-xs font-medium text-black">
                    {st.label}
                  </span>
                </div>
                <span className="font-body text-[11px] text-charcoal pl-8">
                  {st.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Details Split: Items & Destination */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Items breakdown */}
          <div className="md:col-span-7 bg-offwhite border border-grey/50 rounded-sm p-6 space-y-4">
            <h2 className="font-display text-sm font-semibold tracking-tight uppercase border-b border-grey/30 pb-3 text-black">
              Garments
            </h2>

            <div className="divide-y divide-grey/20">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3.5 first:pt-0 flex items-center justify-between gap-4 font-body text-xs">
                  <div>
                    <span className="font-medium text-black block">{item.name}</span>
                    <span className="text-[11px] text-charcoal">
                      {item.colour} · Size {item.size} · Qty {item.quantity}
                    </span>
                  </div>
                  <span className="font-medium text-black">
                    {formatINR(item.unitPricePaise * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div className="border-t border-grey/30 pt-4 space-y-2 font-body text-xs">
              <div className="flex justify-between text-charcoal">
                <span>Subtotal</span>
                <span className="text-black font-medium">{formatINR(order.subtotalPaise)}</span>
              </div>
              <div className="flex justify-between text-charcoal">
                <span>Shipping</span>
                <span className="text-black font-medium">Free</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-black border-t border-grey/20 pt-2">
                <span>Total Paid</span>
                <span>{formatINR(order.totalPaise)}</span>
              </div>
              <p className="font-body text-[11px] text-charcoal pt-1">
                {CONFIG.taxes.gstInclusiveNote} · Tax Invoice attached to package
              </p>
            </div>
          </div>

          {/* Delivery Coordinates & Help */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-offwhite border border-grey/50 rounded-sm p-6 space-y-3 font-body text-xs">
              <h2 className="font-display font-semibold tracking-tight uppercase border-b border-grey/30 pb-2 text-black">
                Delivery Address
              </h2>
              <div className="font-body text-xs text-charcoal space-y-1">
                <p className="font-medium text-black">{order.customerName}</p>
                <p>{order.shippingAddress.line1}</p>
                <p>{order.shippingAddress.line2}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
                </p>
                <p className="pt-1 text-black font-medium">{order.phone}</p>
              </div>
            </div>

            <div className="bg-black text-cream rounded-sm p-6 space-y-3">
              <div className="flex items-center gap-2 text-white font-display text-xs font-semibold uppercase">
                <ShieldCheck className="w-4 h-4 text-white/70" />
                <span>Transit Security Guarantee</span>
              </div>
              <p className="font-body text-xs text-white/70 leading-relaxed">
                If the security tamper-seal on your carton appears compromised upon delivery, 
                kindly decline handover and notify our client concierge immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
