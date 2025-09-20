import { stripePromise, createCheckoutSessionData, handleStripeError } from '@/lib/stripe';

export interface PaymentResult {
  success: boolean;
  error?: string;
  sessionId?: string;
}

export class PaymentService {
  /**
   * Redirect to Stripe Checkout for premium upgrade
   */
  static async redirectToCheckout(userEmail?: string): Promise<PaymentResult> {
    try {
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      // Create checkout session data
      const sessionData = createCheckoutSessionData(userEmail);

      // For demo purposes, we'll use Stripe's test mode with a simple redirect
      // In production, you'd create the session on your backend
      const { error } = await stripe.redirectToCheckout({
        mode: sessionData.mode,
        lineItems: sessionData.line_items.map(item => ({
          price: 'price_1234567890', // Replace with your actual Stripe Price ID
          quantity: item.quantity,
        })),
        successUrl: sessionData.success_url,
        cancelUrl: sessionData.cancel_url,
        customerEmail: sessionData.customer_email,
      });

      if (error) {
        console.error('Stripe checkout error:', error);
        return {
          success: false,
          error: handleStripeError(error),
        };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Payment service error:', error);
      return {
        success: false,
        error: error.message || 'Payment initialization failed',
      };
    }
  }

  /**
   * Create a one-time payment session (for backend integration)
   * This would typically call your backend API
   */
  static async createPaymentSession(userEmail?: string): Promise<PaymentResult> {
    try {
      // This would be your backend API call
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail,
          product: 'premium_analysis',
          priceId: 'price_1234567890', // Your Stripe Price ID
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment session');
      }

      const { sessionId } = await response.json();

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        return {
          success: false,
          error: handleStripeError(error),
        };
      }

      return { success: true, sessionId };
    } catch (error: any) {
      console.error('Create payment session error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create payment session',
      };
    }
  }

  /**
   * For demo purposes - simulate a successful payment
   * Remove this in production
   */
  static async simulatePayment(): Promise<PaymentResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo, randomly succeed or fail
    const success = Math.random() > 0.1; // 90% success rate
    
    if (success) {
      return {
        success: true,
        sessionId: 'demo_session_' + Date.now(),
      };
    } else {
      return {
        success: false,
        error: 'Demo payment failed. Please try again.',
      };
    }
  }
}