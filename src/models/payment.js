const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    transportCharges: { type: Number },
    serviceCharges: { type: Number },
    vat: { type: Number },
    price: { type: Number },
    total: { type: Number },
    babysitterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Babysitter', required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, unique: true },
    transaction: { type: String },
    isPaid: { type: Boolean, default: false }
}, { timestamps: true });

// Ensure unique payment per job
paymentSchema.index({ jobId: 1 }, { unique: true });

module.exports = mongoose.model('Payment', paymentSchema); 