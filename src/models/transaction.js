const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    babysitterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Babysitter' },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'BankAccount' },
    amount: { type: Number, required: true },
    isSuccessful: { type: Boolean, default: false },
    time: { type: Date, default: Date.now },
    details: { type: String }, // JSON string
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema); 