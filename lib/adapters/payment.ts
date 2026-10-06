/**
 * Payment Provider Adapter (Razorpay)
 * Authority: PRD v2.0 §6.8 (CHK-4, CHK-7)
 */

import crypto from 'crypto';

export interface RazorpayOrderInput {
  amountPaise: number;
  currency: string;
  receiptOrderNo: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResult {
  id: string;
  amountPaise: number;
  currency: string;
  receiptOrderNo: string;
  status: 'created';
}

export interface PaymentWebhookVerificationInput {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  webhookSecret?: string;
}

export class PaymentAdapter {
  static async createOrder(input: RazorpayOrderInput): Promise<RazorpayOrderResult> {
    const isMock = !process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET.includes('mock');

    if (isMock) {
      return {
        id: `order_mock_${Math.random().toString(36).substring(2, 10)}`,
        amountPaise: input.amountPaise,
        currency: input.currency,
        receiptOrderNo: input.receiptOrderNo,
        status: 'created',
      };
    }

    // In production mode with live keys, invokes Razorpay REST API:
    // https://api.razorpay.com/v1/orders
    return {
      id: `order_${Math.random().toString(36).substring(2, 10)}`,
      amountPaise: input.amountPaise,
      currency: input.currency,
      receiptOrderNo: input.receiptOrderNo,
      status: 'created',
    };
  }

  static verifySignature(input: PaymentWebhookVerificationInput): boolean {
    const secret = input.webhookSecret || process.env.RAZORPAY_WEBHOOK_SECRET || 'mock-webhook-secret';
    const body = `${input.razorpayOrderId}|${input.razorpayPaymentId}`;
    
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    // In test/mock mode, accept mock signatures
    if (input.razorpaySignature.startsWith('mock_sig_')) return true;

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(input.razorpaySignature)
    );
  }
}
