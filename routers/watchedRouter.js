const router = require('express').Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

//* Add watched anime
router.post("/profile/watched", async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.json(null);
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(verified.user);

        const { id, episode, time } = req.body;

        if (!id || episode === undefined || time === undefined) {
            return res.status(400).json({
                errorMessage: "Please provide all required fields: id, episode, and time.",
            });
        }

        // Convert episode to string
        const episodeStr = episode.toString();

        const existingAnime = user.watchedAnimes.find(anime => anime.id === id);

        if (existingAnime) {
            // Filter out any duplicate episodes
            existingAnime.episodes = existingAnime.episodes.filter(ep => ep.episode.toString() !== episodeStr);

            // Add the updated episode
            existingAnime.episodes.push({ episode: episodeStr, time });
        } else {
            // Add a new anime to the watched list
            const newAnime = {
                id,
                episodes: [{ episode: episodeStr, time }],
            };
            user.watchedAnimes.push(newAnime);
        }

        await user.save();

        res.json(user);
    } catch (error) {
        console.error("Add watched anime error:", error);
        res.status(500).send();
    }
});

//* Get watched anime
router.get("/profile/watched", async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.json(null);
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(verified.user);

        res.json(user.watchedAnimes);

    } catch (error) {
        console.error("Get watched anime error:", error);
        res.json(null);
    }
});

module.exports = router;