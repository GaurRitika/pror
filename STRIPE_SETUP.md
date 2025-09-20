# Stripe Integration Setup Guide

## 🚀 Quick Setup

### 1. Get Your Stripe Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your **Publishable Key** and **Secret Key**
3. For testing, use the **Test Keys** (they start with `pk_test_` and `sk_test_`)

### 2. Configure Environment Variables
Update your `.env` file with your actual Stripe keys:

```env
# Replace with your actual Stripe keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

### 3. Create a Stripe Product and Price
1. Go to [Stripe Products](https://dashboard.stripe.com/products)
2. Click "Add Product"
3. Set:
   - **Name**: "ResumeAI Premium Analysis"
   - **Description**: "Unlock advanced resume analysis features"
   - **Price**: $2.00 USD
   - **Type**: One-time payment
4. Copy the **Price ID** (starts with `price_`)

### 4. Update Payment Service
In `/src/services/payment.ts`, replace the demo code:

```typescript
// Replace this line:
const result = await PaymentService.simulatePayment();

// With this:
const result = await PaymentService.redirectToCheckout(userEmail);
```

Also update the Price ID in the service:

```typescript
price: 'price_your_actual_price_id_here', // Replace with your Price ID
```

## 🛠️ Backend Integration (Recommended)

For production, set up a backend endpoint to create checkout sessions securely.

### Example Backend Setup (Node.js/Express)

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: 'price_your_actual_price_id_here',
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/`,
      customer_email: req.body.userEmail,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Update Frontend Service

```typescript
// In PaymentService.createPaymentSession()
const response = await fetch('/api/create-checkout-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userEmail }),
});

const { sessionId } = await response.json();
const { error } = await stripe.redirectToCheckout({ sessionId });
```

## 🧪 Testing

### Test Cards
Use these test card numbers in Stripe test mode:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

### Test Flow
1. Upload a resume and analyze it
2. Click "Upgrade to Premium" 
3. Use a test card number
4. Complete the payment
5. You should be redirected to the success page

## 🔒 Security Notes

1. **Never expose your Secret Key** in frontend code
2. **Always validate payments** on your backend
3. **Use webhooks** to handle payment confirmations
4. **Store user premium status** in your database

## 📚 Additional Resources

- [Stripe Checkout Documentation](https://stripe.com/docs/checkout)
- [Stripe React Integration](https://stripe.com/docs/stripe-js/react)
- [Webhook Setup](https://stripe.com/docs/webhooks)
- [Test Cards](https://stripe.com/docs/testing#cards)

## 🚨 Current Status

The app is currently in **demo mode** with simulated payments. To enable real payments:

1. Add your Stripe keys to `.env`
2. Replace `simulatePayment()` with `redirectToCheckout()`
3. Set up your backend endpoint (optional but recommended)
4. Test with Stripe test cards

## 💡 Pro Tips

- Start with Stripe test mode
- Set up webhooks for payment confirmations
- Consider adding subscription billing for recurring revenue
- Add payment method saving for returning customers
- Implement proper error handling and retry logic