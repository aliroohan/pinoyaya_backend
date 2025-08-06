const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    babysitterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Babysitter' },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
    cardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Card' }, // Reference to saved card
    amount: { type: Number, required: true },
    currency: { type: String, default: 'usd' },
    paymentIntentId: { type: String }, // Stripe payment intent ID
    status: { 
        type: String, 
        enum: ['pending', 'succeeded', 'failed', 'canceled'],
        default: 'pending'
    },
    isSuccessful: { type: Boolean, default: false },
    stripeResponse: { type: mongoose.Schema.Types.Mixed }, // Store full Stripe response
    errorMessage: { type: String },
    time: { type: Date, default: Date.now },
    details: { type: String }, // JSON string for additional details
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema); 