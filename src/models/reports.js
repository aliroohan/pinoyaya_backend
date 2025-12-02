const mongoose = require("mongoose");

const reportsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "resolved", "rejected"],
        default: "pending",
        required: true,
    },
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "reporterModel",
        required: true,
    },
    reporterRole: {
        type: String,
        enum: ["customer", "babysitter"],
        required: true,
    },
    reported: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "reportedModel",
        required: true,
    },
    reportedRole: {
        type: String,
        enum: ["customer", "babysitter"],
        required: true,
    },
}, {
    timestamps: true,
}   
);

reportsSchema.virtual("reporterModel").get(function() {
    return this.reporterRole === "customer" ? "Customer" : "Babysitter";
});

reportsSchema.virtual("reportedModel").get(function() {
    return this.reportedRole === "customer" ? "Customer" : "Babysitter";
});



module.exports = mongoose.model("Reports", reportsSchema);