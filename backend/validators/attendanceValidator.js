const validator = require("validator");

exports.validateAddAttendance = ({ date, attendanceType }) => {
    const errors = {};

    // Date validation
    if (!date) {
        errors.date = "Date is required.";
    } else if (!validator.isISO8601(date)) {
        errors.date = "Invalid date format. Use ISO8601 format (YYYY-MM-DD).";
    }

    // Attendance type validation
    const validTypes = ['Present', 'Leave', 'Cancel Leave', 'Extra Day'];
    if (!attendanceType) {
        errors.attendanceType = "Attendance type is required.";
    } else if (!validTypes.includes(attendanceType)) {
        errors.attendanceType = `Invalid attendance type. Must be one of: ${validTypes.join(", ")}.`;
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

exports.validateUpdateAttendance = ({ attendanceType, notes }) => {
    const errors = {};

    // Attendance type validation
    if (attendanceType) {
        const validTypes = ['Present', 'Leave', 'Cancel Leave', 'Extra Day'];
        if (!validTypes.includes(attendanceType)) {
            errors.attendanceType = `Invalid attendance type. Must be one of: ${validTypes.join(", ")}.`;
        }
    }

    // Notes validation (optional)
    if (notes !== undefined) {
        if (!validator.isLength(notes, { max: 200 })) {
            errors.notes = "Notes cannot exceed 200 characters.";
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};