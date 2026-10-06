'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useProductStore } from '@/lib/product-store';
import { ProductWithDetails } from '@/lib/db/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { Upload, X, Image as ImageIcon, Camera, Sparkles } from 'lucide-react';

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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  if (!isOpen || !product) return null;

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
      showToast('PHOTO LOADED FROM DEVICE');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl) {
      showToast('PLEASE PROVIDE OR UPLOAD A PHOTO');
      return;
    }

    setIsSubmitting(true);
    updateProductPhoto(product.id, photoUrl, altText || `${product.name} photo`);
    setIsSubmitting(false);

    showToast(`PHOTO UPDATED FOR: ${product.name}`);
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
      <div className="bg-cream border-2 border-black max-w-lg w-full flex flex-col overflow-hidden shadow-[8px_8px_0px_0px_#111111]">
        {/* Header */}
        <div className="bg-black text-cream px-6 py-4 flex items-center justify-between border-b border-black">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-cyan" />
            <span className="font-display text-xs font-bold text-cyan tracking-widest uppercase">
              UPDATE GARMENT PHOTO // {product.name}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-cream hover:text-cyan font-display text-sm font-bold uppercase transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div>
            <span className="font-display text-xs font-bold text-black uppercase tracking-wider block mb-2">
              SELECT OR UPLOAD NEW PHOTO
            </span>

            {/* Photo Preview Box (4:5 Ratio) */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-[4/5] max-h-72 w-full mx-auto bg-offwhite border-2 border-dashed border-black flex flex-col items-center justify-center cursor-pointer group overflow-hidden hover:bg-cyan/10 transition-colors"
            >
              {photoUrl ? (
                <>
                  <Image
                    src={photoUrl}
                    alt={altText || 'Garment preview'}
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-cream transition-opacity p-4 text-center">
                    <Upload className="w-8 h-8 mb-2 text-cyan" />
                    <span className="font-display text-xs font-bold uppercase">
                      CLICK TO UPLOAD REPLACEMENT FILE
                    </span>
                  </div>
                </>
              ) : (
                <div className="p-6 text-center flex flex-col items-center justify-center gap-2 text-charcoal">
                  <ImageIcon className="w-10 h-10 text-charcoal/50" />
                  <span className="font-display text-xs font-bold text-black uppercase">
                    CLICK TO BROWSE COMPUTER
                  </span>
                  <span className="font-body text-[11px] text-charcoal">
                    JPG, PNG, WEBP supported
                  </span>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="font-display text-[10px] font-bold text-charcoal uppercase block mb-1">
                OR PASTE DIRECT IMAGE URL
              </label>
              <Input
                placeholder="https://images.unsplash.com/..."
                value={photoUrl.startsWith('data:') ? '(Local Device Image File Attached)' : photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="bg-offwhite border-2 border-black text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-display text-[10px] font-bold text-charcoal uppercase block mb-1">
                PHOTO DESCRIPTION / ALT TEXT
              </label>
              <Input
                placeholder="e.g. Atelier Monolithic Wool Overcoat front angle"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="bg-offwhite border-2 border-black text-xs uppercase"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-grey">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              CANCEL
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isSubmitting || !photoUrl}>
              <Sparkles className="w-3.5 h-3.5 mr-1 text-cyan" />
              SAVE & APPLY PHOTO
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
