import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with publishable key from environment
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.warn('Stripe publishable key not found in environment variables');
}

export const stripePromise = loadStripe(stripePublishableKey || '');

// Stripe configuration
export const STRIPE_CONFIG = {
  currency: 'usd',
  country: 'US',
  premium_price: 2.00, // $2 for premium features
  premium_price_cents: 200, // $2 in cents for Stripe
};

// Premium product configuration
export const PREMIUM_PRODUCT = {
  name: 'ResumeAI Premium Analysis',
  description: 'Unlock advanced resume analysis with industry-specific insights, salary optimization tips, and interview preparation.',
  price: STRIPE_CONFIG.premium_price_cents,
  currency: STRIPE_CONFIG.currency,
  features: [
    'Advanced ATS Analysis (50+ factors)',
    'Industry-Specific Keywords',
    'Salary Optimization Tips',
    'Interview Preparation Guide',
    'Detailed Technical Skills Analysis',
    '100% Complete Resume Score'
  ]
};

// Create checkout session data
export const createCheckoutSessionData = (userEmail?: string) => ({
  mode: 'payment' as const,
  payment_method_types: ['card'],
  line_items: [
    {
      price_data: {
        currency: PREMIUM_PRODUCT.currency,
        product_data: {
          name: PREMIUM_PRODUCT.name,
          description: PREMIUM_PRODUCT.description,
          images: [], // Add product images if needed
        },
        unit_amount: PREMIUM_PRODUCT.price,
      },
      quantity: 1,
    },
  ],
  customer_email: userEmail,
  success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${window.location.origin}/`,
  metadata: {
    product: 'premium_analysis',
    version: '1.0',
  },
});

// Handle Stripe errors
export const handleStripeError = (error: any) => {
  console.error('Stripe error:', error);
  
  let message = 'An unexpected error occurred.';
  
  if (error.type === 'card_error' || error.type === 'validation_error') {
    message = error.message;
  } else if (error.type === 'invalid_request_error') {
    message = 'Invalid payment request. Please try again.';
  } else if (error.type === 'api_connection_error') {
    message = 'Network error. Please check your connection and try again.';
  } else if (error.type === 'api_error') {
    message = 'Payment processing error. Please try again later.';
  } else if (error.type === 'authentication_error') {
    message = 'Payment authentication failed. Please try again.';
  } else if (error.type === 'rate_limit_error') {
    message = 'Too many requests. Please wait a moment and try again.';
  }
  
  return message;
};