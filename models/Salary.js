const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    month: {
        type: String, // Format: "December-2024"
        required: true,
    },
    baseSalary: {
        type: Number,
        required: true,
    },
    deductions: {
        type: Number,
        default: 0,
    },
    totalSalary: {
        type: Number,
        default: 0,
    },
    notes: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
});

module.exports = mongoose.model("Salary", salarySchema);
