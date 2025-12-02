const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    babysitterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Babysitter' },
    title: { type: String },
    house: { type: String },
    area: { type: String },
    directions: { type: String },
    label: { type: String },
    longitude: { type: Number },
    latitude: { type: Number },
    city: { type: String },
    isDefault: { type: Boolean, default: false }
});

locationSchema.pre('validate', function(next) {
    if (!(this.customerId || this.babysitterId)) {
        return next(new Error('Location must have either customerId or babysitterId, but not both.'));
    }
    next();
});

module.exports = mongoose.model('Location', locationSchema); 