const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    name: { type: String, required: true },
    breed: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Pet', PetSchema); 