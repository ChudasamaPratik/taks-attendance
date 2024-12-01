const JWT = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/secrets');

// Middleware to verify JWT token and authenticate user
const auth = async (req, res, next) => {
    // Get the token from the Authorization header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    // If there's no token, deny access
    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    try {
        const decoded = JWT.verify(token, JWT_SECRET);
        console.log(decoded); // Optional: You can log the decoded token for debugging

        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        next();
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Invalid token. Access denied."
        });
    }
};

module.exports = auth;
