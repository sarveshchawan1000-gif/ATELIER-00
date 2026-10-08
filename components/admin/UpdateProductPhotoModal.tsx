'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useProductStore } from '@/lib/product-store';
import { ProductWithDetails } from '@/lib/db/types';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Upload, X } from 'lucide-react';
import { clsx } from 'clsx';

interface UpdateProductPhotoModalProps {
  isOpen: boolean;
  product: ProductWithDetails | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function UpdateProductPhotoModal({
  isOpen,
  product,
  onClose,
  onSuccess,
}: UpdateProductPhotoModalProps) {
  const { showToast } = useToast();
  const updateProductPhoto = useProductStore((state) => state.updateProductPhoto);

  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (product) {
      const primary = product.images.find((i) => i.is_primary) || product.images[0];
      setPhotoUrl(primary?.url || '');
      setAltText(primary?.alt_text || `${product.name} garment photo`);
    } else {
      setPhotoUrl('');
      setAltText('');
    }
  }, [product]);

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

  if (!isOpen || !product) return null;

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
      showToast('Photo loaded from device');
    };
    reader.readAsDataURL(file);
  };

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
      showToast('Photo loaded from device');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl) {
      showToast('Please provide or upload a photo');
      return;
    }

    setIsSubmitting(true);
    updateProductPhoto(product.id, photoUrl, altText || `${product.name} photo`);
    setIsSubmitting(false);

    showToast(`Photo updated for: ${product.name}`);
    if (onSuccess) onSuccess();
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
        aria-labelledby="update-photo-title"
        className="bg-[#FAFAF8] border border-[#E8E6E1] w-full h-full md:h-auto md:w-[92vw] md:max-w-md md:max-h-[90vh] flex flex-col overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)] md:rounded-[3px] animate-in fade-in zoom-in-[0.98] duration-200"
      >
        {/* Header */}
        <div className="bg-[#FAFAF8] px-6 py-5 flex items-center justify-between border-b border-[#E8E6E1] flex-shrink-0">
          <div>
            <h2
              id="update-photo-title"
              className="text-[18px] font-medium text-[#111111] tracking-tight leading-tight"
            >
              Update photo
            </h2>
            <p className="text-[13px] text-[#6B6B6B] mt-0.5 truncate max-w-[280px]">
              {product.name}
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

        {/* Form Body */}
        <form
          id="update-photo-form"
          onSubmit={handleSave}
          className="flex-1 overflow-y-auto p-6 space-y-5"
        >
          {/* Dropzone */}
          <div>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => {
                if (!photoUrl) fileInputRef.current?.click();
              }}
              className={clsx(
                'relative aspect-[3/4] max-h-72 w-full bg-[#F3F2EF] border rounded-[2px] overflow-hidden flex flex-col items-center justify-center transition-colors',
                photoUrl ? 'border-solid border-[#D9D6D0]' : 'border-dashed border-[#D9D6D0] cursor-pointer group',
                isDragging && 'border-[#111111] bg-[#EDEBE6]'
              )}
            >
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={altText || 'Garment preview'}
                  fill
                  className="object-cover object-center"
                />
              ) : (
                <div className="p-6 text-center flex flex-col items-center justify-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white border border-[#E8E6E1] flex items-center justify-center group-hover:border-[#111111] transition-colors">
                    <Upload className="w-5 h-5 text-[#111111]" strokeWidth={1.5} />
                  </div>
                  <span className="text-[14px] font-medium text-[#111111]">
                    Click to browse files
                  </span>
                  <span className="text-[12px] text-[#6B6B6B]">
                    PNG, JPG or WebP supported
                  </span>
                </div>
              )}
            </div>

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
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="text-[13px] font-medium text-[#B3261E] hover:underline"
                >
                  Remove
                </button>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Thin "or" divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 border-t border-[#E8E6E1]" />
            <span className="text-[12px] text-[#8A8A8A]">or</span>
            <div className="flex-1 border-t border-[#E8E6E1]" />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="update-url-input" className="text-[13px] font-medium text-[#111111] block">
              Or paste direct image URL
            </label>
            <input
              id="update-url-input"
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={photoUrl.startsWith('data:') ? '' : photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full h-[44px] px-3.5 bg-white text-[#111111] text-[14px] border border-[#D9D6D0] hover:border-[#B8B5AE] placeholder:text-[#9A9A9A] rounded-[2px] transition-colors focus:border-[#111111] focus:ring-2 focus:ring-[#111111] focus:ring-offset-2 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="update-alt-input" className="text-[13px] font-medium text-[#111111] block">
              Photo description / alt text
            </label>
            <input
              id="update-alt-input"
              type="text"
              placeholder="e.g. Studio front angle view"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="w-full h-[44px] px-3.5 bg-white text-[#111111] text-[14px] border border-[#D9D6D0] hover:border-[#B8B5AE] placeholder:text-[#9A9A9A] rounded-[2px] transition-colors focus:border-[#111111] focus:ring-2 focus:ring-[#111111] focus:ring-offset-2 focus:outline-none"
            />
            <p className="text-[12px] text-[#6B6B6B]">Used for SEO and accessibility</p>
          </div>
        </form>

        {/* Sticky Footer */}
        <div className="bg-[#FAFAF8] border-t border-[#E8E6E1] px-6 py-4 flex items-center justify-end gap-3 flex-shrink-0">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
            className="min-w-[90px] h-[44px] rounded-[2px] font-medium text-[14px]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="update-photo-form"
            variant="primary"
            size="md"
            disabled={isSubmitting || !photoUrl}
            isLoading={isSubmitting}
            className="min-w-[110px] h-[44px] rounded-[2px] font-medium text-[14px]"
          >
            Save photo
          </Button>
        </div>
      </div>
    </div>
  );
}
