const paymentModel = require('../models/payment');
const walletModel = require('../models/wallet');
const transactionsService = require('../services/transactions');
const cardModel = require('../models/card');
const stripeService = require('./stripe');

exports.create = async (data) => {
  const payment = new paymentModel(data);
  return await payment.save();
};

exports.getByCustomer = async (customerId) => {
  return await paymentModel.find({ customerId: customerId });
};

exports.getByJob = async (jobId) => {
  return await paymentModel.find({ jobId: jobId });
};

// Create payment automatically when job is completed
exports.createPaymentFromJob = async (job) => {
  try {
    // Check if payment already exists for this job
    const existingPayment = await paymentModel.findOne({ jobId: job._id });
    if (existingPayment) {
      return existingPayment; // Return existing payment to avoid duplicates
    }

    // Validate required fields
    if (!job.babysitterId || !job.customerId || !job.price) {
      throw new Error('Job must have babysitterId, customerId, and price to create payment');
    }

    // Calculate payment breakdown
    const basePrice = job.price - (job.platformFee || 0); // Base price without platform fee
    const serviceCharges = job.platformFee || 0; // Platform service fee
    const transportCharges = 0; // Can be calculated based on location if needed
    const vatRate = 0.12; // 12% VAT (adjust as needed)
    const vat = (basePrice + serviceCharges + transportCharges) * vatRate;
    const total = basePrice + serviceCharges + transportCharges + vat;

    // Create payment record
    const paymentData = {
      transportCharges: transportCharges,
      serviceCharges: serviceCharges,
      vat: vat,
      price: basePrice,
      total: total,
      babysitterId: job.babysitterId,
      customerId: job.customerId,
      jobId: job._id,
      isPaid: false
    };

    const payment = await this.create(paymentData);
    return payment;
  } catch (error) {
    console.error('Error creating payment from job:', error);
    throw error;
  }
};

exports.update = async (id, data) => {
   const payment = await paymentModel.findById(id);
    if (data.isPaid) {
      let wallet = await walletModel.findOne({ babysitterId: payment.babysitterId });
      if (!wallet) {
        wallet = await walletModel.create({ babysitterId: payment.babysitterId, balance: 0 });
      }
      wallet.balance += payment.total;
      await wallet.save();
    }
    return await paymentModel.findByIdAndUpdate(id, data, { new: true });
};

exports.makePayment = async (paymentData) => {
  try {
    const {
      paymentId,
      amount,
      currency = 'usd',
      cardId, // For saved card
      newCardData, // For new card: { number, exp_month, exp_year, cvc }
      saveCard = false, // Whether to save the new card
      customerId,
      babysitterId,
      jobId
    } = paymentData;

    // Get payment details
    const payment = await paymentModel.findById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    let finalPaymentMethodId;
    let savedCardId = null;

    // If using saved card, get the payment method ID
    if (cardId) {
      const savedCard = await cardModel.findById(cardId);
      if (!savedCard) {
        throw new Error('Saved card not found');
      }
      finalPaymentMethodId = savedCard.paymentMethodId;
      savedCardId = cardId;
    }

    // If new card is provided, create payment method first
    if (newCardData) {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      
      // Create payment method for new card
      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: newCardData.number,
          exp_month: newCardData.exp_month,
          exp_year: newCardData.exp_year,
          cvc: newCardData.cvc,
        },
      });

      finalPaymentMethodId = paymentMethod.id;

      // Save card if requested
      if (saveCard) {
        const cardData = {
          paymentMethodId: paymentMethod.id,
          customerId: customerId
        };
        const savedCard = new cardModel(cardData);
        await savedCard.save();
        savedCardId = savedCard._id;
      }
    }

    // Create and confirm payment intent
    const paymentIntent = await stripeService.createAndConfirmPaymentIntent({
      amount: amount,
      currency: currency,
      paymentMethodId: finalPaymentMethodId,
      metadata: {
        paymentId: paymentId,
        customerId: customerId,
        babysitterId: babysitterId,
        jobId: jobId
      }
    });

    // Create transaction record
    const transaction = await transactionsService.createTransaction({
      customerId: customerId,
      babysitterId: babysitterId,
      jobId: jobId,
      paymentId: paymentId,
      cardId: savedCardId, // Reference to saved card (null if not saved)
      amount: amount,
      currency: currency,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      isSuccessful: paymentIntent.status === 'succeeded',
      stripeResponse: paymentIntent,
      errorMessage: paymentIntent.last_payment_error ? paymentIntent.last_payment_error.message : null
    });

    // Update payment status
    if (paymentIntent.status === 'succeeded') {
      payment.isPaid = true;
      payment.transaction = transaction._id;
      await payment.save();

      // Update babysitter wallet
      let wallet = await walletModel.findOne({ babysitterId: babysitterId });
      if (!wallet) {
        wallet = new walletModel({ babysitterId: babysitterId, balance: 0 });
      }
      wallet.balance += amount;
      await wallet.save();
    }

    return {
      success: paymentIntent.status === 'succeeded',
      transaction: transaction,
      paymentIntent: paymentIntent,
      payment: payment
    };

  } catch (error) {
    // Create failed transaction record
    if (paymentData.paymentId) {
      await transactionsService.createTransaction({
        customerId: paymentData.customerId,
        babysitterId: paymentData.babysitterId,
        jobId: paymentData.jobId,
        paymentId: paymentData.paymentId,
        cardId: paymentData.cardId, // Reference to saved card
        amount: paymentData.amount,
        currency: paymentData.currency || 'usd',
        status: 'failed',
        isSuccessful: false,
        errorMessage: error.message
      });
    }

    throw error;
  }
};