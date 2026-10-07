'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/lib/db';
import { ProductWithDetails } from '@/lib/db/types';
import { formatINR, calculateDiscountPercentage } from '@/lib/pricing';
import { useCartStore } from '@/lib/cart-store';
import { useWishlistStore } from '@/lib/wishlist-store';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ProductCard } from '@/components/product/ProductCard';
import { CONFIG } from '@/lib/config';
import { Heart, Star, ChevronRight, Maximize2, ShieldCheck } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductWithDetails[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColour, setSelectedColour] = useState<string>('');
  const [sizeError, setSizeError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('details');

  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { showToast } = useToast();

  useEffect(() => {
    async function loadData() {
      const p = await getProductBySlug(slug);
      if (!p) return;
      setProduct(p);
      if (p.variants.length > 0) {
        setSelectedColour(p.variants[0].colour);
      }
      const related = await getRelatedProducts(p.id, p.category_id);
      setRelatedProducts(related);
    }
    loadData();
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen bg-cream pt-32 text-center font-display text-sm uppercase">
        LOADING GARMENT EXHIBITION SPECIFICATIONS...
      </div>
    );
  }

  const isSaved = isInWishlist(product.id);
  const discount = calculateDiscountPercentage(product.mrp, product.sale_price);
  const activeImages = product.images.filter((i) => !i.colour || i.colour === selectedColour);
  const currentImage = activeImages[selectedImageIndex] || product.images[0];

  // Available variants for selected color
  const colorVariants = product.variants.filter((v) => v.colour === selectedColour);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      showToast('Select a size to add this to your bag.', 'OK');
      // Scroll focus to size selector
      document.getElementById('size-selector-anchor')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const selectedVariant = colorVariants.find((v) => v.size === selectedSize);
    if (!selectedVariant) return;

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      colour: selectedColour,
      size: selectedSize,
      unitPricePaise: product.sale_price || product.mrp,
      quantity: 1,
      imageUrl: currentImage.url,
    });

    setSizeError(false);
    showToast(`ADDED ${product.name} (${selectedSize}) TO YOUR BAG`);
  };

  const handleWishlistToggle = () => {
    const added = toggleWishlist({
      productId: product.id,
      productName: product.name,
      mrpPaise: product.mrp,
      salePricePaise: product.sale_price,
      imageUrl: currentImage.url,
      slug: product.slug,
    });
    showToast(added ? `SAVED TO WISHLIST` : `REMOVED FROM WISHLIST`);
  };

  // Structured JSON-LD Data for SEO (PRD §9.3)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.map((i) => i.url),
    description: product.description,
    sku: product.variants[0]?.sku || product.slug,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: (product.sale_price || product.mrp) / 100,
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <main className="flex-1 bg-[#FAFAF8] min-h-screen pt-28 pb-20 px-4 md:px-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-[#6B6B6B] flex items-center gap-2 border-b border-[#E8E6E1] pb-3">
          <Link href="/" className="hover:text-[#111] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-[#6B6B6B] stroke-[1.5]" />
          <Link href="/shop" className="hover:text-[#111] transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3 text-[#6B6B6B] stroke-[1.5]" />
          <Link href={`/shop?category=${product.category.slug}`} className="hover:text-[#111] transition-colors">{product.category.name}</Link>
          <ChevronRight className="w-3 h-3 text-[#6B6B6B] stroke-[1.5]" />
          <span className="text-[#111] font-medium">{product.name}</span>
        </nav>

        {/* Main Grid: Left Gallery + Right Sticky Panel */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          {/* Left Column: Image Gallery Stack */}
          <div className="md:col-span-7 flex flex-col gap-4">
            {/* Main Primary Image Display */}
            <div className="relative aspect-[3/4] bg-[#F3F2EF] overflow-hidden group cursor-zoom-in rounded-sm" onClick={() => setLightboxOpen(true)}>
              <Image
                src={currentImage.url}
                alt={currentImage.alt_text}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 55vw"
              />
              <button
                aria-label="Open full screen image lightbox"
                className="absolute bottom-4 right-4 bg-white/80 hover:bg-white text-[#111] p-2.5 transition-colors rounded-sm shadow-sm"
              >
                <Maximize2 className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            {/* Gallery Thumbnail Strip */}
            {activeImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {activeImages.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-[3/4] bg-[#F3F2EF] overflow-hidden transition-all rounded-sm ${
                      selectedImageIndex === index ? 'ring-1 ring-[#111]' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img.url} alt={img.alt_text} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Sticky Product Info Panel */}
          <div className="md:col-span-5 flex flex-col gap-6 sticky top-28 bg-white border border-[#E8E6E1] p-6 md:p-8 rounded-sm">
            <div>
              <span className="text-xs text-[#6B6B6B] block mb-1">
                {product.category.name}
              </span>
              <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-[#111]">
                {product.name}
              </h1>
            </div>

            {/* Price & Rating Row */}
            <div className="flex items-center justify-between border-y border-[#E8E6E1] py-3.5">
              <div className="flex items-baseline gap-3">
                <span className="text-xl font-medium text-[#111]">
                  {formatINR(product.sale_price || product.mrp)}
                </span>
                {product.sale_price && product.sale_price < product.mrp && (
                  <span className="text-sm text-[#6B6B6B] line-through">
                    {formatINR(product.mrp)}
                  </span>
                )}
                {discount > 0 && <Badge variant="accent">{discount}% off</Badge>}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 text-xs text-[#111]">
                <Star className="w-3.5 h-3.5 fill-[#111] text-[#111]" />
                <span className="font-medium">{product.rating_average}</span>
                <span className="text-[#6B6B6B]">({product.rating_count})</span>
              </div>
            </div>

            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              {product.description}
            </p>

            {/* Color Swatch Selector (PDP-5) */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-[#6B6B6B]">
                Colour: <span className="text-[#111] font-medium">{selectedColour}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(product.variants.map((v) => v.colour))).map((col) => {
                  return (
                    <button
                      key={col}
                      onClick={() => {
                        setSelectedColour(col);
                        setSelectedImageIndex(0);
                      }}
                      className={`px-3 py-1.5 text-xs font-medium border transition-colors rounded-sm ${
                        selectedColour === col ? 'border-[#111] bg-[#111] text-white' : 'border-[#E8E6E1] bg-white text-[#6B6B6B] hover:border-[#111] hover:text-[#111]'
                      }`}
                    >
                      {col}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector Anchor (PDP-4, PDP-8) */}
            <div id="size-selector-anchor" className="flex flex-col gap-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6B6B6B]">
                  Size: <span className="text-[#111] font-medium">{selectedSize || 'Select a size'}</span>
                </span>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-xs text-[#111] underline underline-offset-4 hover:text-[#6B6B6B] transition-colors"
                >
                  Size guide
                </button>
              </div>

              {sizeError && (
                <div className="bg-red-50 border border-red-200 p-2 text-xs text-red-700 rounded-sm">
                  Please select a size to add this to your bag.
                </div>
              )}

              <div className="grid grid-cols-4 gap-2">
                {colorVariants.map((variant) => {
                  const inStock = variant.stock > 0;
                  const isSelected = selectedSize === variant.size;

                  return (
                    <button
                      key={variant.id}
                      disabled={!inStock}
                      onClick={() => {
                        setSelectedSize(variant.size);
                        setSizeError(false);
                      }}
                      className={`py-2.5 text-xs font-medium border transition-all rounded-sm ${
                        isSelected
                          ? 'bg-[#111] text-white border-[#111]'
                          : inStock
                          ? 'bg-white text-[#111] border-[#E8E6E1] hover:border-[#111]'
                          : 'bg-[#F3F2EF] text-[#6B6B6B]/50 border-[#E8E6E1] line-through cursor-not-allowed'
                      }`}
                    >
                      {variant.size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add to Bag & Wishlist Buttons */}
            <div className="flex flex-col gap-3 pt-4 border-t border-[#E8E6E1]">
              <Button variant="primary" size="lg" fullWidth onClick={handleAddToCart}>
                Add to bag
              </Button>
              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={handleWishlistToggle}
                className="flex items-center justify-center gap-2"
              >
                <Heart className={`w-4 h-4 stroke-[1.5] ${isSaved ? 'fill-black' : ''}`} />
                {isSaved ? 'Saved to wishlist' : 'Save to wishlist'}
              </Button>
            </div>

            {/* Accordion Specification Panels (PDP-7) */}
            <div className="flex flex-col border-t border-[#E8E6E1] mt-2 divide-y divide-[#E8E6E1] text-xs">
              <button
                onClick={() => setActiveAccordion(activeAccordion === 'details' ? null : 'details')}
                className="py-3.5 flex justify-between items-center font-medium text-[#111]"
              >
                <span>Specifications & material</span>
                <span>{activeAccordion === 'details' ? '−' : '+'}</span>
              </button>
              {activeAccordion === 'details' && (
                <div className="py-3 text-xs text-[#6B6B6B] flex flex-col gap-2">
                  <p><strong className="text-[#111]">Material:</strong> {product.material}</p>
                  <p><strong className="text-[#111]">Fit:</strong> {product.fit}</p>
                  <p><strong className="text-[#111]">Care:</strong> {product.care}</p>
                  <p><strong className="text-[#111]">Weight:</strong> {product.weight_g}g</p>
                  <p><strong className="text-[#111]">Origin:</strong> {product.country_of_origin}</p>
                </div>
              )}

              <button
                onClick={() => setActiveAccordion(activeAccordion === 'shipping' ? null : 'shipping')}
                className="py-3.5 flex justify-between items-center font-medium text-[#111]"
              >
                <span>Shipping & returns</span>
                <span>{activeAccordion === 'shipping' ? '−' : '+'}</span>
              </button>
              {activeAccordion === 'shipping' && (
                <div className="py-3 text-xs text-[#6B6B6B] flex flex-col gap-2">
                  <p>Complimentary flat-rate shipping on orders above ₹3,000.</p>
                  <p>7-day return window for unworn items with original tags.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS SECTION (PDP-12) */}
        {relatedProducts.length > 0 && (
          <section className="py-12 border-t border-[#E8E6E1]">
            <div className="flex items-center justify-between pb-4 mb-6">
              <h2 className="text-xl font-medium tracking-tight text-[#111]">
                You may also like
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox Modal (PDP-2) */}
      <Modal isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} maxWidth="xl">
        <div className="relative aspect-[3/4] w-full bg-black">
          <Image src={currentImage.url} alt={currentImage.alt_text} fill className="object-contain" />
        </div>
      </Modal>

      {/* Size Guide Modal (PDP-6) */}
      <Modal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} title="Size guide & measurements">
        <div className="flex flex-col gap-4 text-xs text-[#6B6B6B]">
          <p>All measurements are in centimeters. Measured flat across garment.</p>
          <div className="border border-[#E8E6E1] bg-white p-4 text-xs rounded-sm">
            <div className="flex justify-between border-b border-[#E8E6E1] pb-2 font-medium text-[#111]">
              <span>Size</span>
              <span>Chest</span>
              <span>Length</span>
              <span>Shoulder</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#E8E6E1]/50">
              <span>S</span>
              <span>56 cm</span>
              <span>72 cm</span>
              <span>52 cm</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#E8E6E1]/50 font-medium text-[#111]">
              <span>M</span>
              <span>59 cm</span>
              <span>74 cm</span>
              <span>54 cm</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#E8E6E1]/50">
              <span>L</span>
              <span>62 cm</span>
              <span>76 cm</span>
              <span>56 cm</span>
            </div>
            <div className="flex justify-between py-2">
              <span>XL</span>
              <span>65 cm</span>
              <span>78 cm</span>
              <span>58 cm</span>
            </div>
          </div>
          <Button variant="primary" fullWidth onClick={() => setSizeGuideOpen(false)}>
            Close guide
          </Button>
        </div>
      </Modal>
    </main>
  );
}
