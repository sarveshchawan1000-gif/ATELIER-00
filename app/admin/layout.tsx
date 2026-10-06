import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CONFIG } from '@/lib/config';
import { LayoutDashboard, ShoppingBag, Package, AlertCircle, MessageSquare, ArrowLeft, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: `Admin Console | ${CONFIG.brandName} Operations`,
  description: 'Operations, inventory, orders and catalog administration.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream text-black flex flex-col pt-16 md:pt-20">
      {/* Admin Top Operations Bar */}
      <div className="bg-black text-cream px-4 md:px-8 py-2.5 border-b border-black flex items-center justify-between font-display text-xs tracking-wider uppercase">
        <div className="flex items-center gap-3">
          <span className="font-bold text-cyan">{CONFIG.brandName} // ATELIER CONSOLE</span>
          <span className="hidden sm:inline text-grey/50">|</span>
          <span className="hidden sm:inline bg-cyan/20 text-cyan px-2 py-0.5 text-[10px] border border-cyan/40">
            ROLE: OWNER
          </span>
          <span className="hidden md:inline bg-cream/10 text-cream px-2 py-0.5 text-[10px] flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-cyan" /> 2FA ENFORCED
          </span>
        </div>
        <Link
          href="/"
          className="text-grey hover:text-cyan transition-colors flex items-center gap-1 text-[11px]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> STOREFRONT
        </Link>
      </div>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Admin Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-offwhite border-b md:border-b-0 md:border-r-2 border-black p-4 md:p-6 flex-shrink-0">
          <nav className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible font-display text-xs font-bold tracking-wider uppercase">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-black hover:text-cream border border-transparent hover:border-black transition-colors rounded-none whitespace-nowrap"
            >
              <LayoutDashboard className="w-4 h-4 text-cyan" />
              <span>DASHBOARD</span>
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-black hover:text-cream border border-transparent hover:border-black transition-colors rounded-none whitespace-nowrap"
            >
              <ShoppingBag className="w-4 h-4 text-cyan" />
              <span>PRODUCTS</span>
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-black hover:text-cream border border-transparent hover:border-black transition-colors rounded-none whitespace-nowrap"
            >
              <Package className="w-4 h-4 text-cyan" />
              <span>ORDERS</span>
            </Link>
            <Link
              href="/admin/inventory"
              className="flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-black hover:text-cream border border-transparent hover:border-black transition-colors rounded-none whitespace-nowrap"
            >
              <AlertCircle className="w-4 h-4 text-cyan" />
              <span>INVENTORY</span>
            </Link>
            <Link
              href="/admin/reviews"
              className="flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-black hover:text-cream border border-transparent hover:border-black transition-colors rounded-none whitespace-nowrap"
            >
              <MessageSquare className="w-4 h-4 text-cyan" />
              <span>REVIEWS</span>
            </Link>
          </nav>
        </aside>

        {/* Main Admin Viewport */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
