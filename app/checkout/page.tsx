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

  const subtotalPaise = getSubtotalPaise();
  const shippingPaise = calculateShippingFee(
    subtotalPaise,
    CONFIG.shipping.flatRatePaise,
    CONFIG.shipping.freeShippingThresholdPaise
  );
  const totalPaise = subtotalPaise + shippingPaise;

  const currentStepIndex = STEPS.indexOf(currentStep);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

  const handlePlaceOrder = () => {
    // In production, this creates Razorpay order and opens gateway
    setOrderPlaced(true);
    clearCart();
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
      <main className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-2xl mx-auto text-center py-20 flex flex-col items-center gap-8">
          <div className="w-20 h-20 border-2 border-cyan bg-cyan/10 flex items-center justify-center">
            <span className="text-3xl">✓</span>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tighter uppercase">
              ORDER CONFIRMED
            </h1>
            <p className="font-display text-sm text-charcoal tracking-wider uppercase">
              ORDER #{Math.random().toString(36).substring(2, 10).toUpperCase()}
            </p>
          </div>
          <p className="font-body text-sm text-charcoal max-w-md">
            Thank you for your order. We&apos;ll send a confirmation email with tracking
            details to <span className="font-bold text-black">{form.email || 'your email'}</span>.
          </p>
          <div className="bg-offwhite border border-grey p-6 w-full max-w-sm">
            <div className="flex items-center gap-2 font-display text-xs tracking-wider uppercase text-charcoal">
              <Truck className="w-4 h-4 text-cyan" />
              Estimated delivery: {CONFIG.shipping.estimatedDays}
            </div>
          </div>
          <Link href="/shop">
            <Button variant="primary" size="lg">CONTINUE SHOPPING</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Steps */}
        <nav className="flex items-center gap-2 mb-8 font-display text-xs tracking-wider uppercase">
          <Link href="/cart" className="text-charcoal hover:text-black transition-colors">
            BAG
          </Link>
          {STEPS.map((step, i) => (
            <React.Fragment key={step}>
              <ChevronRight className="w-3 h-3 text-grey" />
              <button
                onClick={() => i <= currentStepIndex && setCurrentStep(step)}
                className={`transition-colors ${
                  step === currentStep
                    ? 'text-black font-bold border-b-2 border-cyan pb-0.5'
                    : i < currentStepIndex
                    ? 'text-charcoal hover:text-black cursor-pointer'
                    : 'text-grey cursor-default'
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
                <h2 className="font-display text-xl font-bold tracking-wider uppercase border-b border-black pb-3">
                  CONTACT & SHIPPING
                </h2>

                <div className="flex flex-col gap-4">
                  <h3 className="font-display text-xs font-bold tracking-widest text-cyan uppercase">
                    CONTACT DETAILS
                  </h3>
                  <Input
                    name="email"
                    type="email"
                    placeholder="EMAIL ADDRESS *"
                    value={form.email}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="PHONE NUMBER *"
                    value={form.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <h3 className="font-display text-xs font-bold tracking-widest text-cyan uppercase">
                    DELIVERY ADDRESS
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      name="firstName"
                      placeholder="FIRST NAME *"
                      value={form.firstName}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      name="lastName"
                      placeholder="LAST NAME"
                      value={form.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <Input
                    name="address1"
                    placeholder="ADDRESS LINE 1 *"
                    value={form.address1}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="address2"
                    placeholder="ADDRESS LINE 2"
                    value={form.address2}
                    onChange={handleInputChange}
                  />
                  <Input
                    name="landmark"
                    placeholder="LANDMARK (OPTIONAL)"
                    value={form.landmark}
                    onChange={handleInputChange}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      name="city"
                      placeholder="CITY *"
                      value={form.city}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      name="state"
                      placeholder="STATE *"
                      value={form.state}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      name="pincode"
                      placeholder="PINCODE *"
                      value={form.pincode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <Button variant="primary" size="lg" onClick={handleNext} fullWidth>
                  CONTINUE TO SHIPPING
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </Button>
              </div>
            )}

            {/* STEP 2: Shipping Method */}
            {currentStep === 'shipping' && (
              <div className="flex flex-col gap-6">
                <h2 className="font-display text-xl font-bold tracking-wider uppercase border-b border-black pb-3">
                  SHIPPING METHOD
                </h2>

                {/* Address Summary */}
                <div className="bg-offwhite border border-grey p-4 flex justify-between items-start">
                  <div>
                    <p className="font-display text-xs font-bold tracking-wider uppercase mb-1">
                      SHIP TO
                    </p>
                    <p className="font-body text-sm text-charcoal">
                      {form.firstName} {form.lastName}<br />
                      {form.address1}{form.address2 ? `, ${form.address2}` : ''}<br />
                      {form.city}, {form.state} — {form.pincode}
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentStep('information')}
                    className="font-display text-xs tracking-wider text-cyan underline"
                  >
                    CHANGE
                  </button>
                </div>

                {/* Shipping Options */}
                <div className="flex flex-col gap-3">
                  <label className="flex items-center justify-between border-2 border-black bg-offwhite p-4 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-black bg-cyan flex items-center justify-center">
                        <span className="text-black text-xs font-bold">✓</span>
                      </div>
                      <div>
                        <span className="font-display text-xs font-bold tracking-wider uppercase block">
                          STANDARD DELIVERY
                        </span>
                        <span className="font-body text-[11px] text-charcoal">
                          {CONFIG.shipping.estimatedDays}
                        </span>
                      </div>
                    </div>
                    <span className="font-display text-sm font-bold">
                      {shippingPaise === 0 ? 'FREE' : formatINR(shippingPaise)}
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
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    BACK
                  </Button>
                  <Button variant="primary" size="lg" onClick={handleNext} fullWidth>
                    CONTINUE TO PAYMENT
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment */}
            {currentStep === 'payment' && (
              <div className="flex flex-col gap-6">
                <h2 className="font-display text-xl font-bold tracking-wider uppercase border-b border-black pb-3">
                  PAYMENT
                </h2>

                <div className="bg-offwhite border border-grey p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="w-5 h-5 text-cyan" />
                    <span className="font-display text-xs font-bold tracking-wider uppercase">
                      SECURE PAYMENT VIA RAZORPAY
                    </span>
                  </div>
                  <p className="font-body text-sm text-charcoal mb-6">
                    You will be redirected to Razorpay&apos;s secure gateway to complete your payment.
                    We support UPI, Credit/Debit Cards, Net Banking, and Wallets.
                  </p>

                  <div className="flex items-center gap-4 border-t border-grey pt-4">
                    <div className="flex items-center gap-2 font-display text-[10px] tracking-wider text-charcoal uppercase">
                      <CreditCard className="w-4 h-4" />
                      Cards
                    </div>
                    <span className="font-display text-[10px] tracking-wider text-charcoal uppercase">UPI</span>
                    <span className="font-display text-[10px] tracking-wider text-charcoal uppercase">Net Banking</span>
                    <span className="font-display text-[10px] tracking-wider text-charcoal uppercase">Wallets</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => setCurrentStep('shipping')}
                    className="flex-shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    BACK
                  </Button>
                  <Button variant="primary" size="lg" onClick={handlePlaceOrder} fullWidth>
                    PAY {formatINR(totalPaise)}
                  </Button>
                </div>
              </div>
            )}

            {/* Security Info */}
            <div className="mt-8 flex items-center gap-2 text-xs text-charcoal font-body">
              <ShieldCheck className="w-4 h-4 text-cyan flex-shrink-0" />
              <span>All transactions are encrypted and processed securely via Razorpay PCI-DSS certified infrastructure.</span>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-offwhite border-2 border-black p-6 sticky top-24">
              <h2 className="font-display text-sm font-bold tracking-wider uppercase border-b border-black pb-3 mb-4">
                ORDER SUMMARY [{items.length}]
              </h2>

              <div className="flex flex-col gap-4 max-h-64 overflow-y-auto mb-4 pr-1">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-3">
                    <div className="w-16 h-20 bg-grey/20 border border-grey flex-shrink-0 relative overflow-hidden">
                      {item.imageUrl && item.imageUrl.startsWith('http') ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[9px] text-charcoal">
                          IMG
                        </div>
                      )}
                      <span className="absolute -top-0.5 -right-0.5 bg-black text-cream font-display text-[9px] w-5 h-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="font-display text-[11px] font-bold tracking-wider uppercase line-clamp-1">
                          {item.productName}
                        </p>
                        <p className="font-body text-[10px] text-charcoal uppercase">
                          {item.colour} / {item.size}
                        </p>
                      </div>
                      <p className="font-display text-xs font-bold">
                        {formatINR(item.unitPricePaise * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-grey pt-3 flex flex-col gap-2">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-charcoal">Subtotal</span>
                  <span className="font-bold">{formatINR(subtotalPaise)}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-charcoal">Shipping</span>
                  <span className="font-bold">
                    {shippingPaise === 0 ? 'FREE' : formatINR(shippingPaise)}
                  </span>
                </div>
                <div className="flex justify-between font-display text-base font-bold uppercase border-t border-black pt-3 mt-1">
                  <span>TOTAL</span>
                  <span>{formatINR(totalPaise)}</span>
                </div>
                <p className="font-body text-[10px] text-charcoal">
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
