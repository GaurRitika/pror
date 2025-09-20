// Example backend API endpoint for Stripe Checkout Session
// This would typically be in your backend (Node.js, Python, etc.)

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  try {
    const { userEmail, product, priceId } = req.body;

    // Create Checkout Sessions from body params
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // Your Stripe Price ID (e.g., 'price_1234567890')
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/`,
      customer_email: userEmail,
      metadata: {
        product: product,
        user_email: userEmail,
        timestamp: new Date().toISOString(),
      },
      // Optional: Add automatic tax calculation
      automatic_tax: { enabled: true },
      // Optional: Add billing address collection
      billing_address_collection: 'required',
    });

    res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ 
      error: {
        message: err.message,
        type: err.type,
      }
    });
  }
}

// Example usage in your frontend:
/*
const response = await fetch('/api/create-checkout-session', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userEmail: 'user@example.com',
    product: 'premium_analysis',
    priceId: 'price_1234567890', // Your actual Stripe Price ID
  }),
});

const { sessionId } = await response.json();

const stripe = await stripePromise;
const { error } = await stripe.redirectToCheckout({ sessionId });
*/