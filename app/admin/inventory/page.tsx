'use client';

import React, { useState } from 'react';
import { SEED_PRODUCTS } from '@/lib/db/seed-data';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { Search, AlertTriangle, Check, RefreshCw } from 'lucide-react';

interface VariantRow {
  variantId: string;
  sku: string;
  productName: string;
  colour: string;
  size: string;
  stock: number;
  reservedStock: number;
}

export default function AdminInventoryPage() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');

  // Flatten all variants with product name
  const [variants, setVariants] = useState<VariantRow[]>(() =>
    SEED_PRODUCTS.flatMap((p) =>
      p.variants.map((v) => ({
        variantId: v.id,
        sku: v.sku,
        productName: p.name,
        colour: v.colour,
        size: v.size,
        stock: v.stock,
        reservedStock: v.reserved_stock,
      }))
    )
  );

  const filtered = variants.filter(
    (v) =>
      v.sku.toLowerCase().includes(search.toLowerCase()) ||
      v.productName.toLowerCase().includes(search.toLowerCase()) ||
      v.colour.toLowerCase().includes(search.toLowerCase())
  );

  const adjustStock = (variantId: string, delta: number) => {
    setVariants((prev) =>
      prev.map((v) => {
        if (v.variantId === variantId) {
          const newStock = Math.max(0, v.stock + delta);
          showToast(`UPDATED ${v.sku} STOCK TO ${newStock}`);
          return { ...v, stock: newStock };
        }
        return v;
      })
    );
  };

  const setExactStock = (variantId: string, val: number) => {
    setVariants((prev) =>
      prev.map((v) => (v.variantId === variantId ? { ...v, stock: Math.max(0, val) } : v))
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-b-2 border-black pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight uppercase">
            INVENTORY AUDIT MATRIX [{variants.length} SKUS]
          </h1>
          <p className="font-body text-xs text-charcoal mt-1">
            Real-time physical stock counts, active reservations, and reorder levels.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => showToast('INVENTORY AUDIT LOG RECORDED')}
        >
          SAVE AUDIT SNAPSHOT
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal pointer-events-none" />
        <Input
          placeholder="FILTER BY SKU, GARMENT NAME OR COLOUR..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-offwhite border-2 border-black text-xs uppercase"
        />
      </div>

      {/* Inventory Table */}
      <div className="bg-offwhite border-2 border-black overflow-x-auto shadow-[4px_4px_0px_0px_#111111]">
        <table className="w-full text-left border-collapse font-display text-xs uppercase">
          <thead>
            <tr className="bg-black text-cream border-b border-black text-[11px]">
              <th className="p-3.5">SKU CODE</th>
              <th className="p-3.5">GARMENT & SHADE</th>
              <th className="p-3.5">SIZE</th>
              <th className="p-3.5">RESERVED</th>
              <th className="p-3.5">AVAILABLE</th>
              <th className="p-3.5">STATUS</th>
              <th className="p-3.5 text-right">ADJUST STOCK</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grey">
            {filtered.map((v) => {
              const available = Math.max(0, v.stock - v.reservedStock);
              const isLow = available > 0 && available <= 3;
              const isOut = available === 0;

              return (
                <tr key={v.variantId} className="hover:bg-cyan/10 transition-colors">
                  <td className="p-3.5 font-bold text-black">{v.sku}</td>
                  <td className="p-3.5">
                    <span className="block text-black">{v.productName}</span>
                    <span className="font-body text-[10px] text-charcoal">{v.colour}</span>
                  </td>
                  <td className="p-3.5 font-bold">{v.size}</td>
                  <td className="p-3.5 font-body text-charcoal">{v.reservedStock}</td>
                  <td className="p-3.5 font-bold text-black">{available} units</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold ${
                        isOut
                          ? 'bg-error-red text-cream'
                          : isLow
                          ? 'bg-yellow-300 text-black'
                          : 'bg-cyan text-black'
                      }`}
                    >
                      {isOut ? 'OUT OF STOCK' : isLow ? 'LOW STOCK' : 'OPTIMAL'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => adjustStock(v.variantId, -1)}
                        className="w-7 h-7 bg-cream border border-black hover:bg-cyan text-black font-bold text-sm flex items-center justify-center"
                        title="Decrease stock by 1"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={v.stock}
                        onChange={(e) => setExactStock(v.variantId, parseInt(e.target.value) || 0)}
                        className="w-12 h-7 bg-offwhite border border-black text-center font-display text-xs font-bold"
                      />
                      <button
                        onClick={() => adjustStock(v.variantId, 1)}
                        className="w-7 h-7 bg-cream border border-black hover:bg-cyan text-black font-bold text-sm flex items-center justify-center"
                        title="Increase stock by 1"
                      >
                        +
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
