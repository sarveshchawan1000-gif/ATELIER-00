import React from 'react';
import Link from 'next/link';
import { SEED_PRODUCTS } from '@/lib/db/seed-data';
import { formatINR } from '@/lib/pricing';
import { Button } from '@/components/ui/Button';
import { TrendingUp, ShoppingCart, AlertTriangle, MessageSquare, ArrowRight, Package } from 'lucide-react';

export default function AdminDashboardPage() {
  // Aggregate real catalog metrics
  const totalProducts = SEED_PRODUCTS.length;
  const allVariants = SEED_PRODUCTS.flatMap((p) => p.variants);
  const lowStockVariants = allVariants.filter((v) => v.stock > 0 && v.stock <= 3);
  const outOfStockVariants = allVariants.filter((v) => v.stock === 0);

  // Mock initial GMV and order telemetry for showroom dashboard
  const simulatedGMVPaise = 42890000; // ₹4,28,900 INR
  const totalOrdersCount = 38;

  const recentOrders = [
    {
      id: 'BRD-2026-981245',
      customer: 'Aarav Mehta',
      city: 'Mumbai, MH',
      amountPaise: 1399800,
      status: 'paid',
      itemsCount: 2,
      time: '14 mins ago',
    },
    {
      id: 'BRD-2026-981244',
      customer: 'Devika Sharma',
      city: 'New Delhi, DL',
      amountPaise: 899900,
      status: 'shipped',
      itemsCount: 1,
      time: '1 hour ago',
    },
    {
      id: 'BRD-2026-981243',
      customer: 'Kabir Singhania',
      city: 'Bengaluru, KA',
      amountPaise: 1799800,
      status: 'processing',
      itemsCount: 2,
      time: '3 hours ago',
    },
    {
      id: 'BRD-2026-981242',
      customer: 'Zoya Merchant',
      city: 'Pune, MH',
      amountPaise: 499900,
      status: 'delivered',
      itemsCount: 1,
      time: 'Yesterday',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b-2 border-black pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight uppercase">
            OPERATIONS & TELEMETRY
          </h1>
          <p className="font-body text-xs text-charcoal mt-1">
            Real-time catalog inventory, Razorpay order pipeline, and fulfillment stream.
          </p>
        </div>
        <Link href="/admin/orders">
          <Button variant="primary" size="sm">
            ALL ORDERS <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-offwhite border-2 border-black p-5 space-y-2 shadow-[4px_4px_0px_0px_#111111]">
          <div className="flex items-center justify-between text-charcoal">
            <span className="font-display text-xs font-bold tracking-wider uppercase">GROSS REVENUE</span>
            <TrendingUp className="w-4 h-4 text-cyan" />
          </div>
          <div className="font-display text-2xl font-bold text-black">
            {formatINR(simulatedGMVPaise)}
          </div>
          <span className="font-body text-[11px] text-charcoal">Inclusive of GST</span>
        </div>

        {/* Metric 2 */}
        <div className="bg-offwhite border-2 border-black p-5 space-y-2 shadow-[4px_4px_0px_0px_#111111]">
          <div className="flex items-center justify-between text-charcoal">
            <span className="font-display text-xs font-bold tracking-wider uppercase">ORDERS PLACED</span>
            <ShoppingCart className="w-4 h-4 text-cyan" />
          </div>
          <div className="font-display text-2xl font-bold text-black">
            {totalOrdersCount}
          </div>
          <span className="font-body text-[11px] text-cyan font-bold">100% Prepaid Razorpay</span>
        </div>

        {/* Metric 3 */}
        <div className="bg-offwhite border-2 border-black p-5 space-y-2 shadow-[4px_4px_0px_0px_#111111]">
          <div className="flex items-center justify-between text-charcoal">
            <span className="font-display text-xs font-bold tracking-wider uppercase">CATALOG ITEMS</span>
            <Package className="w-4 h-4 text-cyan" />
          </div>
          <div className="font-display text-2xl font-bold text-black">
            {totalProducts} ACTIVE
          </div>
          <span className="font-body text-[11px] text-charcoal">{allVariants.length} total SKUs</span>
        </div>

        {/* Metric 4 */}
        <div className="bg-offwhite border-2 border-black p-5 space-y-2 shadow-[4px_4px_0px_0px_#111111]">
          <div className="flex items-center justify-between text-charcoal">
            <span className="font-display text-xs font-bold tracking-wider uppercase">STOCK WARNINGS</span>
            <AlertTriangle className="w-4 h-4 text-error-red" />
          </div>
          <div className="font-display text-2xl font-bold text-error-red">
            {lowStockVariants.length + outOfStockVariants.length}
          </div>
          <span className="font-body text-[11px] text-charcoal">
            {outOfStockVariants.length} sold out, {lowStockVariants.length} low stock
          </span>
        </div>
      </div>

      {/* Critical Stock Alerts Box */}
      {(lowStockVariants.length > 0 || outOfStockVariants.length > 0) && (
        <div className="bg-offwhite border-2 border-black p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-black pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-error-red" />
              <h2 className="font-display text-sm font-bold tracking-wider uppercase text-black">
                CRITICAL INVENTORY REORDER ALERTS
              </h2>
            </div>
            <Link href="/admin/inventory" className="font-display text-xs text-cyan hover:underline uppercase">
              ADJUST STOCK →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...outOfStockVariants, ...lowStockVariants].slice(0, 6).map((v) => (
              <div key={v.id} className="p-3 border border-grey bg-cream/30 flex items-center justify-between">
                <div>
                  <span className="font-display text-xs font-bold uppercase block">{v.sku}</span>
                  <span className="font-body text-[10px] text-charcoal uppercase">
                    {v.colour} / SIZE {v.size}
                  </span>
                </div>
                <span
                  className={`font-display text-xs font-bold px-2 py-0.5 ${
                    v.stock === 0 ? 'bg-error-red text-cream' : 'bg-cyan text-black'
                  }`}
                >
                  {v.stock === 0 ? 'SOLD OUT' : `${v.stock} LEFT`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders Activity */}
      <div className="bg-offwhite border-2 border-black p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-black pb-3">
          <h2 className="font-display text-sm font-bold tracking-wider uppercase text-black">
            RECENT DISPATCH PIPELINE
          </h2>
          <span className="font-display text-[10px] tracking-wider text-charcoal uppercase">
            LIVE TRANSACTIONS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-display text-xs uppercase">
            <thead>
              <tr className="border-b border-black text-charcoal text-[11px]">
                <th className="py-2.5">ORDER ID</th>
                <th className="py-2.5">CUSTOMER</th>
                <th className="py-2.5">DESTINATION</th>
                <th className="py-2.5">AMOUNT</th>
                <th className="py-2.5">STATUS</th>
                <th className="py-2.5 text-right">TIME</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-grey">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-cyan/10 transition-colors">
                  <td className="py-3 font-bold text-black">{ord.id}</td>
                  <td className="py-3 font-body">{ord.customer}</td>
                  <td className="py-3 font-body text-charcoal">{ord.city}</td>
                  <td className="py-3 font-bold">{formatINR(ord.amountPaise)}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold ${
                        ord.status === 'paid'
                          ? 'bg-cyan text-black'
                          : ord.status === 'shipped'
                          ? 'bg-black text-cream'
                          : ord.status === 'delivered'
                          ? 'bg-green-700 text-cream'
                          : 'bg-grey text-black'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 text-right text-charcoal text-[11px] font-body">{ord.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
