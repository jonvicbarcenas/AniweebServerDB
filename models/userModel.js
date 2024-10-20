const mongoose = require('mongoose');
const animeSchema = require('./animeModel');

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
    config: {
        autoskip: {
            type: Boolean,
            default: true,
        },
        autoplay: {
            type: Boolean,
            default: true,
        },
        autonext: {
            type: Boolean,
            default: true,
        },
        lights: {
            type: Boolean,
            default: true,
        },
        defaultCaption: {
            type: String,
            default: 'English',
        },
    },
    watchedAnimes: [animeSchema],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
