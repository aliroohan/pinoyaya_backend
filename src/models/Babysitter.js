const mongoose = require('mongoose');

const BabysitterSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneVerificationCode: { type: String },
    emailVerificationCode: { type: String },
    phoneVerified: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    profession: { type: String, enum: ['Babysitter', 'Tutor', 'HouseKeeper'], required: true },
    photoUrl: { type: String }, // S3 URL
    verificationIdPhotoUrls: [{ type: String }], // S3 URLs
    idVerified: { type: Boolean, default: false },
    description: { type: String },
    rate: { type: Number },
    experience: { type: String },
    skills: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Babysitter', BabysitterSchema); 