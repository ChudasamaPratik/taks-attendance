// server.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL_LIVE
        : process.env.FRONTEND_URL_LOCAL
}));

connectDB(); // Connect to MongoDB

// Middleware to parse JSON requests
app.use(express.json());

// Define routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/salary", require('./routes/salary'));

// Global error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);
