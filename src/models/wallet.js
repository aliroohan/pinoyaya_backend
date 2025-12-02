const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
    babysitterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Babysitter', required: true },
    balance: { type: Number, default: 0 },
    withdrawn: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Wallet', WalletSchema); 