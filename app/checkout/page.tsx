'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/cart-store';
import { formatINR, calculateShippingFee } from '@/lib/pricing';
import { CONFIG } from '@/lib/config';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { ArrowLeft, ShieldCheck, Truck, Lock, CreditCard, ChevronRight } from 'lucide-react';

type CheckoutStep = 'information' | 'shipping' | 'payment';

const STEP_LABELS: Record<CheckoutStep, string> = {
  information: 'INFORMATION',
  shipping: 'SHIPPING',
  payment: 'PAYMENT',
};

const STEPS: CheckoutStep[] = ['information', 'shipping', 'payment'];

export default function CheckoutPage() {
  const { items, getSubtotalPaise, clearCart } = useCartStore();
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('information');
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Form state
  const [form, setForm] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [confirmedOrderNo, setConfirmedOrderNo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotalPaise = getSubtotalPaise();
  const shippingPaise = calculateShippingFee(
    subtotalPaise,
    CONFIG.shipping.flatRatePaise,
    CONFIG.shipping.freeShippingThresholdPaise
  );
  const totalPaise = subtotalPaise + shippingPaise;

  const currentStepIndex = STEPS.indexOf(currentStep);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);

    // Auto-lookup city/state when 6-digit PIN code entered
    if (name === 'pincode' && value.trim().length === 6 && /^\d{6}$/.test(value.trim())) {
      try {
        const res = await fetch(`/api/pincode/lookup?pincode=${encodeURIComponent(value.trim())}`);
        if (res.ok) {
          const data = await res.json();
          if (data.city && data.state) {
            setForm((prev) => ({
              ...prev,
              city: prev.city || data.city,
              state: prev.state || data.state,
            }));
            showToast(`DELIVERY AVAILABLE IN ${data.city.toUpperCase()}`);
          }
        }
      } catch {
        // Fallback silently if lookup fails
      }
    }
  };

  const handleNext = () => {
    if (currentStep === 'information') {
      if (!form.email || !form.phone || !form.firstName || !form.address1 || !form.city || !form.state || !form.pincode) {
        showToast('PLEASE FILL ALL REQUIRED FIELDS');
        return;
      }
      setCurrentStep('shipping');
    } else if (currentStep === 'shipping') {
      setCurrentStep('payment');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setIsSubmitting(true);
      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
          customer: {
            email: form.email,
            phone: form.phone,
            name: `${form.firstName} ${form.lastName}`.trim(),
          },
          address: {
            line1: form.address1,
            line2: form.address2,
            landmark: form.landmark,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'ORDER CREATION FAILED');
        setIsSubmitting(false);
        return;
      }

      setConfirmedOrderNo(data.orderNo);
      setOrderPlaced(true);
      clearCart();
    } catch {
      showToast('FAILED TO COMMUNICATE WITH CHECKOUT SERVER');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <main className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-2xl mx-auto text-center py-20 flex flex-col items-center gap-6">
          <h1 className="font-display text-3xl font-bold tracking-tighter uppercase">
            YOUR BAG IS EMPTY
          </h1>
          <p className="font-body text-sm text-charcoal">
            Add items to your bag before checking out.
          </p>
          <Link href="/shop">
            <Button variant="primary" size="lg">SHOP NOW</Button>
          </Link>
        </div>
      </main>
    );
  }

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-[#FAFAF8] pt-24 md:pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-2xl mx-auto text-center py-20 flex flex-col items-center gap-8">
          <div className="w-16 h-16 rounded-full bg-[#111] text-white flex items-center justify-center">
            <span className="text-2xl">✓</span>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-[#111]">
              Order Confirmed
            </h1>
            <p className="text-xs text-[#6B6B6B] tracking-wider uppercase">
              Order #{confirmedOrderNo || 'BRD-2026-CONFIRMED'}
            </p>
          </div>
          <p className="text-sm text-[#6B6B6B] max-w-md">
            Thank you for your order. We&apos;ll send a confirmation email with tracking
            details to <span className="font-medium text-[#111]">{form.email || 'your email'}</span>.
          </p>
          <div className="bg-white border border-[#E8E6E1] p-5 w-full max-w-sm rounded-sm">
            <div className="flex items-center justify-center gap-2 text-xs text-[#6B6B6B]">
              <Truck className="w-4 h-4 stroke-[1.5]" />
              Estimated delivery: {CONFIG.shipping.estimatedDays}
            </div>
          </div>
          <Link href="/shop">
            <Button variant="primary" size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAF8] pt-24 md:pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Steps */}
        <nav className="flex items-center gap-2 mb-8 text-xs text-[#6B6B6B]">
          <Link href="/cart" className="hover:text-[#111] transition-colors">
            Bag
          </Link>
          {STEPS.map((step, i) => (
            <React.Fragment key={step}>
              <ChevronRight className="w-3 h-3 text-[#6B6B6B] stroke-[1.5]" />
              <button
                onClick={() => i <= currentStepIndex && setCurrentStep(step)}
                className={`transition-colors ${
                  step === currentStep
                    ? 'text-[#111] font-medium border-b border-[#111] pb-0.5'
                    : i < currentStepIndex
                    ? 'text-[#6B6B6B] hover:text-[#111] cursor-pointer'
                    : 'text-[#6B6B6B]/50 cursor-default'
                }`}
                disabled={i > currentStepIndex}
              >
                {STEP_LABELS[step]}
              </button>
            </React.Fragment>
          ))}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Form Column */}
          <div className="lg:col-span-7">
            {/* STEP 1: Information */}
            {currentStep === 'information' && (
              <div className="flex flex-col gap-6">
                <h2 className="text-xl font-medium text-[#111] border-b border-[#E8E6E1] pb-3">
                  Contact & Shipping
                </h2>

                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-medium text-[#111]">
                    Contact details
                  </h3>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email address *"
                    value={form.email}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="Phone number *"
                    value={form.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-medium text-[#111]">
                    Delivery address
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      name="firstName"
                      placeholder="First name *"
                      value={form.firstName}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      name="lastName"
                      placeholder="Last name"
                      value={form.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <Input
                    name="address1"
                    placeholder="Address line 1 *"
                    value={form.address1}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="address2"
                    placeholder="Address line 2"
                    value={form.address2}
                    onChange={handleInputChange}
                  />
                  <Input
                    name="landmark"
                    placeholder="Landmark (optional)"
                    value={form.landmark}
                    onChange={handleInputChange}
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      name="city"
                      placeholder="City *"
                      value={form.city}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      name="state"
                      placeholder="State *"
                      value={form.state}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      name="pincode"
                      placeholder="PIN code *"
                      value={form.pincode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <Button variant="primary" size="lg" onClick={handleNext} fullWidth>
                  Continue to Shipping
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180 stroke-[1.5]" />
                </Button>
              </div>
            )}

            {/* STEP 2: Shipping Method */}
            {currentStep === 'shipping' && (
              <div className="flex flex-col gap-6">
                <h2 className="text-xl font-medium text-[#111] border-b border-[#E8E6E1] pb-3">
                  Shipping Method
                </h2>

                {/* Address Summary */}
                <div className="bg-white border border-[#E8E6E1] p-4 flex justify-between items-start rounded-sm">
                  <div>
                    <p className="text-xs font-medium text-[#111] mb-1">
                      Ship to
                    </p>
                    <p className="text-xs text-[#6B6B6B]">
                      {form.firstName} {form.lastName}<br />
                      {form.address1}{form.address2 ? `, ${form.address2}` : ''}<br />
                      {form.city}, {form.state} — {form.pincode}
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentStep('information')}
                    className="text-xs text-[#111] underline underline-offset-4 hover:text-[#6B6B6B]"
                  >
                    Change
                  </button>
                </div>

                {/* Shipping Options */}
                <div className="flex flex-col gap-3">
                  <label className="flex items-center justify-between border border-[#E8E6E1] bg-white p-4 cursor-pointer rounded-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border border-[#111] bg-[#111] flex items-center justify-center">
                        <span className="text-white text-[10px]">✓</span>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-[#111] block">
                          Standard Delivery
                        </span>
                        <span className="text-[11px] text-[#6B6B6B]">
                          {CONFIG.shipping.estimatedDays}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-[#111]">
                      {shippingPaise === 0 ? 'Free' : formatINR(shippingPaise)}
                    </span>
                  </label>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => setCurrentStep('information')}
                    className="flex-shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2 stroke-[1.5]" />
                    Back
                  </Button>
                  <Button variant="primary" size="lg" onClick={handleNext} fullWidth>
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment */}
            {currentStep === 'payment' && (
              <div className="flex flex-col gap-6">
                <h2 className="text-xl font-medium text-[#111] border-b border-[#E8E6E1] pb-3">
                  Payment
                </h2>

                <div className="bg-white border border-[#E8E6E1] p-6 rounded-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="w-4 h-4 text-[#111] stroke-[1.5]" />
                    <span className="text-xs font-medium text-[#111]">
                      Secure payment via Razorpay
                    </span>
                  </div>
                  <p className="text-xs text-[#6B6B6B] mb-6">
                    You will be redirected to Razorpay&apos;s secure gateway to complete your payment.
                    We support UPI, Credit/Debit Cards, Net Banking, and Wallets.
                  </p>

                  <div className="flex items-center gap-4 border-t border-[#E8E6E1] pt-4">
                    <div className="flex items-center gap-2 text-[11px] text-[#6B6B6B]">
                      <CreditCard className="w-4 h-4 stroke-[1.5]" />
                      Cards
                    </div>
                    <span className="text-[11px] text-[#6B6B6B]">UPI</span>
                    <span className="text-[11px] text-[#6B6B6B]">Net Banking</span>
                    <span className="text-[11px] text-[#6B6B6B]">Wallets</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => setCurrentStep('shipping')}
                    className="flex-shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2 stroke-[1.5]" />
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handlePlaceOrder}
                    fullWidth
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : `Pay ${formatINR(totalPaise)}`}
                  </Button>
                </div>
              </div>
            )}

            {/* Security Info */}
            <div className="mt-8 flex items-center gap-2 text-xs text-[#6B6B6B]">
              <ShieldCheck className="w-4 h-4 stroke-[1.5] flex-shrink-0" />
              <span>All transactions are encrypted and processed securely via Razorpay PCI-DSS certified infrastructure.</span>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[#E8E6E1] p-6 sticky top-28 rounded-sm">
              <h2 className="text-base font-medium text-[#111] border-b border-[#E8E6E1] pb-3 mb-4">
                Order Summary ({items.length})
              </h2>

              <div className="flex flex-col gap-4 max-h-64 overflow-y-auto mb-4 pr-1">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-3">
                    <div className="w-14 h-18 bg-[#F3F2EF] flex-shrink-0 relative overflow-hidden rounded-sm">
                      {item.imageUrl && item.imageUrl.startsWith('http') ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[9px] text-[#6B6B6B]">
                          3:4
                        </div>
                      )}
                      <span className="absolute -top-0.5 -right-0.5 bg-[#111] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-medium text-[#111] line-clamp-1">
                          {item.productName}
                        </p>
                        <p className="text-[11px] text-[#6B6B6B]">
                          {item.colour} / {item.size}
                        </p>
                      </div>
                      <p className="text-xs font-medium text-[#111]">
                        {formatINR(item.unitPricePaise * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#E8E6E1] pt-3 flex flex-col gap-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B6B6B]">Subtotal</span>
                  <span className="font-medium text-[#111]">{formatINR(subtotalPaise)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B6B6B]">Shipping</span>
                  <span className="font-medium text-[#111]">
                    {shippingPaise === 0 ? 'Free' : formatINR(shippingPaise)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-medium text-[#111] border-t border-[#E8E6E1] pt-3 mt-1">
                  <span>Total</span>
                  <span>{formatINR(totalPaise)}</span>
                </div>
                <p className="text-[10px] text-[#6B6B6B]">
                  {CONFIG.taxes.gstInclusiveNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
