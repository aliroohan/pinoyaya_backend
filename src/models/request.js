const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    status: { type: String, required: true, enum: ['pending', 'accepted', 'rejected'] },
    dateTime: { type: Date, default: Date.now},
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    babysitterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Babysitter', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema); 