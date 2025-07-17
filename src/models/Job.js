const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    babysitterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Babysitter', required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    rate: { type: Number },
    detail: { type: String },
    start: { type: Date },
    end: { type: Date },
    status: { type: String },
    education: { type: Boolean },
    vaccination: { type: Boolean },
    childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Child' },
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
    totalHours: { type: Number },
    price: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema); 