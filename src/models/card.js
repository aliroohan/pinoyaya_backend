const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    babysitterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Babysitter' },
    paymentMethodId: { type: String, required: true }
}, { timestamps: true });


// Custom validation: Only one of customerId or babysitterId must be present
cardSchema.pre('validate', function(next) {
    if ((this.customerId && this.babysitterId) || (!this.customerId && !this.babysitterId)) {
        return next(new Error('Card must have either customerId or babysitterId, but not both.'));
    }
    next();
});

module.exports = mongoose.model('Card', cardSchema); 