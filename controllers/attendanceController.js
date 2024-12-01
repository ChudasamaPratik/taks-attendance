const mongoose = require('mongoose');
const Attendance = require('../models/Attendance');
const Salary = require('../models/Salary');
const { validateAddAttendance, validateUpdateAttendance } = require('../validators/attendanceValidator');

// Add attendance record
// Add Attendance Controller
exports.addAttendance = async (req, res) => {
    try {
        const { date, attendanceType, notes } = req.body;
        const userId = req.user._id;

        const { isValid, errors } = validateAddAttendance({ date, attendanceType });
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid input',
                errors
            });
        }

        const existingRecord = await Attendance.findOne({
            userId,
            date
        });

        if (existingRecord) {
            return res.status(400).json({
                success: false,
                message: "Attendance record already exists for this date.",
            });
        }

        const attendance = new Attendance({
            userId,
            date: date,
            attendanceType,
            notes: notes || ''
        });

        await attendance.save();

        // Calculate and update salary for the month
        await updateMonthlySalary(userId, date);

        res.status(201).json({
            success: true,
            message: "Attendance added successfully.",
            attendance: {
                _id: attendance._id,
                date: attendance.date,
                attendanceType: attendance.attendanceType,
                notes: attendance.notes
            }
        });
    } catch (error) {
        console.error("Error adding attendance:", error);
        res.status(500).json({
            success: false,
            message: "Server error while adding attendance.",
            error: error.message
        });
    }
};

// Helper function to update monthly salary
async function updateMonthlySalary(userId, attendanceDate) {
    const date = new Date(attendanceDate);
    const formattedDate = date.toLocaleString('default', { month: 'long', year: 'numeric' }).replace(' ', '-');


    const salaryRecord = await Salary.findOne({
        userId,
        month: formattedDate
    });

    if (!salaryRecord) return;

    const startOfMonth = new Date(`${formattedDate}-01`);
    const endOfMonth = new Date(new Date(startOfMonth).setMonth(startOfMonth.getMonth() + 1));

    const daysInMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0).getDate();

    const attendanceRecords = await Attendance.find({
        userId,
        date: { $gte: startOfMonth, $lt: endOfMonth }
    });

    const presentDays = attendanceRecords.filter(record => record.attendanceType === "Present").length;
    const extraDays = attendanceRecords.filter(record => record.attendanceType === "Extra Day").length;
    const cancelLeave = attendanceRecords.filter(record => record.attendanceType === "Cancel Leave").length;
    const leave = attendanceRecords.filter(record => record.attendanceType === "Leave").length;




    const dailyRate = salaryRecord.baseSalary / daysInMonth;
    const totalSalary = ((presentDays + extraDays + cancelLeave - leave) * dailyRate) - salaryRecord.deductions;


    console.log("presentDays", presentDays);
    console.log("extraDays", extraDays);
    console.log("cancelLeave", cancelLeave);
    console.log("leave", leave);

    // console.log("Total days", presentDays + extraDays + cancelLeave - leave);

    // console.log("----------------------daysInMonth----------------------", daysInMonth);
    // console.log("----------------------salaryRecord.baseSalary----------------------", salaryRecord.baseSalary);

    // console.log("-------------------dailyRate----------------------", dailyRate);
    // console.log("----------------------totalSalary----------------------", totalSalary);



    await Salary.findByIdAndUpdate(salaryRecord._id, {
        totalSalary,
    });
}


// Update attendance record
exports.updateAttendance = async (req, res) => {
    try {
        const { id } = req.params; // Attendance record ID
        const { attendanceType, notes } = req.body;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid attendance record ID."
            });
        }

        // Validate input
        const { isValid, errors } = validateUpdateAttendance({ attendanceType, notes });
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid input',
                errors
            });
        }

        const attendance = await Attendance.findById(id);

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: "Attendance record not found.",
            });
        }

        // Ensure the record belongs to the authenticated user
        if (attendance.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this record.",
            });
        }

        // Update the record
        if (attendanceType) attendance.attendanceType = attendanceType;
        if (notes !== undefined) attendance.notes = notes;

        await attendance.save();

        res.json({
            success: true,
            message: "Attendance updated successfully.",
            attendance: {
                _id: attendance._id,
                date: attendance.date,
                attendanceType: attendance.attendanceType,
                notes: attendance.notes
            }
        });
    } catch (error) {
        console.error("Error updating attendance:", error);
        res.status(500).json({
            success: false,
            message: "Error updating attendance.",
            error: error.message
        });
    }
};

// List attendance records
exports.listAttendance = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const userId = req.user._id;

        // Build query
        const query = { userId };

        // Add date filtering if start and end dates are provided
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // Fetch attendance records
        const attendance = await Attendance.find(query)
            .sort({ date: -1 }) // Sort by most recent first
            .select('date attendanceType notes'); // Select specific fields

        res.json({
            success: true,
            count: attendance.length,
            attendance
        });
    } catch (error) {
        console.error("Error listing attendance:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching attendance records.",
            error: error.message
        });
    }
};