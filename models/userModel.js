const mongoose = require('mongoose');
const Anime = require('./animeModel');

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
    watchedAnimes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Anime'
    }]
});

const User = mongoose.model("User", userSchema);

module.exports = User;