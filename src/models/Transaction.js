const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    babysitterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Babysitter', required: true },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'BankAccount', required: true },
    amount: { type: Number, required: true },
    isSuccessful: { type: Boolean, default: false },
    time: { type: Date, default: Date.now },
    details: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema); 