const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

// મોડેલમાં પાસવર્ડ હેશ કરવો
userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) return next(); // જો પાસવર્ડ બદલાયો ન હોય તો સ્કિપ કરો
    this.password = await bcrypt.hash(this.password, 12); // 12 રાઉન્ડ્સ સાથે હેશ કરો
    next();
});

// પાસવર્ડનું કંપેર કરવું
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password); // વપરાશકર્તાના પાસવર્ડની તુલના કરો
};

module.exports = mongoose.model('User', userSchema);