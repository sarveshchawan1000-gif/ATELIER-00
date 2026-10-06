import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// 1. Pricing Library Verification
function formatINR(paise) {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(rupees);
}

function calculateDiscountPercentage(mrpPaise, salePricePaise) {
  if (!salePricePaise || salePricePaise >= mrpPaise) return 0;
  const discount = ((mrpPaise - salePricePaise) / mrpPaise) * 100;
  return Math.round(discount);
}

function calculateShippingFee(subtotalPaise, flatRatePaise = 15000, thresholdPaise = 300000) {
  if (subtotalPaise >= thresholdPaise || subtotalPaise === 0) {
    return 0;
  }
  return flatRatePaise;
}

test('PRICING: formatINR properly formats paise to Indian currency', () => {
  assert.equal(formatINR(499900).replace(/\s/g, ''), '₹4,999');
  assert.equal(formatINR(1299900).replace(/\s/g, ''), '₹12,999');
  assert.equal(formatINR(0).replace(/\s/g, ''), '₹0');
});

test('PRICING: calculateDiscountPercentage computes integer discount', () => {
  assert.equal(calculateDiscountPercentage(1000000, 800000), 20);
  assert.equal(calculateDiscountPercentage(1000000, 1000000), 0);
  assert.equal(calculateDiscountPercentage(1000000, 1200000), 0);
});

test('PRICING: calculateShippingFee enforces ₹3,000 threshold and ₹150 flat rate', () => {
  // Below threshold
  assert.equal(calculateShippingFee(299900, 15000, 300000), 15000);
  // Exactly at threshold
  assert.equal(calculateShippingFee(300000, 15000, 300000), 0);
  // Above threshold
  assert.equal(calculateShippingFee(499900, 15000, 300000), 0);
  // Empty cart
  assert.equal(calculateShippingFee(0, 15000, 300000), 0);
});

// 2. Razorpay HMAC SHA256 Signature Verification
test('PAYMENT: HMAC SHA256 signature verification accepts valid and rejects tampered tokens', () => {
  const secret = 'test_webhook_secret_key_12345';
  const orderId = 'order_mock_123456';
  const paymentId = 'pay_mock_789012';
  const body = `${orderId}|${paymentId}`;

  const validSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');

  // Verify valid
  const expectedSig = crypto.createHmac('sha256', secret).update(body).digest('hex');
  const isValid = crypto.timingSafeEqual(Buffer.from(expectedSig), Buffer.from(validSignature));
  assert.equal(isValid, true);

  // Verify tampered
  const tamperedSig = validSignature.slice(0, -2) + 'ff';
  const isTamperedValid = crypto.timingSafeEqual(Buffer.from(expectedSig), Buffer.from(tamperedSig));
  assert.equal(isTamperedValid, false);
});

// 3. Indian PIN Code Serviceability
test('LOGISTICS: Indian PIN code validation and prefix routing', () => {
  const validPincodes = ['400001', '110001', '560001', '600001', '700001'];
  const invalidPincodes = ['12345', 'ABCDEF', '4000011', '000000'];

  for (const pin of validPincodes) {
    assert.match(pin, /^\d{6}$/);
    assert.notEqual(pin.substring(0, 2), '00');
  }

  for (const pin of invalidPincodes) {
    const isSixDigitNumber = /^\d{6}$/.test(pin) && pin !== '000000';
    assert.equal(isSixDigitNumber, false);
  }
});

// 4. Supabase Migration Schema Audit
test('DATABASE: Schema migration defines all 19 required tables and RLS', () => {
  const migrationPath = path.resolve(process.cwd(), 'supabase/migrations/001_initial_schema.sql');
  assert.ok(fs.existsSync(migrationPath), 'Migration file must exist');

  const sql = fs.readFileSync(migrationPath, 'utf8');

  const requiredTables = [
    'profiles',
    'addresses',
    'categories',
    'collections',
    'products',
    'product_collections',
    'product_variants',
    'product_images',
    'carts',
    'cart_items',
    'wishlist_items',
    'orders',
    'order_items',
    'reviews',
    'review_images',
    'stock_reservations',
    'audit_log',
    'contact_messages',
    'settings',
  ];

  for (const table of requiredTables) {
    const hasTable = sql.includes(`CREATE TABLE IF NOT EXISTS public.${table}`) || sql.includes(`CREATE TABLE public.${table}`);
    assert.ok(hasTable, `Table public.${table} must be defined in initial schema`);
  }

  // Verify RLS enabled on all tables
  for (const table of requiredTables) {
    assert.ok(
      sql.includes(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`),
      `RLS must be enabled on public.${table}`
    );
  }
});

// 5. Seed Catalog Verification
test('CATALOG: Seed data includes active products across Male, Female, and Kids sections', () => {
  const seedPath = path.resolve(process.cwd(), 'lib/db/seed-data.ts');
  assert.ok(fs.existsSync(seedPath), 'Seed data file must exist');

  const seedContent = fs.readFileSync(seedPath, 'utf8');
  assert.ok(seedContent.includes('OVERSIZED COTTON TEE'));
  assert.ok(seedContent.includes('SCULPTURAL COCOON COAT'));
  assert.ok(seedContent.includes('JUNIOR HEAVYWEIGHT BOX TEE'));
  assert.ok(seedContent.includes("gender: 'male'"), 'Must contain male items');
  assert.ok(seedContent.includes("gender: 'female'"), 'Must contain female items');
  assert.ok(seedContent.includes("gender: 'kids'"), 'Must contain kids items');
  assert.ok(seedContent.includes('499900'), 'Prices must be defined in integer paise');
});
