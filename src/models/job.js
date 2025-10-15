const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    babysitterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Babysitter' },
    type: { type: String, required: true },
    title: { type: String, required: true },
    rate: { type: Number },
    detail: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    startTime: { type: String },
    endTime: { type: String },
    status: {type: String, enum: ["available", "completed", "ongoing", "cancelled"], default: "available"},
    experience: { type: String, enum: ['0-2', '3-5', '6+'] },
    vaccination: { type: Boolean },
    liveIn: { type: Boolean },
    childId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Child' }],
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    totalHours: { type: Number },
    price: { type: Number },
    reviewed: { type: Boolean, default: false }
}, { timestamps: true });

jobSchema.pre('save', function(next) {
    if(this.startTime && this.endTime) {
        const days = ((this.endDate - this.startDate) / (1000 * 60 * 60 * 24)) + 1;
        const startTime = new Date(`1970-01-01T${this.startTime}`);
        const endTime = new Date(`1970-01-01T${this.endTime}`);
        this.totalHours = (endTime - startTime) / (1000 * 60 * 60) * days;
        this.price = this.totalHours * this.rate;
    }
    next();
});

module.exports = mongoose.model('Job', jobSchema); 