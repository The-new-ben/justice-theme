import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

// Initialize Stripe safely
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

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

    // Apply defaults and mapping
    name = name || 'טעינת קרדיטים - פורטל Jus-Tice';
    successUrl = successUrl || 'https://jus-tice.co.il/?mock_success=true';
    cancelUrl = cancelUrl || 'https://jus-tice.co.il/?mock_cancel=true';

    // Map root lawyerId and creditsToAdd to metadata if omitted
    if (!metadata) {
      metadata = {};
    }
    metadata.lawyerId = resolvedLawyerId;
    metadata.creditsToAdd = creditsNum.toString();

    // 1. Fallback for testing: if Stripe keys are missing, return a simulated checkout URL
    if (!stripe) {
      console.warn('Stripe checkout warning: STRIPE_SECRET_KEY is not defined. Using mock redirect URL.');
      
      // We append mock success params to let the front-end simulate webhook completion
      const mockSuccessUrl = new URL(successUrl);
      mockSuccessUrl.searchParams.set('session_id', `mock_session_${Date.now()}`);
      mockSuccessUrl.searchParams.set('mock_amount', amt.toString());
      mockSuccessUrl.searchParams.set('mock_type', metadata?.type || 'credits');
      
      const checkoutSessionUrl = `https://jus-tice.co.il/checkout-session?session_id=mock_session_${Date.now()}&success_url=${encodeURIComponent(mockSuccessUrl.toString())}&lawyerId=${metadata.lawyerId}&creditsToAdd=${metadata.creditsToAdd}`;

      return NextResponse.json({ success: true, url: checkoutSessionUrl, isMock: true });
    }

    // 2. Real Stripe session creation
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'ils',
            product_data: {
              name: name,
              description: metadata?.description || 'Jus-Tice Legal Portal Transaction',
            },
            unit_amount: Math.round(amt * 100), // Stripe expects cents/agorot
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl + '?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: cancelUrl,
      metadata: metadata,
    });

    return NextResponse.json({ success: true, url: session.url, isMock: false });
  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
