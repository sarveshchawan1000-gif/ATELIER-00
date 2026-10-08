'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useProductStore } from '@/lib/product-store';
import { ProductWithDetails } from '@/lib/db/types';
import { SEED_CATEGORIES } from '@/lib/db/seed-data';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Upload, X } from 'lucide-react';
import { clsx } from 'clsx';
import { CONFIG } from '@/lib/config';

interface AddProductPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newProduct: ProductWithDetails) => void;
  initialGender?: 'male' | 'female' | 'kids';
  initialCategorySlug?: string;
}

const DEPARTMENTS: { id: 'male' | 'female' | 'kids'; label: string }[] = [
  { id: 'male', label: 'Men' },
  { id: 'female', label: 'Women' },
  { id: 'kids', label: 'Kids' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export function AddProductPhotoModal({
  isOpen,
  onClose,
  onSuccess,
  initialGender = 'male',
  initialCategorySlug = 't-shirts',
}: AddProductPhotoModalProps) {
  const { showToast } = useToast();
  const addCustomProduct = useProductStore((state) => state.addCustomProduct);

  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const colorPickerRef = useRef<HTMLInputElement>(null);

  // Form State
  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'kids'>(initialGender);
  const [categorySlug, setCategorySlug] = useState(initialCategorySlug);
  const [priceINR, setPriceINR] = useState('4999');
  const [material, setMaterial] = useState('100% Combed Heavyweight Cotton (320 GSM)');
  const [fit, setFit] = useState('Relaxed Boxy Architectural Silhouette');
  const [colour, setColour] = useState('Obsidian Black');
  const [colourHex, setColourHex] = useState('#111111');
  const [description, setDescription] = useState(
    'Architectural luxury garment crafted with geometric precision, reinforced seams, and minimal monolithic drape.'
  );
  const [sizes, setSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [stockPerSize, setStockPerSize] = useState('8');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Accessibility: Focus trap & Escape listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // File selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPhotoUrl(result);
      if (!altText) {
        setAltText(`${name || 'Garment'} photo for ${CONFIG.brandName}`);
      }
      showToast('Photo attached successfully');
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPhotoUrl(result);
      if (!altText) {
        setAltText(`${name || 'Garment'} photo for ${CONFIG.brandName}`);
      }
      showToast('Photo attached successfully');
    };
    reader.readAsDataURL(file);
  };

  // Toggle size chip
  const toggleSize = (sz: string) => {
    if (sizes.includes(sz)) {
      if (sizes.length > 1) {
        setSizes(sizes.filter((s) => s !== sz));
      }
    } else {
      setSizes([...sizes, sz]);
    }
  };

  // Department keyboard navigation
  const handleDepartmentKeyDown = (e: React.KeyboardEvent) => {
    const currentIndex = DEPARTMENTS.findIndex((d) => d.id === gender);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % DEPARTMENTS.length;
      setGender(DEPARTMENTS[nextIndex].id);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + DEPARTMENTS.length) % DEPARTMENTS.length;
      setGender(DEPARTMENTS[prevIndex].id);
    }
  };

  // Category keyboard navigation
  const handleCategoryKeyDown = (e: React.KeyboardEvent) => {
    const currentIndex = SEED_CATEGORIES.findIndex((c) => c.slug === categorySlug);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % SEED_CATEGORIES.length;
      setCategorySlug(SEED_CATEGORIES[nextIndex].slug);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + SEED_CATEGORIES.length) % SEED_CATEGORIES.length;
      setCategorySlug(SEED_CATEGORIES[prevIndex].slug);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Please enter a garment name');
      return;
    }

    if (!photoUrl) {
      showToast('Please upload or provide a photo');
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
      name: name.trim(),
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
          colour: colour.trim(),
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
        colour: colour.trim(),
        colour_hex: colourHex,
        size: sz as any,
        stock: stockNum,
        reserved_stock: 0,
      })),
    };

    addCustomProduct(newProduct);
    setIsSubmitting(false);
    showToast(`Garment published: ${newProduct.name}`);

    if (onSuccess) {
      onSuccess(newProduct);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#111111]/40 backdrop-blur-[4px] flex items-center justify-center p-0 md:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-garment-title"
        className="bg-[#FAFAF8] border border-[#E8E6E1] w-full h-full md:h-auto md:w-[92vw] md:max-w-[960px] md:max-h-[90vh] flex flex-col overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)] md:rounded-[3px] animate-in fade-in zoom-in-[0.98] duration-200"
      >
        {/* Modal Header */}
        <div className="bg-[#FAFAF8] px-6 py-5 flex items-center justify-between border-b border-[#E8E6E1] flex-shrink-0">
          <div>
            <h2
              id="add-garment-title"
              className="text-[18px] font-medium text-[#111111] tracking-tight leading-tight"
            >
              Add garment
            </h2>
            <p className="text-[13px] text-[#6B6B6B] mt-0.5">
              Upload a photo and fill in the details.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-10 h-10 flex items-center justify-center rounded-[2px] text-[#111111] hover:bg-[#F3F2EF] transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Modal Form Scrollable Body */}
        <form
          id="add-garment-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 md:p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-start">
            {/* Left Column: Photo (40% on desktop) */}
            <div className="md:col-span-5 space-y-5">
              <div>
                <h3 className="text-[13px] font-semibold text-[#111111] mb-3">Photo</h3>

                {/* 3:4 Aspect Ratio Dropzone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => {
                    if (!photoUrl) fileInputRef.current?.click();
                  }}
                  className={clsx(
                    'relative aspect-[3/4] max-h-[420px] w-full bg-[#F3F2EF] border rounded-[2px] overflow-hidden flex flex-col items-center justify-center transition-colors',
                    photoUrl ? 'border-solid border-[#D9D6D0]' : 'border-dashed border-[#D9D6D0] cursor-pointer group',
                    isDragging && 'border-[#111111] bg-[#EDEBE6]'
                  )}
                >
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt={altText || 'Uploaded garment preview'}
                      fill
                      className="object-cover object-center"
                    />
                  ) : (
                    <div className="p-6 text-center flex flex-col items-center justify-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white border border-[#E8E6E1] flex items-center justify-center group-hover:border-[#111111] transition-colors">
                        <Upload className="w-5 h-5 text-[#111111]" strokeWidth={1.5} />
                      </div>
                      <div>
                        <span className="text-[14px] font-medium text-[#111111] block">
                          Upload a photo
                        </span>
                        <span className="text-[12px] text-[#6B6B6B] block mt-1">
                          PNG, JPG or WebP · 3:4 recommended
                        </span>
                      </div>
                      <span className="h-[36px] px-4 text-[13px] font-medium border border-[#111111] text-[#111111] rounded-[2px] flex items-center justify-center group-hover:bg-[#111111] group-hover:text-white transition-colors mt-1">
                        Browse files
                      </span>
                    </div>
                  )}
                </div>

                {/* Photo action links if uploaded */}
                {photoUrl && (
                  <div className="flex items-center justify-center gap-4 mt-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[13px] font-medium text-[#111111] hover:underline"
                    >
                      Replace
                    </button>
                    <span className="text-[#D9D6D0]">·</span>
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoUrl('');
                        setAltText('');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="text-[13px] font-medium text-[#B3261E] hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Thin "or" divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 border-t border-[#E8E6E1]" />
                <span className="text-[12px] text-[#8A8A8A]">or</span>
                <div className="flex-1 border-t border-[#E8E6E1]" />
              </div>

              {/* Or Paste URL */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="photo-url-input" className="text-[13px] font-medium text-[#111111]">
                    Or paste image URL
                  </label>
                  <span className="text-[11px] text-[#6B6B6B]">Optional</span>
                </div>
                <input
                  id="photo-url-input"
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={photoUrl.startsWith('data:') ? '' : photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full h-[44px] px-3.5 bg-white text-[#111111] text-[14px] border border-[#D9D6D0] hover:border-[#B8B5AE] placeholder:text-[#9A9A9A] rounded-[2px] transition-colors focus:border-[#111111] focus:ring-2 focus:ring-[#111111] focus:ring-offset-2 focus:outline-none"
                />
              </div>

              {/* Photo Caption */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="alt-text-input" className="text-[13px] font-medium text-[#111111]">
                    Photo caption
                  </label>
                  <span className="text-[11px] text-[#6B6B6B]">Optional</span>
                </div>
                <input
                  id="alt-text-input"
                  type="text"
                  placeholder="e.g. Front studio view of Trench Coat"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="w-full h-[44px] px-3.5 bg-white text-[#111111] text-[14px] border border-[#D9D6D0] hover:border-[#B8B5AE] placeholder:text-[#9A9A9A] rounded-[2px] transition-colors focus:border-[#111111] focus:ring-2 focus:ring-[#111111] focus:ring-offset-2 focus:outline-none"
                />
                <p className="text-[12px] text-[#6B6B6B]">Used for SEO and accessibility</p>
              </div>
            </div>

            {/* Right Column: Details & Variants (60% on desktop) */}
            <div className="md:col-span-7 space-y-6">
              {/* SECTION: Details */}
              <div className="space-y-5">
                <h3 className="text-[13px] font-semibold text-[#111111] mb-3">Details</h3>

                {/* Department Radio Group */}
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-[#111111] block">
                    Department
                  </label>
                  <div
                    role="radiogroup"
                    aria-label="Department"
                    onKeyDown={handleDepartmentKeyDown}
                    className="grid grid-cols-3 border border-[#D9D6D0] rounded-[2px] overflow-hidden bg-white divide-x divide-[#D9D6D0]"
                  >
                    {DEPARTMENTS.map((dep) => {
                      const isSelected = gender === dep.id;
                      return (
                        <button
                          key={dep.id}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          tabIndex={isSelected ? 0 : -1}
                          onClick={() => setGender(dep.id)}
                          className={clsx(
                            'h-[40px] text-[14px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-1 select-none flex items-center justify-center',
                            isSelected
                              ? 'bg-[#111111] text-white font-medium'
                              : 'bg-white text-[#444444] hover:text-[#111111] hover:bg-[#FAFAF8]'
                          )}
                        >
                          {dep.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Category Selector Chips */}
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-[#111111] block">
                    Category
                  </label>
                  <div
                    role="radiogroup"
                    aria-label="Category"
                    onKeyDown={handleCategoryKeyDown}
                    className="flex flex-wrap gap-2"
                  >
                    {SEED_CATEGORIES.map((cat) => {
                      const isSelected = categorySlug === cat.slug;
                      const displayName =
                        cat.slug === 't-shirts'
                          ? 'T-shirts & tops'
                          : cat.slug === 'hoodies'
                          ? 'Hoodies & sweats'
                          : cat.slug === 'jackets'
                          ? 'Jackets & outerwear'
                          : cat.name;

                      return (
                        <button
                          key={cat.id}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          tabIndex={isSelected ? 0 : -1}
                          onClick={() => setCategorySlug(cat.slug)}
                          className={clsx(
                            'h-[38px] md:h-[40px] px-3.5 text-[14px] rounded-[2px] border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-1 select-none flex items-center',
                            isSelected
                              ? 'bg-[#111111] text-white border-[#111111] font-medium'
                              : 'bg-white text-[#444444] border-[#D9D6D0] hover:border-[#111111] hover:text-[#111111]'
                          )}
                        >
                          {displayName}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Product Name & Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="product-name" className="text-[13px] font-medium text-[#111111] flex items-center justify-between">
                      <span>Product name</span>
                      <span className="text-[11px] text-[#6B6B6B] font-normal">*</span>
                    </label>
                    <input
                      id="product-name"
                      type="text"
                      placeholder="e.g. Oversized Poplin Shirt"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full h-[44px] px-3.5 bg-white text-[#111111] text-[14px] border border-[#D9D6D0] hover:border-[#B8B5AE] placeholder:text-[#9A9A9A] rounded-[2px] transition-colors focus:border-[#111111] focus:ring-2 focus:ring-[#111111] focus:ring-offset-2 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="product-price" className="text-[13px] font-medium text-[#111111] flex items-center justify-between">
                      <span>Price</span>
                      <span className="text-[11px] text-[#6B6B6B] font-normal">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px] text-[#6B6B6B] pointer-events-none select-none">
                        ₹
                      </span>
                      <input
                        id="product-price"
                        type="text"
                        inputMode="numeric"
                        placeholder="4999"
                        value={priceINR}
                        onChange={(e) => setPriceINR(e.target.value.replace(/[^\d]/g, ''))}
                        required
                        className="w-full h-[44px] pl-8 pr-3.5 bg-white text-[#111111] text-[14px] border border-[#D9D6D0] hover:border-[#B8B5AE] placeholder:text-[#9A9A9A] rounded-[2px] transition-colors focus:border-[#111111] focus:ring-2 focus:ring-[#111111] focus:ring-offset-2 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Fabric Specification (Full width row, visible text) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="material-input" className="text-[13px] font-medium text-[#111111]">
                      Fabric / material specification
                    </label>
                    <span className="text-[11px] text-[#6B6B6B]">Optional</span>
                  </div>
                  <textarea
                    id="material-input"
                    rows={2}
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white text-[#111111] text-[14px] border border-[#D9D6D0] hover:border-[#B8B5AE] placeholder:text-[#9A9A9A] rounded-[2px] transition-colors focus:border-[#111111] focus:ring-2 focus:ring-[#111111] focus:ring-offset-2 focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Fit / Silhouette (Full width row, visible text) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="fit-input" className="text-[13px] font-medium text-[#111111]">
                      Fit / silhouette
                    </label>
                    <span className="text-[11px] text-[#6B6B6B]">Optional</span>
                  </div>
                  <textarea
                    id="fit-input"
                    rows={2}
                    value={fit}
                    onChange={(e) => setFit(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white text-[#111111] text-[14px] border border-[#D9D6D0] hover:border-[#B8B5AE] placeholder:text-[#9A9A9A] rounded-[2px] transition-colors focus:border-[#111111] focus:ring-2 focus:ring-[#111111] focus:ring-offset-2 focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* 1px Hairline divider */}
              <div className="border-t border-[#E8E6E1] my-6" />

              {/* SECTION: Variants */}
              <div className="space-y-5">
                <h3 className="text-[13px] font-semibold text-[#111111] mb-3">Variants</h3>

                {/* Colour Name & Colour Hex */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="colour-name" className="text-[13px] font-medium text-[#111111] block">
                      Colour name
                    </label>
                    <input
                      id="colour-name"
                      type="text"
                      placeholder="e.g. Obsidian Black"
                      value={colour}
                      onChange={(e) => setColour(e.target.value)}
                      className="w-full h-[44px] px-3.5 bg-white text-[#111111] text-[14px] border border-[#D9D6D0] hover:border-[#B8B5AE] placeholder:text-[#9A9A9A] rounded-[2px] transition-colors focus:border-[#111111] focus:ring-2 focus:ring-[#111111] focus:ring-offset-2 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="colour-hex" className="text-[13px] font-medium text-[#111111] block">
                      Colour hex
                    </label>
                    <div className="flex gap-2 items-center">
                      {/* 44px Swatch opening native color picker */}
                      <div
                        onClick={() => colorPickerRef.current?.click()}
                        className="w-[44px] h-[44px] border border-[#D9D6D0] hover:border-[#111111] flex-shrink-0 rounded-[2px] cursor-pointer relative overflow-hidden transition-colors"
                        style={{ backgroundColor: colourHex }}
                        title="Click to pick colour"
                      >
                        <input
                          ref={colorPickerRef}
                          type="color"
                          value={colourHex.startsWith('#') && colourHex.length === 7 ? colourHex : '#111111'}
                          onChange={(e) => setColourHex(e.target.value)}
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                          aria-label="Pick color"
                        />
                      </div>
                      <input
                        id="colour-hex"
                        type="text"
                        placeholder="#111111"
                        value={colourHex}
                        onChange={(e) => setColourHex(e.target.value)}
                        className="w-full h-[44px] px-3.5 bg-white text-[#111111] text-[14px] font-mono border border-[#D9D6D0] hover:border-[#B8B5AE] placeholder:text-[#9A9A9A] rounded-[2px] transition-colors focus:border-[#111111] focus:ring-2 focus:ring-[#111111] focus:ring-offset-2 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Available Sizes Chips */}
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-[#111111] block">
                    Available sizes
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map((sz) => {
                      const isSelected = sizes.includes(sz);
                      return (
                        <button
                          key={sz}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => toggleSize(sz)}
                          className={clsx(
                            'min-w-[44px] h-[44px] px-3 text-[14px] rounded-[2px] border transition-colors select-none flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-1',
                            isSelected
                              ? 'bg-[#111111] text-white border-[#111111] font-medium'
                              : 'bg-white text-[#444444] border-[#D9D6D0] hover:border-[#111111] hover:text-[#111111]'
                          )}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Stock quantity per size */}
                <div className="space-y-1.5 pt-1">
                  <label htmlFor="stock-stepper" className="text-[13px] font-medium text-[#111111] block">
                    Stock quantity per size
                  </label>
                  <div className="flex items-center border border-[#D9D6D0] rounded-[2px] h-[44px] max-w-[140px] bg-white overflow-hidden hover:border-[#B8B5AE] transition-colors focus-within:border-[#111111] focus-within:ring-2 focus-within:ring-[#111111] focus-within:ring-offset-2">
                    <button
                      type="button"
                      onClick={() => setStockPerSize(String(Math.max(1, (parseInt(stockPerSize, 10) || 1) - 1)))}
                      className="w-11 h-full flex items-center justify-center text-[#111111] hover:bg-[#F3F2EF] transition-colors border-r border-[#D9D6D0] select-none text-[16px] font-normal"
                      aria-label="Decrease stock"
                    >
                      −
                    </button>
                    <input
                      id="stock-stepper"
                      type="text"
                      inputMode="numeric"
                      value={stockPerSize}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^\d]/g, '');
                        setStockPerSize(val);
                      }}
                      className="w-full h-full text-center text-[14px] text-[#111111] font-medium focus:outline-none bg-transparent"
                      aria-label="Stock quantity per size"
                    />
                    <button
                      type="button"
                      onClick={() => setStockPerSize(String((parseInt(stockPerSize, 10) || 0) + 1))}
                      className="w-11 h-full flex items-center justify-center text-[#111111] hover:bg-[#F3F2EF] transition-colors border-l border-[#D9D6D0] select-none text-[16px] font-normal"
                      aria-label="Increase stock"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-[12px] text-[#6B6B6B]">Applies to each selected size.</p>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Sticky Footer */}
        <div className="bg-[#FAFAF8] border-t border-[#E8E6E1] px-6 py-4 flex items-center justify-end gap-3 flex-shrink-0">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
            className="min-w-[96px] h-[44px] md:h-[46px] rounded-[2px] font-medium text-[14px]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-garment-form"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="min-w-[128px] h-[44px] md:h-[46px] rounded-[2px] font-medium text-[14px]"
          >
            {isSubmitting ? 'Adding…' : 'Add garment'}
          </Button>
        </div>
      </div>
    </div>
  );
}
