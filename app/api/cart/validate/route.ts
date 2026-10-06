import { NextRequest, NextResponse } from 'next/server';
import { SEED_PRODUCTS } from '@/lib/db/seed-data';
import { CONFIG } from '@/lib/config';
import { calculateShippingFee } from '@/lib/pricing';

interface IncomingItem {
  variantId: string;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items: IncomingItem[] = body.items || [];

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid items array' }, { status: 400 });
    }

    const validatedItems = [];
    const unavailableItems = [];
    let subtotalPaise = 0;

    for (const item of items) {
      // Find matching product and variant in authoritative catalog
      let foundProduct = null;
      let foundVariant = null;

      for (const prod of SEED_PRODUCTS) {
        const v = prod.variants.find((variant) => variant.id === item.variantId);
        if (v) {
          foundProduct = prod;
          foundVariant = v;
          break;
        }
      }

      if (!foundProduct || !foundVariant) {
        unavailableItems.push({
          variantId: item.variantId,
          reason: 'Variant not found in current catalog',
        });
        continue;
      }

      const availableStock = Math.max(0, foundVariant.stock - foundVariant.reserved_stock);
      if (availableStock <= 0) {
        unavailableItems.push({
          variantId: item.variantId,
          productName: foundProduct.name,
          reason: 'Item is sold out',
        });
        continue;
      }

      // Enforce max 10 per variant and available stock ceiling
      const clampedQuantity = Math.min(
        Math.max(1, item.quantity),
        CONFIG.limits.maxCartQuantityPerVariant,
        availableStock
      );

      const unitPricePaise = foundProduct.sale_price || foundProduct.mrp;
      const lineTotalPaise = unitPricePaise * clampedQuantity;
      subtotalPaise += lineTotalPaise;

      const primaryImage =
        foundProduct.images.find((img) => img.is_primary) || foundProduct.images[0];

      validatedItems.push({
        variantId: foundVariant.id,
        productId: foundProduct.id,
        productName: foundProduct.name,
        colour: foundVariant.colour,
        size: foundVariant.size,
        sku: foundVariant.sku,
        unitPricePaise,
        quantity: clampedQuantity,
        lineTotalPaise,
        imageUrl: primaryImage?.url || '',
        availableStock,
      });
    }

    const shippingFeePaise = calculateShippingFee(
      subtotalPaise,
      CONFIG.shipping.flatRatePaise,
      CONFIG.shipping.freeShippingThresholdPaise
    );

    const totalPaise = subtotalPaise + shippingFeePaise;

    return NextResponse.json({
      valid: unavailableItems.length === 0,
      items: validatedItems,
      unavailableItems,
      subtotalPaise,
      shippingFeePaise,
      totalPaise,
      freeShippingThresholdPaise: CONFIG.shipping.freeShippingThresholdPaise,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to validate cart: ' + err.message },
      { status: 500 }
    );
  }
}
