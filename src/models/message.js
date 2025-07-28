const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    babysitterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Babysitter', required: true },
    text: { type: String },
    imageUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema); 