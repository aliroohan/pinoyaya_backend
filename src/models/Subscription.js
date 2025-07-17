const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    chats: { type: Number, required: true },
    price: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', SubscriptionSchema); 