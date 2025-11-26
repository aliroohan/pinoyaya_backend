const mongoose = require('mongoose');

const babysitterSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    emailVerificationCode: { type: String },
    emailVerified: { type: Boolean, default: false },
    profession: { type: String, enum: ['Babysitter', 'Tutor', 'HouseKeeper'] },
    photoUrl: { type: String }, // S3 URL
    verificationIdPhotoUrls: [{ type: String }], // S3 URLs
    idVerified: { type: Boolean, default: false },
    description: { type: String },
    rate: { type: Number },
    experience: { type: String },
    skills: [{ type: String }],
    isOnline: { type: Boolean, default: false },
    isBlocked: {type: Boolean, default: false},
    totalEarnings: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Babysitter', babysitterSchema); 