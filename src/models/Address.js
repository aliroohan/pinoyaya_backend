const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    babysitterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Babysitter' },
    title: { type: String },
    house: { type: String },
    area: { type: String },
    directions: { type: String },
    label: { type: String },
    longitude: { type: Number },
    latitude: { type: Number },
    isDefault: { type: Boolean, default: false }
}, { timestamps: true });

// Custom validation: Only one of customerId or babysitterId must be present
AddressSchema.pre('validate', function(next) {
    if ((this.customerId && this.babysitterId) || (!this.customerId && !this.babysitterId)) {
        return next(new Error('Address must have either customerId or babysitterId, but not both.'));
    }
    next();
});

module.exports = mongoose.model('Address', AddressSchema); 