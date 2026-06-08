import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || request.headers.get('x-stripe-signature') || '';

    let eventPayload;
    try {
      eventPayload = JSON.parse(body);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Validate event structure
    if (!eventPayload || !eventPayload.type) {
      return NextResponse.json({ error: 'Missing event type' }, { status: 400 });
    }

    const isSensitive = eventPayload.type === 'checkout.session.completed';
    const hasSignature = !!signature;

    let event;

    // Enforce signature verification if event is sensitive or signature header is provided
    if (isSensitive || hasSignature) {
      if (!signature) {
        return NextResponse.json({ error: 'Missing signature header' }, { status: 401 });
      }

      if (stripe && webhookSecret) {
        try {
          event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err) {
          console.error('Webhook signature verification failed:', err.message);
          return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }
      } else {
        // Local simulation / testing mode
        if (signature !== 'mock_signature') {
          return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }
        console.warn('Webhook warning: Stripe secrets not configured. Processing raw payload with signature.');
        event = eventPayload;
      }
    } else {
      // Non-sensitive events with no signature provided (e.g. charge.refunded in E2E tests)
      event = eventPayload;
    }

    if (!event.data || !event.data.object) {
      return NextResponse.json({ error: 'Missing event data object' }, { status: 400 });
    }

    // Process checkout session completion
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const metadata = session.metadata || {};
      const amount = session.amount_total / 100; // back to ILS

      console.log('Successfully completed checkout session:', session.id, 'Metadata:', metadata);

      // Perform database operations if Supabase is connected
      if (supabase) {
        if (metadata.type === 'credits' && metadata.lawyerId) {
          // Add credits to lawyer's account in Supabase
          const { data, error } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', metadata.lawyerId)
            .single();

          if (!error && data) {
            const newCredits = (data.credits || 0) + Number(metadata.amount || amount);
            await supabase
              .from('profiles')
              .update({ credits: newCredits })
              .eq('id', metadata.lawyerId);
            console.log(`Updated credits for lawyer ${metadata.lawyerId} to ${newCredits}`);
          }
        } else if (metadata.type === 'document_review' && metadata.leadId) {
          // Mark lead as paid and ready for routing
          await supabase
            .from('leads')
            .update({ payment_status: 'paid', lead_status: 'routable' })
            .eq('id', metadata.leadId);
          console.log(`Marked lead ${metadata.leadId} as paid`);
        }
      } else {
        console.warn('Supabase is offline during webhook execution. Cannot persist transactions.');
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
