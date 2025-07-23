const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    babysitterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Babysitter' },
    name: { type: String, required: true },
    number: { type: String, required: true },
    expiry: { type: String, required: true },
    cvv: { type: String, required: true }
}, { timestamps: true });


// Custom validation: Only one of customerId or babysitterId must be present
CardSchema.pre('validate', function(next) {
    if ((this.customerId && this.babysitterId) || (!this.customerId && !this.babysitterId)) {
        return next(new Error('Card must have either customerId or babysitterId, but not both.'));
    }
    next();
});

module.exports = mongoose.model('Card', CardSchema); 