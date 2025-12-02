const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    babysitterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Babysitter', required: true },
    service: { type: Number, required: true },
    communication: { type: Number, required: true },
    recommend: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema); 