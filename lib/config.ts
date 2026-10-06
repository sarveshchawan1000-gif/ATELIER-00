/**
 * BRAND Centralized Configuration
 * Authority: PRD v2.0 & Decisions D1, D3, D5, D6, D7, D8, D9
 */

export const CONFIG = {
  brandName: process.env.NEXT_PUBLIC_BRAND_NAME || 'ATELIER 00',
  currency: 'INR',
  currencySymbol: '₹',

  // Policy & Commerce Defaults (Seeded in Settings)
  shipping: {
    flatRatePaise: 15000, // ₹150 INR
    freeShippingThresholdPaise: 300000, // ₹3,000 INR
    estimatedDays: '3-5 business days',
  },
  returns: {
    windowDays: 7,
    refundTimelineDays: '5-7 business days',
  },
  taxes: {
    gstInclusiveNote: 'Prices are inclusive of all taxes (GST)',
    gstNumberPlaceholder: 'GSTIN: 27AAAAA0000A1Z5',
  },
  auth: {
    minimumAge: 18,
    guestCheckoutEnabled: true,
  },

  // Feature Flags
  featureFlags: {
    enableCoupons: false, // CART-7 (P1, off by default)
    enableCOD: false, // CHK-5 / D4 (P1, off by default)
    enableHeroVideo: false, // HOME-5 / D2 (P1, off by default)
    enablePincodeEstimate: false, // PDP-10 (P1)
  },

  // Limits
  limits: {
    maxCartQuantityPerVariant: 10,
    guestCartExpiryDays: 30,
    reservationExpiryMinutes: 15,
    maxReviewPhotos: 3,
    maxReviewPhotoSizeMB: 5,
  },
};
