'use client';

import React, { useState } from 'react';
import { formatINR } from '@/lib/pricing';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { Search, Truck, Check, RefreshCw, X } from 'lucide-react';

interface OrderRecord {
  id: string;
  orderNo: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  itemsSummary: string;
  totalPaise: number;
  status: 'paid' | 'processing' | 'shipped' | 'delivered' | 'refunded';
  trackingNumber: string;
  placedAt: string;
}

const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'ord-1',
    orderNo: 'BRD-2026-981245',
    customerName: 'Aarav Mehta',
    customerEmail: 'aarav.mehta@example.com',
    customerPhone: '+91 98200 12345',
    shippingAddress: 'Apt 12B, Sea Green Towers, Worli, Mumbai 400018',
    itemsSummary: 'Oversized Cotton Tee (M) x 1, Heavyweight Zip Hoodie (L) x 1',
    totalPaise: 1399800,
    status: 'paid',
    trackingNumber: '',
    placedAt: '2026-10-06 18:30 IST',
  },
  {
    id: 'ord-2',
    orderNo: 'BRD-2026-981244',
    customerName: 'Devika Sharma',
    customerEmail: 'devika.s@example.com',
    customerPhone: '+91 99110 54321',
    shippingAddress: '44 Golf Links, New Delhi 110003',
    itemsSummary: 'Heavyweight Zip Hoodie (S) x 1',
    totalPaise: 899900,
    status: 'shipped',
    trackingNumber: 'BLUEDART-88291041',
    placedAt: '2026-10-06 14:15 IST',
  },
  {
    id: 'ord-3',
    orderNo: 'BRD-2026-981243',
    customerName: 'Kabir Singhania',
    customerEmail: 'kabir.singhania@example.com',
    customerPhone: '+91 98450 67890',
    shippingAddress: '102 Indiranagar 100ft Rd, Bengaluru 560038',
    itemsSummary: 'Technical Bomber Jacket (L) x 1',
    totalPaise: 1299900,
    status: 'processing',
    trackingNumber: '',
    placedAt: '2026-10-06 11:20 IST',
  },
  {
    id: 'ord-4',
    orderNo: 'BRD-2026-981242',
    customerName: 'Zoya Merchant',
    customerEmail: 'zoya.m@example.com',
    customerPhone: '+91 98900 11223',
    shippingAddress: 'B-4 Koregaon Park, Pune 411001',
    itemsSummary: 'Oversized Cotton Tee (S) x 1',
    totalPaise: 499900,
    status: 'delivered',
    trackingNumber: 'DELHIVERY-99482103',
    placedAt: '2026-10-05 09:40 IST',
  },
];

