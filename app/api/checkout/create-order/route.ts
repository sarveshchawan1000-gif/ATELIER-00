import { NextRequest, NextResponse } from 'next/server';
import { SEED_PRODUCTS } from '@/lib/db/seed-data';
import { CONFIG } from '@/lib/config';
import { calculateShippingFee } from '@/lib/pricing';
import { PaymentAdapter } from '@/lib/adapters/payment';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, customer, address } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!customer?.email || !customer?.phone || !address?.line1 || !address?.city || !address?.pincode) {
      return NextResponse.json({ error: 'Incomplete customer or address details' }, { status: 400 });
    }

    // Recompute total server-side
    let subtotalPaise = 0;
    const orderItems = [];

    for (const item of items) {
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
        return NextResponse.json(
          { error: `Item ${item.variantId} not found in catalog` },
          { status: 400 }
        );
      }

      const availableStock = Math.max(0, foundVariant.stock - foundVariant.reserved_stock);
      if (availableStock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${foundProduct.name} (${foundVariant.size})` },
          { status: 400 }
        );
      }

      const unitPricePaise = foundProduct.sale_price || foundProduct.mrp;
      subtotalPaise += unitPricePaise * item.quantity;

      orderItems.push({
        variantId: foundVariant.id,
        name: foundProduct.name,
        size: foundVariant.size,
        colour: foundVariant.colour,
        unitPricePaise,
        quantity: item.quantity,
      });
    }

    const shippingFeePaise = calculateShippingFee(
      subtotalPaise,
      CONFIG.shipping.flatRatePaise,
      CONFIG.shipping.freeShippingThresholdPaise
    );
    const totalPaise = subtotalPaise + shippingFeePaise;

    const orderNo = `BRD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create Razorpay Order
    const razorpayOrder = await PaymentAdapter.createOrder({
      amountPaise: totalPaise,
      currency: 'INR',
      receiptOrderNo: orderNo,
      notes: {
        customerEmail: customer.email,
        customerPhone: customer.phone,
      },
    });

    return NextResponse.json({
      success: true,
      orderNo,
      razorpayOrderId: razorpayOrder.id,
      amountPaise: totalPaise,
      currency: 'INR',
      subtotalPaise,
      shippingFeePaise,
      items: orderItems,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Order creation failed: ' + err.message },
      { status: 500 }
    );
  }
}
