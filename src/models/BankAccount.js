const mongoose = require('mongoose');

const BankAccountSchema = new mongoose.Schema({
    babysitterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Babysitter', required: true },
    accountNumber: { type: String, required: true },
    name: { type: String, required: true },
    ifsc: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('BankAccount', BankAccountSchema); 