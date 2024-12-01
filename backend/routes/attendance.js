const express = require("express");
const {
    addAttendance,
    listAttendance,
    updateAttendance
} = require("../controllers/attendanceController");
const auth = require("../middleware/auth");

const router = express.Router();

// Add attendance
router.post("/", auth, addAttendance);

// List attendance records
router.get("/", auth, listAttendance);

// Update attendance
router.put("/:id", auth, updateAttendance);

module.exports = router;