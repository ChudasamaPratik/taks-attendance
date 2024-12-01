// validators/authValidator.js
const validator = require("validator");

exports.validateRegister = ({ username, email, password }) => {
    const errors = {};

    // Username validation
    if (!username || validator.isEmpty(username.trim())) {
        errors.username = "Username is required.";
    }

    // Email validation
    if (!email || !validator.isEmail(email)) {
        errors.email = "A valid email is required.";
    }

    // Password validation
    if (!password || !validator.isLength(password, { min: 6 })) {
        errors.password = "Password must be at least 6 characters.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

exports.validateLogin = ({ email, password }) => {
    const errors = {};

    // Email validation
    if (!email || !validator.isEmail(email)) {
        errors.email = "A valid email is required.";
    }

    // Password validation
    if (!password || validator.isEmpty(password)) {
        errors.password = "Password is required.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};
