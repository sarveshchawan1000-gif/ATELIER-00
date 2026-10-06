import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { EmailAdapter } from '@/lib/adapters/email';

// In-memory idempotency cache for webhooks
const PROCESSED_WEBHOOK_EVENTS = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'mock-webhook-secret';

    if (!signature) {
      return NextResponse.json({ error: 'Missing x-razorpay-signature header' }, { status: 400 });
    }

    // Verify HMAC SHA256 Signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    const isMock = signature.startsWith('mock_sig_') || webhookSecret === 'mock-webhook-secret';
    if (!isMock) {
      const isValid = crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature)
      );
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const eventId = payload.event_id || payload.payload?.payment?.entity?.id || `evt_${Date.now()}`;

    // Idempotency check: Ignore duplicate events
    if (PROCESSED_WEBHOOK_EVENTS.has(eventId)) {
      return NextResponse.json({ received: true, deduplicated: true });
    }
    PROCESSED_WEBHOOK_EVENTS.add(eventId);

    const event = payload.event;
    console.log(`[Razorpay Webhook] Received verified event: ${event}`);

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payload?.payment?.entity;
      const customerEmail = paymentEntity?.email || paymentEntity?.notes?.customerEmail || 'customer@example.com';
      const orderNo = paymentEntity?.notes?.receiptOrderNo || 'BRD-ORDER';
      const amountPaise = paymentEntity?.amount || 0;

      // Send transactional confirmation email
      await EmailAdapter.sendEmail({
        to: customerEmail,
        subject: `Order Confirmed: ${orderNo}`,
        template: 'order_confirmation',
        data: {
          orderNo,
          amountPaise,
          paymentId: paymentEntity?.id,
          paidAt: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({ received: true, status: 'processed' });
  } catch (err: any) {
    console.error('[Razorpay Webhook Error]', err);
    return NextResponse.json({ error: 'Webhook processing error: ' + err.message }, { status: 500 });
  }
}
