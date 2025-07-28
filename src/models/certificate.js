const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    babysitterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Babysitter', required: true },
    type: { type: String, enum: ['Educational', 'Vaccination'], required: true },
    certUrl: { type: String, required: true } // S3 URL
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema); 