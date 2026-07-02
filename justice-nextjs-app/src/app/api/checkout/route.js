import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    let { amount, name, metadata, successUrl, cancelUrl, lawyerId, creditsToAdd } = body;

    // 1. Strict validation for lawyerId
    const resolvedLawyerId = lawyerId || (metadata && metadata.lawyerId);
    if (!resolvedLawyerId || typeof resolvedLawyerId !== 'string' || resolvedLawyerId.trim() === '') {
      return NextResponse.json({ error: 'lawyerId is required and must be a non-empty string' }, { status: 400 });
    }

    // 2. Validate amount is a positive number
    if (amount === undefined || amount === null || typeof amount === 'boolean' || isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json({ error: 'amount must be a positive number' }, { status: 400 });
    }
    const amt = Number(amount);

    // 3. Validate creditsToAdd is a positive number
    const rawCredits = (metadata && metadata.creditsToAdd) !== undefined ? metadata.creditsToAdd : creditsToAdd;
    if (rawCredits === undefined || rawCredits === null || typeof rawCredits === 'boolean' || isNaN(Number(rawCredits)) || Number(rawCredits) <= 0) {
      return NextResponse.json({ error: 'creditsToAdd must be a positive number' }, { status: 400 });
    }
    const creditsNum = Number(rawCredits);

    // Map root lawyerId and creditsToAdd to metadata if omitted
    if (!metadata) {
      metadata = {};
    }
    metadata.lawyerId = resolvedLawyerId;
    metadata.creditsToAdd = creditsNum.toString();

    // Redirect to the real WordPress WooCommerce checkout page.
    // The query parameters can be picked up by WooCommerce or Meshulam gateway logic.
    const checkoutSessionUrl = `https://jus-tice.co.il/checkout/?amount=${amt}&lawyerId=${encodeURIComponent(metadata.lawyerId)}&creditsToAdd=${encodeURIComponent(metadata.creditsToAdd)}`;

    return NextResponse.json({ success: true, url: checkoutSessionUrl, isMock: false });
  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
