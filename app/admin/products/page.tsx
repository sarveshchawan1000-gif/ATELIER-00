'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SEED_PRODUCTS } from '@/lib/db/seed-data';
import { formatINR } from '@/lib/pricing';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { Search, Plus, Eye, Edit3, ArrowRight } from 'lucide-react';

export default function AdminProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState(SEED_PRODUCTS);
  const [query, setQuery] = useState('');

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.category.name.toLowerCase().includes(query.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStatus = p.status === 'active' ? 'draft' : 'active';
          showToast(`PRODUCT ${p.name} SET TO ${nextStatus.toUpperCase()}`);
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="border-b-2 border-black pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight uppercase">
            CATALOG MANAGEMENT [{products.length}]
          </h1>
          <p className="font-body text-xs text-charcoal mt-1">
            Active garments, pricing structures, and variant allocations.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => showToast('CREATING NEW MONOGRAPH ITEM (DEMO MODE)')}
        >
          <Plus className="w-4 h-4 mr-1.5" /> NEW PRODUCT
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal pointer-events-none" />
        <Input
          placeholder="SEARCH PRODUCTS OR CATEGORIES..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 bg-offwhite border-2 border-black text-xs uppercase tracking-wider"
        />
      </div>

      {/* Table */}
      <div className="bg-offwhite border-2 border-black overflow-x-auto shadow-[4px_4px_0px_0px_#111111]">
        <table className="w-full text-left border-collapse font-display text-xs uppercase">
          <thead>
            <tr className="bg-black text-cream border-b border-black text-[11px]">
              <th className="p-3.5">ITEM</th>
              <th className="p-3.5">CATEGORY</th>
              <th className="p-3.5">PRICE (INR)</th>
              <th className="p-3.5">VARIANTS</th>
              <th className="p-3.5">STOCK</th>
              <th className="p-3.5">STATUS</th>
              <th className="p-3.5 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grey">
            {filtered.map((prod) => {
              const primaryImg = prod.images.find((i) => i.is_primary) || prod.images[0];
              const totalStock = prod.variants.reduce((acc, v) => acc + v.stock, 0);

              return (
                <tr key={prod.id} className="hover:bg-cyan/10 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-14 bg-grey/30 border border-grey flex-shrink-0 relative overflow-hidden">
                        {primaryImg?.url && (
                          <Image
                            src={primaryImg.url}
                            alt={prod.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-black block text-xs">{prod.name}</span>
                        <span className="font-body text-[10px] text-charcoal lowercase">
                          /product/{prod.slug}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-body text-charcoal">{prod.category.name}</td>
                  <td className="p-3.5 font-bold">{formatINR(prod.sale_price || prod.mrp)}</td>
                  <td className="p-3.5">{prod.variants.length} SKUs</td>
                  <td className="p-3.5">
                    <span
                      className={`font-bold ${
                        totalStock === 0
                          ? 'text-error-red'
                          : totalStock <= 5
                          ? 'text-yellow-600'
                          : 'text-black'
                      }`}
                    >
                      {totalStock} units
                    </span>
                  </td>
                  <td className="p-3.5">
                    <button
                      onClick={() => toggleStatus(prod.id)}
                      className={`px-2 py-0.5 text-[10px] font-bold border ${
                        prod.status === 'active'
                          ? 'bg-cyan text-black border-cyan'
                          : 'bg-grey text-charcoal border-grey'
                      }`}
                    >
                      {prod.status.toUpperCase()}
                    </button>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/product/${prod.slug}`}
                        target="_blank"
                        className="p-1.5 border border-grey hover:border-black hover:bg-cyan transition-colors"
                        title="View Live on Storefront"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => showToast(`EDITING ${prod.name}`)}
                        className="p-1.5 border border-grey hover:border-black hover:bg-cyan transition-colors"
                        title="Edit Product"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
