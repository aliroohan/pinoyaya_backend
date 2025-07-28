const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    babysitterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Babysitter', required: true },
    lastMessageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }
}, { timestamps: true });

module.exports = mongoose.model('Chat', ChatSchema); 