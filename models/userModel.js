const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
    },
    avatar: {
        type: String,
        default: 'avatar.png',
    },
    email: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
});

const User = mongoose.model("user", userSchema);

module.exports = User;