const Validator = require('validator');
const mongoose = require('mongoose');

exports.validateSalaryInput = ({ baseSalary, deductions, month }) => {
    let errors = {};

    // Directly check if values are undefined, null, or empty strings
    baseSalary = baseSalary ? baseSalary : '';
    deductions = deductions ? deductions : '';
    month = month ? month : '';

    if (Validator.isEmpty(month)) {
        errors.month = "Month is required.";
    }

    if (!Validator.isNumeric(baseSalary.toString())) {
        errors.baseSalary = "Base salary must be a number.";
    }

    if (!Validator.isNumeric(deductions.toString())) {
        errors.deductions = "Deductions must be a number.";
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0 // Check if there are any errors
    };
};


exports.validateSalaryDelete = (salaryId) => {
    let errors = {};

    // Convert salaryId to string to ensure Validator methods work
    salaryId = salaryId ? salaryId.toString().trim() : '';

    // Check if salaryId is provided
    if (Validator.isEmpty(salaryId)) {
        errors.salaryId = 'Salary ID is required';
    }

    if (salaryId && !mongoose.Types.ObjectId.isValid(salaryId)) {
        errors.salaryId = 'Invalid salary record ID format';
    }

    if (salaryId && !Validator.isAlphanumeric(salaryId)) {
        errors.salaryId = 'Salary ID must be alphanumeric';
    }

    // Optional: Check length of ID (MongoDB ObjectIds are typically 24 characters)
    if (salaryId && !Validator.isLength(salaryId, { min: 24, max: 24 })) {
        errors.salaryId = 'Salary ID must be 24 characters long';
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};
