'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useProductStore } from '@/lib/product-store';
import { ProductWithDetails, Category } from '@/lib/db/types';
import { SEED_CATEGORIES } from '@/lib/db/seed-data';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { Upload, X, Image as ImageIcon, CheckCircle, Sparkles } from 'lucide-react';

interface AddProductPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newProduct: ProductWithDetails) => void;
  initialGender?: 'male' | 'female' | 'kids';
  initialCategorySlug?: string;
}

export function AddProductPhotoModal({
  isOpen,
  onClose,
  onSuccess,
  initialGender = 'male',
  initialCategorySlug = 't-shirts',
}: AddProductPhotoModalProps) {
  const { showToast } = useToast();
  const addCustomProduct = useProductStore((state) => state.addCustomProduct);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'kids'>(initialGender);
  const [categorySlug, setCategorySlug] = useState(initialCategorySlug);
  const [priceINR, setPriceINR] = useState('4999');
  const [material, setMaterial] = useState('100% Combed Heavyweight Cotton (320 GSM)');
  const [fit, setFit] = useState('Relaxed Boxy Architectural Silhouette');
  const [colour, setColour] = useState('OBSIDIAN BLACK');
  const [colourHex, setColourHex] = useState('#111111');
  const [description, setDescription] = useState(
    'Architectural luxury garment crafted with geometric precision, reinforced seams, and minimal monolithic drape.'
  );
  const [sizes, setSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [stockPerSize, setStockPerSize] = useState('8');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('PLEASE SELECT A VALID IMAGE FILE');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPhotoUrl(result);
      if (!altText) {
        setAltText(`${name || 'Garment'} photo for ATELIER 00`);
      }
      showToast('PHOTO ATTACHED SUCCESSFULLY');
    };
    reader.readAsDataURL(file);
  };

  // Toggle available sizes
  const toggleSize = (sz: string) => {
    if (sizes.includes(sz)) {
      if (sizes.length > 1) {
        setSizes(sizes.filter((s) => s !== sz));
      }
    } else {
      setSizes([...sizes, sz]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('PLEASE ENTER A GARMENT NAME');
      return;
    }

    if (!photoUrl) {
      showToast('PLEASE UPLOAD OR PROVIDE A PHOTO');
      return;
    }

    setIsSubmitting(true);

    const priceNumber = parseInt(priceINR.replace(/[^\d]/g, ''), 10) || 4999;
    const pricePaise = priceNumber * 100;
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const selectedCategory =
      SEED_CATEGORIES.find((c) => c.slug === categorySlug) || SEED_CATEGORIES[0];

    const stockNum = parseInt(stockPerSize, 10) || 6;
    const newId = `p-owner-${Date.now()}`;

    const newProduct: ProductWithDetails = {
      id: newId,
      name: name.toUpperCase().trim(),
      slug: slug || `custom-garment-${Date.now()}`,
      description,
      category_id: selectedCategory.id,
      category: selectedCategory,
      collections: [],
      mrp: pricePaise,
      sale_price: pricePaise,
      material,
      fit,
      care: 'Specialist garment care. Machine wash cold delicate cycle or dry clean.',
      weight_g: 450,
      country_of_origin: 'India',
      gender,
      tags: [gender, categorySlug, 'new-arrival', 'owner-curated', colour.toLowerCase()],
      status: 'active',
      rating_average: 5.0,
      rating_count: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: [
        {
          id: `img-${newId}-1`,
          product_id: newId,
          colour: colour.toUpperCase(),
          url: photoUrl,
          alt_text: altText || `${name} front view`,
          position: 1,
          is_primary: true,
        },
      ],
      variants: sizes.map((sz) => ({
        id: `v-${newId}-${sz.toLowerCase()}`,
        product_id: newId,
        sku: `${slug.substring(0, 4).toUpperCase()}-${colour.substring(0, 3).toUpperCase()}-${sz}`,
        colour: colour.toUpperCase(),
        colour_hex: colourHex,
        size: sz as any,
        stock: stockNum,
        reserved_stock: 0,
      })),
    };

    addCustomProduct(newProduct);
    setIsSubmitting(false);
    showToast(`PHOTO ADDED & GARMENT PUBLISHED: ${newProduct.name}`);

    if (onSuccess) {
      onSuccess(newProduct);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
      <div className="bg-cream border-2 border-black max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-[8px_8px_0px_0px_#111111]">
        {/* Modal Header */}
        <div className="bg-black text-cream px-6 py-4 flex items-center justify-between border-b border-black">
          <div className="flex items-center gap-3">
            <span className="font-display text-xs font-bold text-cyan tracking-widest uppercase">
              OWNER ATELIER STUDIO // ADD PHOTO & GARMENT
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-cream hover:text-cyan font-display text-sm font-bold uppercase transition-colors"
          >
            ✕ CLOSE
          </button>
        </div>

        {/* Modal Form Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Column: Photo Upload & Preview */}
            <div className="md:col-span-5 space-y-4">
              <span className="font-display text-xs font-bold text-black uppercase tracking-wider block">
                1. GARMENT PHOTO (REQUIRED)
              </span>

              {/* Preview Box (4:5 Aspect Ratio) */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative aspect-[4/5] w-full bg-offwhite border-2 border-dashed border-black flex flex-col items-center justify-center cursor-pointer group overflow-hidden hover:bg-cyan/10 transition-colors"
              >
                {photoUrl ? (
                  <>
                    <Image
                      src={photoUrl}
                      alt={altText || 'Uploaded garment preview'}
                      fill
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-cream transition-opacity p-4 text-center">
                      <Upload className="w-8 h-8 mb-2 text-cyan" />
                      <span className="font-display text-xs font-bold uppercase">
                        CLICK TO CHANGE PHOTO
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="p-6 text-center flex flex-col items-center justify-center gap-3 text-charcoal">
                    <div className="w-16 h-16 bg-cream border border-black flex items-center justify-center group-hover:bg-cyan transition-colors">
                      <Upload className="w-8 h-8 text-black" />
                    </div>
                    <div>
                      <span className="font-display text-xs font-bold text-black uppercase block">
                        UPLOAD PHOTO FROM DEVICE
                      </span>
                      <span className="font-body text-[11px] text-charcoal block mt-1">
                        PNG, JPG, WEBP, AVIF (4:5 Ratio Recommended)
                      </span>
                    </div>
                    <span className="bg-black text-cyan text-[10px] font-display font-bold px-3 py-1 uppercase tracking-wider border border-black">
                      BROWSE FILES
                    </span>
                  </div>
                )}
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Or Paste URL */}
              <div className="space-y-1.5">
                <span className="font-display text-[10px] font-bold text-charcoal uppercase tracking-wider">
                  OR PASTE IMAGE URL
                </span>
                <Input
                  placeholder="https://images.unsplash.com/..."
                  value={photoUrl.startsWith('data:') ? '' : photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="bg-offwhite border border-black text-xs"
                />
              </div>

              {/* Alt Text */}
              <div className="space-y-1.5">
                <span className="font-display text-[10px] font-bold text-charcoal uppercase tracking-wider">
                  PHOTO ALT CAPTION (SEO & ACCESSIBILITY)
                </span>
                <Input
                  placeholder="e.g. Front studio view of Architectural Trench Coat"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="bg-offwhite border border-black text-xs"
                />
              </div>
            </div>

            {/* Right Column: Garment Specs, Department & Kinds of Cloth */}
            <div className="md:col-span-7 space-y-6">
              {/* Department / Gender */}
              <div className="space-y-2">
                <span className="font-display text-xs font-bold text-black uppercase tracking-wider block">
                  2. DEPARTMENT SECTION
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'male', label: '1. MALE' },
                    { id: 'female', label: '2. FEMALE' },
                    { id: 'kids', label: '3. KIDS' },
                  ].map((dep) => (
                    <button
                      key={dep.id}
                      type="button"
                      onClick={() => setGender(dep.id as any)}
                      className={`p-3 text-xs font-display font-bold uppercase border-2 text-center transition-all ${
                        gender === dep.id
                          ? 'bg-black text-cyan border-black shadow-[2px_2px_0px_0px_#00D9FF]'
                          : 'bg-offwhite text-black border-black hover:bg-cyan/20'
                      }`}
                    >
                      {dep.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kind of Cloth (Category) */}
              <div className="space-y-2">
                <span className="font-display text-xs font-bold text-black uppercase tracking-wider block">
                  3. KIND OF CLOTH (CATEGORY)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SEED_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategorySlug(cat.slug)}
                      className={`p-2.5 text-xs font-display font-bold uppercase border text-center transition-all ${
                        categorySlug === cat.slug
                          ? 'bg-cyan text-black border-black font-extrabold'
                          : 'bg-offwhite text-charcoal border-grey hover:border-black hover:text-black'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Garment Name & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="font-display text-xs font-bold text-black uppercase tracking-wider">
                    GARMENT NAME / TITLE
                  </span>
                  <Input
                    placeholder="e.g. OVERSIZED SCULPTURAL SHIRT"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-offwhite border-2 border-black font-display text-xs uppercase"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="font-display text-xs font-bold text-black uppercase tracking-wider">
                    PRICE (INR ₹)
                  </span>
                  <Input
                    type="number"
                    placeholder="4999"
                    value={priceINR}
                    onChange={(e) => setPriceINR(e.target.value)}
                    required
                    className="bg-offwhite border-2 border-black font-display text-xs"
                  />
                </div>
              </div>

              {/* Material & Fit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="font-display text-[10px] font-bold text-charcoal uppercase tracking-wider">
                    FABRIC / MATERIAL SPECIFICATION
                  </span>
                  <Input
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="bg-offwhite border border-black text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="font-display text-[10px] font-bold text-charcoal uppercase tracking-wider">
                    FIT / SILHOUETTE
                  </span>
                  <Input
                    value={fit}
                    onChange={(e) => setFit(e.target.value)}
                    className="bg-offwhite border border-black text-xs"
                  />
                </div>
              </div>

              {/* Colour and Hex */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="font-display text-[10px] font-bold text-charcoal uppercase tracking-wider">
                    PRIMARY COLOUR NAME
                  </span>
                  <Input
                    value={colour}
                    onChange={(e) => setColour(e.target.value)}
                    className="bg-offwhite border border-black text-xs uppercase"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="font-display text-[10px] font-bold text-charcoal uppercase tracking-wider">
                    COLOUR HEX CODE
                  </span>
                  <div className="flex gap-2 items-center">
                    <div
                      className="w-8 h-8 border border-black flex-shrink-0"
                      style={{ backgroundColor: colourHex }}
                    />
                    <Input
                      value={colourHex}
                      onChange={(e) => setColourHex(e.target.value)}
                      className="bg-offwhite border border-black text-xs uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Available Sizes */}
              <div className="space-y-2">
                <span className="font-display text-xs font-bold text-black uppercase tracking-wider block">
                  AVAILABLE SIZES
                </span>
                <div className="flex flex-wrap gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleSize(sz)}
                      className={`w-12 h-10 font-display text-xs font-bold uppercase border-2 transition-colors ${
                        sizes.includes(sz)
                          ? 'bg-cyan text-black border-black'
                          : 'bg-offwhite text-charcoal border-grey hover:border-black'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Per Size */}
              <div className="space-y-1.5">
                <span className="font-display text-[10px] font-bold text-charcoal uppercase tracking-wider">
                  STOCK QUANTITY PER SIZE
                </span>
                <Input
                  type="number"
                  value={stockPerSize}
                  onChange={(e) => setStockPerSize(e.target.value)}
                  className="bg-offwhite border border-black text-xs w-32"
                />
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-6 border-t-2 border-black flex items-center justify-between gap-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              CANCEL
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="bg-black text-cream hover:bg-cyan hover:text-black font-display font-bold uppercase"
            >
              {isSubmitting ? 'UPLOADING...' : '✓ PUBLISH TO STOREFRONT'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
