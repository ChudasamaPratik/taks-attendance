const Salary = require('../models/Salary');
const Attendance = require('../models/Attendance');
const { validateSalaryInput, validateSalaryDelete } = require('../validators/salaryValidator');
const mongoose = require('mongoose');

// /Add a new salary record
exports.addSalary = async (req, res) => {
    const { errors, isValid } = validateSalaryInput(req.body);

    if (!isValid) {
        return res.status(400).json({
            success: false,
            errors: errors
        });
    }

    try {
        const { baseSalary, deductions, month, notes } = req.body;
        const userId = req.user._id;

        const existingSalary = await Salary.findOne({ userId, month });
        if (existingSalary) {
            return res.status(400).json({
                success: false,
                message: "Salary record already exists for this month."
            });
        }

        const salary = new Salary({
            userId,
            month,
            baseSalary,
            deductions: deductions || 0,
            notes: notes || ''
        });

        await salary.save();

        res.status(201).json({
            success: true,
            message: "Salary added successfully.",
            salary
        });
    } catch (error) {
        console.error("Error adding salary:", error);
        res.status(500).json({
            success: false,
            message: "Server error while adding salary.",
            error: error.message
        });
    }
};

// Update salary record (same logic for attendance-based amount calculation)
exports.updateSalary = async (req, res) => {
    // Validate input first
    const { errors, isValid } = validateSalaryInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json({
            success: false,
            errors: errors
        });
    }

    try {
        const { id } = req.params;
        const { baseSalary, deductions, month, notes } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid salary record ID." });
        }

        const salary = await Salary.findById(id);

        if (!salary) {
            return res.status(404).json({ success: false, message: "Salary record not found." });
        }

        if (baseSalary !== undefined) salary.baseSalary = baseSalary;
        if (deductions !== undefined) salary.deductions = deductions;
        if (month !== undefined) salary.month = month;
        if (notes !== undefined) salary.notes = notes;

        // Recalculate attendance-based amount
        const startOfMonth = new Date(`${salary.month}-01`);
        const endOfMonth = new Date(new Date(startOfMonth).setMonth(startOfMonth.getMonth() + 1));

        // Get the number of days in the month dynamically
        const daysInMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0).getDate();

        const attendanceRecords = await Attendance.find({
            userId: salary.userId,
            date: { $gte: startOfMonth, $lt: endOfMonth }
        });

        const presentDays = attendanceRecords.filter(record => record.attendanceType === "Present").length;
        const extraDays = attendanceRecords.filter(record => record.attendanceType === "Extra Day").length;

        // Calculate daily rate based on the exact number of days in the month
        const dailyRate = salary.baseSalary / daysInMonth;
        salary.attendanceBasedAmount = (presentDays + extraDays) * dailyRate;

        // Save the updated record (no totalSalary field anymore)
        await salary.save();

        res.json({
            success: true,
            message: "Salary updated successfully.",
            salary
        });
    } catch (error) {
        console.error("Error updating salary:", error);
        res.status(500).json({
            success: false,
            message: "Server error while updating salary.",
            error: error.message
        });
    }
};

// List salary records (remains unchanged)
exports.listSalaries = async (req, res) => {
    try {
        console.log('User Data:', req.user);

        if (!req.user || !req.user._id) {
            return res.status(400).json({
                success: false,
                message: 'User not authenticated.',
            });
        }

        const userId = req.user._id;
        const { month } = req.query;

        const query = { userId };
        if (month) query.month = month;

        const salaries = await Salary.find(query).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: salaries.length,
            salaries,
        });
    } catch (error) {
        console.error('Error listing salaries:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while listing salaries.',
            error: error.message,
        });
    }
};



// Delete a specific salary record
exports.deleteSalary = async (req, res) => {
    // Validate input first
    const { id } = req.params;
    const { errors, isValid } = validateSalaryDelete(id);

    // Check validation
    if (!isValid) {
        return res.status(400).json({
            success: false,
            errors: errors
        });
    }

    try {
        // Find and delete the salary record
        const salary = await Salary.findOneAndDelete({
            _id: id,
            userId: req.user._id
        });

        // Check if the record was found and deleted
        if (!salary) {
            return res.status(404).json({
                success: false,
                message: "Salary record not found or you do not have permission to delete this record."
            });
        }

        // Successful deletion response
        res.json({
            success: true,
            message: "Salary record deleted successfully.",
            deletedSalary: salary
        });
    } catch (error) {
        console.error("Error deleting salary:", error);
        res.status(500).json({
            success: false,
            message: "Server error while deleting salary.",
            error: error.message
        });
    }
};