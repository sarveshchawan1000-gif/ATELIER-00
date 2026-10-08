'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProductStore } from '@/lib/product-store';
import { ProductWithDetails } from '@/lib/db/types';
import { formatINR } from '@/lib/pricing';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { AddProductPhotoModal } from '@/components/admin/AddProductPhotoModal';
import { UpdateProductPhotoModal } from '@/components/admin/UpdateProductPhotoModal';
import { Search, Plus, Eye, Edit3, Camera, Sparkles, Trash2 } from 'lucide-react';

export default function AdminProductsPage() {
  const { showToast } = useToast();
  const getAllProducts = useProductStore((state) => state.getAllProducts);
  const deleteCustomProduct = useProductStore((state) => state.deleteCustomProduct);

  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [query, setQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [photoUpdateProduct, setPhotoUpdateProduct] = useState<ProductWithDetails | null>(null);

  // Load and refresh products from store
  const refreshProducts = () => {
    setProducts(getAllProducts());
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.name.toLowerCase().includes(query.toLowerCase()) ||
      (p.gender && p.gender.toLowerCase().includes(query.toLowerCase()))
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

  const handleDelete = (id: string, name: string) => {
    deleteCustomProduct(id);
    refreshProducts();
    showToast(`GARMENT REMOVED: ${name}`);
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="border-b-2 border-black pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-display text-[10px] font-bold text-cyan bg-black px-2 py-0.5 uppercase tracking-widest">
              BRAND STUDIO // GARMENT MANAGER
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight uppercase">
            CATALOG MANAGEMENT [{products.length}]
          </h1>
          <p className="font-body text-xs text-charcoal mt-1">
            Active garments, photo allocations, department categorization, and pricing structures.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#111111]"
          >
            <Camera className="w-4 h-4 text-cyan" />
            <span>+ ADD PHOTO / GARMENT</span>
          </Button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal pointer-events-none" />
        <Input
          placeholder="SEARCH PRODUCTS, CATEGORIES, OR GENDER (MALE / FEMALE / KIDS)..."
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
              <th className="p-3.5">ITEM & PHOTO</th>
              <th className="p-3.5">DEPARTMENT</th>
              <th className="p-3.5">CATEGORY</th>
              <th className="p-3.5">PRICE (INR)</th>
              <th className="p-3.5">VARIANTS</th>
              <th className="p-3.5">STOCK</th>
              <th className="p-3.5">STATUS</th>
              <th className="p-3.5 text-right">PHOTO & ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grey">
            {filtered.map((prod) => {
              const primaryImg = prod.images.find((i) => i.is_primary) || prod.images[0];
              const totalStock = prod.variants.reduce((acc, v) => acc + v.stock, 0);
              const isOwnerAdded = prod.id.startsWith('p-owner-');

              return (
                <tr key={prod.id} className="hover:bg-cyan/10 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        onClick={() => setPhotoUpdateProduct(prod)}
                        className="w-12 h-14 bg-grey/30 border border-grey flex-shrink-0 relative overflow-hidden group cursor-pointer"
                        title="Click to change photo"
                      >
                        {primaryImg?.url && (
                          <Image
                            src={primaryImg.url}
                            alt={prod.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-cyan transition-opacity">
                          <Camera className="w-4 h-4" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-black block text-xs">{prod.name}</span>
                          {isOwnerAdded && (
                            <span className="text-[9px] bg-cyan text-black px-1 py-0.2 font-bold uppercase tracking-wider">
                              OWNER
                            </span>
                          )}
                        </div>
                        <span className="font-body text-[10px] text-charcoal lowercase">
                          /product/{prod.slug}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-bold border ${
                        prod.gender === 'female'
                          ? 'bg-purple-100 text-purple-900 border-purple-300'
                          : prod.gender === 'kids'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-black text-cyan border-black'
                      }`}
                    >
                      {prod.gender?.toUpperCase() || 'UNISEX'}
                    </span>
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
                      className={`px-2 py-0.5 text-[10px] font-bold border transition-colors ${
                        prod.status === 'active'
                          ? 'bg-cyan text-black border-cyan'
                          : 'bg-grey text-charcoal border-grey'
                      }`}
                    >
                      {prod.status.toUpperCase()}
                    </button>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Photo Adder / Change Button */}
                      <button
                        onClick={() => setPhotoUpdateProduct(prod)}
                        className="p-1.5 border border-grey bg-white hover:border-black hover:bg-cyan text-black transition-colors"
                        title="Upload / Change Photo"
                      >
                        <Camera className="w-3.5 h-3.5 text-black" />
                      </button>

                      {/* Storefront View */}
                      <Link
                        href={`/product/${prod.slug}`}
                        target="_blank"
                        className="p-1.5 border border-grey bg-white hover:border-black hover:bg-cyan transition-colors"
                        title="View Live on Storefront"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      {/* Delete Owner Garment */}
                      {isOwnerAdded && (
                        <button
                          onClick={() => handleDelete(prod.id, prod.name)}
                          className="p-1.5 border border-grey bg-white hover:border-error-red hover:bg-red-50 text-charcoal hover:text-error-red transition-colors"
                          title="Delete Owner Garment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add New Product & Photo Modal */}
      <AddProductPhotoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          refreshProducts();
        }}
      />

      {/* Update Existing Product Photo Modal */}
      <UpdateProductPhotoModal
        isOpen={!!photoUpdateProduct}
        product={photoUpdateProduct}
        onClose={() => setPhotoUpdateProduct(null)}
        onSuccess={() => {
          refreshProducts();
        }}
      />
    </div>
  );
}

