const mongoose = require('mongoose');

const FavouriteSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    babysitterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Babysitter', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Favourite', FavouriteSchema); 