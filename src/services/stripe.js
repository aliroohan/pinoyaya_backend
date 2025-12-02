const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Create and confirm a Stripe PaymentIntent
 * @param {Object} params - { amount, currency, paymentMethodId, ...metadata }
 * @returns {Object} paymentIntent
 */


exports.createAndConfirmPaymentIntent = async (params) => {
  const { amount, currency = 'usd', paymentMethodId, ...metadata } = params;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Stripe expects amount in cents
    currency,
    payment_method: paymentMethodId,
    confirm: true,
    metadata: { ...metadata },
  });
  return paymentIntent;
};

/**
 * Retrieve a PaymentIntent by ID
 */
exports.retrievePaymentIntent = async (paymentIntentId) => {
  return await stripe.paymentIntents.retrieve(paymentIntentId);
}; 