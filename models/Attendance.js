const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    attendanceType: {
        type: String,
        enum: ['Present', 'Leave', 'Cancel Leave', 'Extra Day'],
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
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

module.exports = mongoose.model("Attendance", attendanceSchema);