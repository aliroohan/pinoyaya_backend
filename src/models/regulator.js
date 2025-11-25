const mongoose = require("mongoose");

const regulatorSchema = new mongoose.Schema({
    regualtor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true,
    },
    
    
}, { timestamps: true });

module.exports = mongoose.model("Regulator", regulatorSchema);