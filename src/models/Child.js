const mongoose = require('mongoose');

const ChildSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    specialNeeds: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Child', ChildSchema); 