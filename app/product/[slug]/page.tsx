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
    <main className="flex-1 bg-cream min-h-screen pt-28 pb-20 px-4 md:px-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="font-display text-[11px] font-bold tracking-widest text-charcoal uppercase flex items-center gap-2 border-b border-grey pb-3">
          <Link href="/" className="hover:text-black">HOME</Link>
          <ChevronRight className="w-3 h-3 text-grey" />
          <Link href="/shop" className="hover:text-black">SHOP</Link>
          <ChevronRight className="w-3 h-3 text-grey" />
          <Link href={`/shop/${product.category.slug}`} className="hover:text-black">{product.category.name}</Link>
          <ChevronRight className="w-3 h-3 text-grey" />
          <span className="text-black font-bold">{product.name}</span>
        </nav>

        {/* Main Grid: Left Gallery + Right Sticky Panel */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image Gallery Stack */}
          <div className="md:col-span-7 flex flex-col gap-4">
            {/* Main Primary Image Display */}
            <div className="relative aspect-[4/5] bg-grey/20 border border-black overflow-hidden group cursor-zoom-in" onClick={() => setLightboxOpen(true)}>
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
                className="absolute bottom-4 right-4 bg-black text-cream p-2.5 hover:bg-cyan hover:text-black transition-colors"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>

            {/* Gallery Thumbnail Strip */}
            {activeImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {activeImages.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-[4/5] border transition-all ${
                      selectedImageIndex === index ? 'border-black ring-2 ring-cyan' : 'border-grey/50 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img.url} alt={img.alt_text} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Sticky Product Info Panel */}
          <div className="md:col-span-5 flex flex-col gap-6 sticky top-28 bg-offwhite border border-black p-6 md:p-8">
            <div>
              <span className="font-display text-xs font-bold text-cyan tracking-widest uppercase block mb-1">
                {product.category.name}
              </span>
              <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-black uppercase">
                {product.name}
              </h1>
            </div>

            {/* Price & Rating Row */}
            <div className="flex items-center justify-between border-y border-grey py-3">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-xl font-bold text-black">
                  {formatINR(product.sale_price || product.mrp)}
                </span>
                {product.sale_price && product.sale_price < product.mrp && (
                  <span className="font-display text-sm text-charcoal/60 line-through">
                    {formatINR(product.mrp)}
                  </span>
                )}
                {discount > 0 && <Badge variant="accent">{discount}% OFF</Badge>}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 font-display text-xs font-bold text-black">
                <Star className="w-4 h-4 fill-black text-black" />
                <span>{product.rating_average}</span>
                <span className="text-charcoal/60">({product.rating_count})</span>
              </div>
            </div>

            <p className="font-body text-xs text-charcoal leading-relaxed">
              {product.description}
            </p>

            {/* Color Swatch Selector (PDP-5) */}
            <div className="flex flex-col gap-2">
              <span className="font-display text-xs font-bold tracking-widest text-charcoal uppercase">
                COLOUR: <span className="text-black">{selectedColour}</span>
              </span>
              <div className="flex gap-2">
                {Array.from(new Set(product.variants.map((v) => v.colour))).map((col) => {
                  const variantObj = product.variants.find((v) => v.colour === col);
                  return (
                    <button
                      key={col}
                      onClick={() => {
                        setSelectedColour(col);
                        setSelectedImageIndex(0);
                      }}
                      className={`px-3 py-1.5 font-display text-xs font-bold border uppercase transition-colors ${
                        selectedColour === col ? 'border-black bg-cyan text-black' : 'border-grey bg-cream text-charcoal hover:border-black'
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
                <span className="font-display text-xs font-bold tracking-widest text-charcoal uppercase">
                  SIZE: <span className="text-black">{selectedSize || 'NONE SELECTED'}</span>
                </span>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="font-display text-xs font-bold text-black underline uppercase hover:text-cyan"
                >
                  SIZE GUIDE ➔
                </button>
              </div>

              {sizeError && (
                <div className="bg-error-red/10 border border-error-red p-2 text-xs font-display font-bold text-error-red uppercase">
                  ⚠ SELECT A SIZE TO ADD THIS TO YOUR BAG.
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
                      className={`py-3 text-xs font-display font-bold border transition-all ${
                        isSelected
                          ? 'bg-cyan text-black border-black ring-2 ring-black font-extrabold'
                          : inStock
                          ? 'bg-cream text-black border-black/40 hover:border-black'
                          : 'bg-grey/20 text-grey border-grey line-through cursor-not-allowed'
                      }`}
                    >
                      {variant.size} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add to Bag & Wishlist Buttons */}
            <div className="flex flex-col gap-3 pt-4 border-t border-grey">
              <Button variant="primary" size="lg" fullWidth onClick={handleAddToCart}>
                ADD TO BAG
              </Button>
              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={handleWishlistToggle}
                className="flex items-center justify-center gap-2"
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-black' : ''}`} />
                {isSaved ? 'SAVED TO WISHLIST' : 'SAVE TO WISHLIST'}
              </Button>
            </div>

            {/* Accordion Specification Panels (PDP-7) */}
            <div className="flex flex-col border-t border-black mt-2 divide-y divide-grey font-display text-xs">
              <button
                onClick={() => setActiveAccordion(activeAccordion === 'details' ? null : 'details')}
                className="py-3 flex justify-between items-center font-bold uppercase text-black"
              >
                <span>SPECIFICATIONS & MATERIAL</span>
                <span>{activeAccordion === 'details' ? '-' : '+'}</span>
              </button>
              {activeAccordion === 'details' && (
                <div className="py-3 font-body text-xs text-charcoal flex flex-col gap-2">
                  <p><strong>MATERIAL:</strong> {product.material}</p>
                  <p><strong>FIT:</strong> {product.fit}</p>
                  <p><strong>CARE:</strong> {product.care}</p>
                  <p><strong>WEIGHT:</strong> {product.weight_g} grams</p>
                  <p><strong>ORIGIN:</strong> {product.country_of_origin}</p>
                </div>
              )}

              <button
                onClick={() => setActiveAccordion(activeAccordion === 'shipping' ? null : 'shipping')}
                className="py-3 flex justify-between items-center font-bold uppercase text-black"
              >
                <span>SHIPPING & RETURNS</span>
                <span>{activeAccordion === 'shipping' ? '-' : '+'}</span>
              </button>
              {activeAccordion === 'shipping' && (
                <div className="py-3 font-body text-xs text-charcoal flex flex-col gap-2">
                  <p>Complimentary flat-rate shipping on orders above ₹3,000 INR.</p>
                  <p>7-day hassle-free return window for unworn items with original tag.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS SECTION (PDP-12) */}
        {relatedProducts.length > 0 && (
          <section className="py-12 border-t border-black">
            <div className="flex items-center justify-between border-b border-black pb-4 mb-8">
              <h2 className="font-display text-xl font-bold tracking-tight uppercase text-black">
                YOU MAY ALSO LIKE
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
        <div className="relative aspect-[4/5] w-full bg-black">
          <Image src={currentImage.url} alt={currentImage.alt_text} fill className="object-contain" />
        </div>
      </Modal>

      {/* Size Guide Modal (PDP-6) */}
      <Modal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} title="SIZE GUIDE & MEASUREMENTS">
        <div className="flex flex-col gap-4 font-body text-xs text-charcoal">
          <p>All measurements are in centimeters. Measure flat across garment.</p>
          <div className="border border-black bg-cream p-4 font-display text-xs">
            <div className="flex justify-between border-b border-grey pb-2 font-bold">
              <span>SIZE</span>
              <span>CHEST</span>
              <span>LENGTH</span>
              <span>SHOULDER</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-grey/40">
              <span>S</span>
              <span>56 cm</span>
              <span>72 cm</span>
              <span>52 cm</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-grey/40 font-bold text-black">
              <span>M</span>
              <span>59 cm</span>
              <span>74 cm</span>
              <span>54 cm</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-grey/40">
              <span>L</span>
              <span>62 cm</span>
              <span>76 cm</span>
              <span>56 cm</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span>XL</span>
              <span>65 cm</span>
              <span>78 cm</span>
              <span>58 cm</span>
            </div>
          </div>
          <Button variant="primary" fullWidth onClick={() => setSizeGuideOpen(false)}>
            CLOSE GUIDE
          </Button>
        </div>
      </Modal>
    </main>
  );
}
