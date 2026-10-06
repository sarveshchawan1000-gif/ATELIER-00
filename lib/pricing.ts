/**
 * Money & Pricing Utilities (Paise Integer Calculations)
 * Authority: PRD v2.0 §10.2
 * Money is ALWAYS stored as integer paise (1 INR = 100 paise).
 */

export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(rupees);
}

export function calculateDiscountPercentage(mrpPaise: number, salePricePaise?: number): number {
  if (!salePricePaise || salePricePaise >= mrpPaise) return 0;
  const discount = ((mrpPaise - salePricePaise) / mrpPaise) * 100;
  return Math.round(discount);
}

export function calculateShippingFee(subtotalPaise: number, flatRatePaise: number = 15000, thresholdPaise: number = 300000): number {
  if (subtotalPaise >= thresholdPaise || subtotalPaise === 0) {
    return 0;
  }
  return flatRatePaise;
}
