const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    babysitterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Babysitter' },
    type: { type: String, required: true },
    title: { type: String, required: true },
    rate: { type: Number },
    isFulltime: { type: Boolean, default: false },
    detail: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    startTime: { type: String },
    endTime: { type: String },
    status: {type: String, enum: ["available", "completed", "ongoing", "cancelled", "waiting"], default: "available"},
    experience: { type: String, enum: ['0-2', '3-5', '6+'] },
    vaccination: { type: String, enum: ['yes', 'mandatory', 'na'] },
    liveIn: { type: Boolean },
    childId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Child' }],
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    totalHours: { type: Number },
    price: { type: Number },
    reviewed: { type: Boolean, default: false },
    platformFee: { type: Number, default: 100 }, // Platform service fee
    babysitterEarning: { type: Number }, // Amount babysitter earns (price - platformFee)
}, { timestamps: true });

jobSchema.pre('save', async function(next) {
    try {
        // Fetch rate from babysitter if not present
        if (!this.rate && this.babysitterId) {
            const Babysitter = mongoose.model('Babysitter');
            const babysitter = await Babysitter.findById(this.babysitterId);
            if (babysitter && babysitter.rate) {
                this.rate = babysitter.rate;
            }
        }

        // For fulltime jobs - update dates and calculate based on actual work period
        if(this.isFulltime) {
            // When status changes to 'ongoing', set startDate to now
            if(this.isModified('status') && this.status === 'ongoing' && !this.startDate) {
                this.startDate = new Date();
            }
            
            // When status changes to 'completed', set endDate to now and calculate price
            if(this.isModified('status') && this.status === 'completed' && this.startDate) {
                this.endDate = new Date();
                // Calculate days between start and end
                const days = Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
                // 8 hours per day for fulltime
                this.totalHours = days * 8;
                this.price = (this.totalHours * this.rate) + this.platformFee;
                this.babysitterEarning = this.price - this.platformFee;
            }
        }
        

        // For part-time jobs with specific time slots
        if(!this.isFulltime && this.startTime && this.endTime && this.startDate && this.endDate) {
            const days = ((this.endDate - this.startDate) / (1000 * 60 * 60 * 24)) + 1;
            const startTime = new Date(`1970-01-01T${this.startTime}`);
            const endTime = new Date(`1970-01-01T${this.endTime}`);
            this.totalHours = (endTime - startTime) / (1000 * 60 * 60) * days;
            this.price = (this.totalHours * this.rate) + this.platformFee;
            this.babysitterEarning = this.price - this.platformFee;
        }

        // Update customer spending and babysitter earnings when job is completed
        if(this.isModified('status') && this.status === 'completed' && this.price) {
            const Customer = mongoose.model('Customer');
            const Babysitter = mongoose.model('Babysitter');
            const paymentsService = require('../services/payments');

            // Update customer's total spending
            await Customer.findByIdAndUpdate(
                this.customerId,
                { $inc: { totalSpending: this.price } }
            );

            // Update babysitter's total earnings
            if(this.babysitterId) {
                await Babysitter.findByIdAndUpdate(
                    this.babysitterId,
                    { $inc: { totalEarnings: this.babysitterEarning } }
                );
            }

            // Create payment automatically when job is completed
            if(this.babysitterId && this.customerId) {
                try {
                    await paymentsService.createPaymentFromJob(this);
                } catch (error) {
                    console.error('Error creating payment for completed job:', error);
                    // Don't fail the job save if payment creation fails
                }
            }
        }

        next();
    } catch(error) {
        next(error);
    }
});

module.exports = mongoose.model('Job', jobSchema); 