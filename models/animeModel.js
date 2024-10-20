const mongoose = require('mongoose');

// Sub-schema for episodes
const episodeSchema = new mongoose.Schema({
    episode: {
        type: Number,
        required: true,
    },
    time: {
        type: Number,
        required: true,
    }
});

// Sub-schema for anime
const animeSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    episodes: [episodeSchema]
});

module.exports = animeSchema;