export default function AdminOrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [editingTrackingId, setEditingTrackingId] = useState<string | null>(null);
  const [tempTracking, setTempTracking] = useState('');

  const filtered = orders.filter((o) => {
    const matchesFilter = filter === 'all' || o.status === filter;
    const matchesSearch =
      o.orderNo.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const updateStatus = (id: string, newStatus: OrderRecord['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    showToast(`ORDER UPDATED TO ${newStatus.toUpperCase()}`);
  };

  const saveTracking = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, trackingNumber: tempTracking, status: 'shipped' } : o))
    );
    setEditingTrackingId(null);
    showToast('AWB TRACKING ASSIGNED & MARKED SHIPPED');
  };

  const refundOrder = (orderNo: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderNo === orderNo ? { ...o, status: 'refunded' } : o))
    );
    showToast(`PROCESSED FULL REFUND FOR ${orderNo} VIA RAZORPAY`);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-b-2 border-black pb-4">
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight uppercase">
          ORDERS & FULFILLMENT PIPELINE [{orders.length}]
        </h1>
        <p className="font-body text-xs text-charcoal mt-1">
          Prepaid transactions, logistics partner airway bills, and customer delivery states.
        </p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5 font-display text-xs font-bold uppercase">
          {['all', 'paid', 'processing', 'shipped', 'delivered', 'refunded'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 border transition-colors ${
                filter === st
                  ? 'bg-black text-cyan border-black'
                  : 'bg-offwhite text-black border-grey hover:border-black'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal pointer-events-none" />
          <Input
            placeholder="SEARCH ORDER / NAME..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-offwhite border-2 border-black text-xs uppercase"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filtered.map((ord) => (
          <div
            key={ord.id}
            className="bg-offwhite border-2 border-black p-5 shadow-[4px_4px_0px_0px_#111111] space-y-4"
          >
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-grey pb-3 font-display text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-base text-black">{ord.orderNo}</span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                    ord.status === 'paid'
                      ? 'bg-cyan text-black'
                      : ord.status === 'processing'
                      ? 'bg-yellow-300 text-black'
                      : ord.status === 'shipped'
                      ? 'bg-black text-cream'
                      : ord.status === 'delivered'
                      ? 'bg-green-700 text-cream'
                      : 'bg-error-red text-cream'
                  }`}
                >
                  {ord.status}
                </span>
              </div>
              <div className="text-charcoal font-body text-xs">
                {ord.placedAt} // <strong className="font-display text-black">{formatINR(ord.totalPaise)}</strong>
              </div>
            </div>

            {/* Content row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs font-body">
              <div className="md:col-span-4 space-y-1">
                <span className="font-display font-bold uppercase block text-charcoal text-[11px]">
                  CUSTOMER & CONTACT
                </span>
                <p className="font-bold text-black">{ord.customerName}</p>
                <p className="text-charcoal">{ord.customerEmail}</p>
                <p className="text-charcoal">{ord.customerPhone}</p>
              </div>

              <div className="md:col-span-5 space-y-1">
                <span className="font-display font-bold uppercase block text-charcoal text-[11px]">
                  DESTINATION & LINE ITEMS
                </span>
                <p className="text-charcoal">{ord.shippingAddress}</p>
                <p className="font-display text-black text-[11px] mt-1 pt-1 border-t border-grey/30">
                  {ord.itemsSummary}
                </p>
              </div>

              <div className="md:col-span-3 space-y-2">
                <span className="font-display font-bold uppercase block text-charcoal text-[11px]">
                  AIRWAY BILL / DISPATCH
                </span>
                {editingTrackingId === ord.id ? (
                  <div className="flex gap-1.5">
                    <Input
                      placeholder="ENTER AWB"
                      value={tempTracking}
                      onChange={(e) => setTempTracking(e.target.value)}
                      className="text-xs bg-cream py-1 px-2 uppercase"
                    />
                    <button
                      onClick={() => saveTracking(ord.id)}
                      className="p-1.5 bg-black text-cyan hover:bg-cyan hover:text-black"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingTrackingId(null)}
                      className="p-1.5 border border-grey"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs text-black">
                      {ord.trackingNumber || 'UNASSIGNED'}
                    </span>
                    <button
                      onClick={() => {
                        setEditingTrackingId(ord.id);
                        setTempTracking(ord.trackingNumber);
                      }}
                      className="text-[10px] font-display text-cyan hover:underline uppercase"
                    >
                      ASSIGN AWB
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Status controls */}
            <div className="pt-3 border-t border-grey flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5 font-display text-[10px] font-bold uppercase">
                <span className="text-charcoal py-1 mr-1">TRANSITION:</span>
                {ord.status !== 'processing' && ord.status !== 'refunded' && (
                  <button
                    onClick={() => updateStatus(ord.id, 'processing')}
                    className="px-2.5 py-1 border border-grey hover:border-black hover:bg-cream"
                  >
                    MARK PROCESSING
                  </button>
                )}
                {ord.status !== 'shipped' && ord.status !== 'delivered' && ord.status !== 'refunded' && (
                  <button
                    onClick={() => updateStatus(ord.id, 'shipped')}
                    className="px-2.5 py-1 border border-grey hover:border-black hover:bg-cream"
                  >
                    MARK SHIPPED
                  </button>
                )}
                {ord.status !== 'delivered' && ord.status !== 'refunded' && (
                  <button
                    onClick={() => updateStatus(ord.id, 'delivered')}
                    className="px-2.5 py-1 border border-grey hover:border-black hover:bg-cream"
                  >
                    MARK DELIVERED
                  </button>
                )}
              </div>

              {ord.status !== 'refunded' && (
                <button
                  onClick={() => refundOrder(ord.orderNo)}
                  className="font-display text-[10px] font-bold text-error-red hover:underline uppercase"
                >
                  REFUND ORDER
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
