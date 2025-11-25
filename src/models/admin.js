const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    name: { type: String, 
        required: true, 
        trim: true 
    },
    email: { type: String, 
        required: true, 
        unique: true 
    },
    phone: { type: String
    },
    password: { 
        type: String, 
    },
    role: {
        type: String,
        enum: ["reports", "financials", "jobReviewer", "admin"],
        required: true,
    }
}, { timestamps: true });

// Hash password before saving
adminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
adminSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema); 