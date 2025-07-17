const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    babysitterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Babysitter', required: true },
    text: { type: String },
    imageUrl: { type: String } // S3 URL
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema); 