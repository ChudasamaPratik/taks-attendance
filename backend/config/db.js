const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const conn = async () => {
    try {
        // Check the environment and use the corresponding MongoDB URI
        const mongoUri = process.env.NODE_ENV === 'production'
            ? process.env.MONGO_URI_LIVE   // Live URL for production
            : process.env.MONGO_URI_LOCAL; // Local URL for development

        await mongoose.connect(mongoUri);
        console.log("Mongoose Connected");
    } catch (error) {
        console.log("MongoDB Connection error: ", error);
        process.exit(1);
    }
}

module.exports = conn;
