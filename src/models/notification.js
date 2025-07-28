const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    babysitterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Babysitter' },
    description: { type: String, required: true }
}, { timestamps: true });

// Custom validation: Only one of customerId or babysitterId must be present
notificationSchema.pre('validate', function(next) {
    if ((this.customerId && this.babysitterId) || (!this.customerId && !this.babysitterId)) {
        return next(new Error('Notification must have either customerId or babysitterId, but not both.'));
    }
    next();
});

module.exports = mongoose.model('Notification', notificationSchema); 