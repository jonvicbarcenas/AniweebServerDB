const mongoose = require('mongoose');

// Sub-schema for episodes
const episodeSchema = new mongoose.Schema({
    episodeNumber: {
        type: String,
        required: true,
    },
    episodeTitle: {
        type: String,
        required: true,
    },
    episodeId: {
        type: String,
        required: true,
    },
    fullEpisodeParams: {
        type: String,
        required: true,
    },
    time: {
        type: Number,
    }
});

// Sub-schema for stats
const statsSchema = new mongoose.Schema({
    rating: {
        type: String,
    },
    quality: {
        type: String,
    },
    cc: {
        sub: {
            type: Number,
        },
        dub: {
            type: Number,
        }
    }
});

// Sub-schema for anime
const animeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    id: {
        type: String,
    },
    name: {
        type: String,
    },
    duration: {
        type: String,
    },
    poster: {
        type: String,
    },
    stats: statsSchema,
    episodes: [episodeSchema]
});

const Anime = mongoose.model('Anime', animeSchema);

module.exports = Anime;