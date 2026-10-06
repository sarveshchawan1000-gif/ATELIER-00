import { NextRequest, NextResponse } from 'next/server';

// Known Indian Metro / State Pincode Prefixes for fast offline auto-fill
const PINCODE_PREFIX_MAP: Record<string, { city: string; state: string; isServiceable: boolean; estimatedDays: string }> = {
  '11': { city: 'New Delhi', state: 'Delhi', isServiceable: true, estimatedDays: '2-3 business days' },
  '12': { city: 'Gurugram / Faridabad', state: 'Haryana', isServiceable: true, estimatedDays: '2-3 business days' },
  '20': { city: 'Noida / Ghaziabad', state: 'Uttar Pradesh', isServiceable: true, estimatedDays: '2-3 business days' },
  '40': { city: 'Mumbai', state: 'Maharashtra', isServiceable: true, estimatedDays: '1-2 business days' },
  '41': { city: 'Pune', state: 'Maharashtra', isServiceable: true, estimatedDays: '2-3 business days' },
  '50': { city: 'Hyderabad', state: 'Telangana', isServiceable: true, estimatedDays: '2-3 business days' },
  '56': { city: 'Bengaluru', state: 'Karnataka', isServiceable: true, estimatedDays: '2-3 business days' },
  '60': { city: 'Chennai', state: 'Tamil Nadu', isServiceable: true, estimatedDays: '2-3 business days' },
  '70': { city: 'Kolkata', state: 'West Bengal', isServiceable: true, estimatedDays: '3-4 business days' },
  '38': { city: 'Ahmedabad', state: 'Gujarat', isServiceable: true, estimatedDays: '2-3 business days' },
  '30': { city: 'Jaipur', state: 'Rajasthan', isServiceable: true, estimatedDays: '2-3 business days' },
  '68': { city: 'Kochi', state: 'Kerala', isServiceable: true, estimatedDays: '3-4 business days' },
  '44': { city: 'Nagpur', state: 'Maharashtra', isServiceable: true, estimatedDays: '3-4 business days' },
  '45': { city: 'Indore', state: 'Madhya Pradesh', isServiceable: true, estimatedDays: '3-4 business days' },
  '14': { city: 'Chandigarh / Ludhiana', state: 'Punjab', isServiceable: true, estimatedDays: '2-3 business days' },
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pincode = searchParams.get('pincode')?.trim();

  if (!pincode || !/^\d{6}$/.test(pincode)) {
    return NextResponse.json(
      { error: 'A valid 6-digit Indian PIN code is required' },
      { status: 400 }
    );
  }

  const prefix = pincode.substring(0, 2);
  const match = PINCODE_PREFIX_MAP[prefix];

  if (match) {
    return NextResponse.json({
      pincode,
      city: match.city,
      state: match.state,
      isServiceable: match.isServiceable,
      estimatedDays: match.estimatedDays,
    });
  }

  // Fallback for all other valid 6-digit Indian PIN codes
  return NextResponse.json({
    pincode,
    city: 'Tier-2/3 District',
    state: 'India',
    isServiceable: true,
    estimatedDays: '4-5 business days',
  });
}
