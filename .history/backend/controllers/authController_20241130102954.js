const User = require("../models/User"); // યુઝર મોડેલ ઇમ્પોર્ટ કરો
const JWT = require("jsonwebtoken"); // JWT ટોકન જનરેટ કરવા માટે
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/secrets"); // કોનફિગરેશન ફાઇલમાંથી સિક્રેટ અને ટોકન ટાઈમ
const bcrypt = require("bcryptjs"); // પાસવર્ડ હેશ અને ચકાસવા માટે
const { validateRegister, validateLogin } = require("../validators/authValidator"); // કસ્ટમ વેલિડેશન ફંક્શન્સ

// JWT ટોકન બનાવવાની હેલ્પર ફંક્શન
const createToken = (userId) => {
    return JWT.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// યુઝર રજિસ્ટ્રેશન માટેનું ફંક્શન
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    // ડેટા વેલિડેશન
    const { isValid, errors } = validateRegister({ username, email, password });
    if (!isValid) {
        return res.status(400).json({
            success: false,
            errors // વેલિડેશન ભૂલો ક્લાઈન્ટને મોકલો
        });
    }

    try {
        // ચકાસો કે ઇમેઇલ પહેલેથી જ ઉપયોગમાં છે કે નહીં
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email.",
            });
        }

        // નવો યુઝર બનાવો
        const user = new User({ username, email, password });
        await user.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully.",
            token: createToken(user._id), // JWT ટોકન પરત કરો
        });
    } catch (error) {
        console.error("Server error during registration:", error);
        res.status(500).json({
            success: false,
            error: "Server error during registration.",
        });
    }
};

// યુઝર લોગિન માટેનું ફંક્શન
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // ડેટા વેલિડેશન
    const { isValid, errors } = validateLogin({ email, password });
    if (!isValid) {
        return res.status(400).json({
            success: false,
            errors // વેલિડેશન ભૂલો ક્લાઈન્ટને મોકલો
        });
    }

    try {
        // ઇમેઇલ દ્વારા યુઝરને શોધો
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                error: "Invalid credentials.",
            });
        }

        // પાસવર્ડ ચકાસો
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: "Invalid credentials.",
            });
        }

        // JWT ટોકન જનરેટ કરો
        const token = createToken(user._id);
        res.json({
            success: true,
            message: "Login successful.",
            token,
        });
    } catch (error) {
        console.error("Server error during login:", error);
        res.status(500).json({
            success: false,
            error: "Server error during login.",
        });
    }
};



// List all users - This route will be protected
exports.listUsers = async (req, res) => {
    try {
        const users = await User.find({}, "username email createdAt ");

        res.json({
            success: true,
            message: "Listing users",
            users
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ success: false, error: "Error fetching users" });
    }
};