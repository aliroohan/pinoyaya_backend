const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    status: { type: String, required: true },
    DateTime: { type: Date, default: Date.now},
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    babysitterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Babysitter', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Request', RequestSchema); 