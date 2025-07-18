const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const CustomerSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneVerificationCode: { type: String },
    phoneVerified: { type: Boolean, default: false },
    photoUrl: { type: String }, // S3 URL
    verificationIdPhotoUrls: [{ type: String }], // S3 URLs
    description: { type: String },
    availableChats: { type: Number, default: 0 },
    idVerified: { type: Boolean, default: false }
}, { timestamps: true });

CustomerSchema.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 8);
    next();
});

module.exports = mongoose.model('Customer', CustomerSchema);
