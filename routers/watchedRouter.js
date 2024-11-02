const router = require('express').Router();
const User = require('../models/userModel'); // Import User model
const Anime = require('../models/animeModel'); // Import Anime model
const jwt = require('jsonwebtoken');

//* Add watched anime
router.post("/profile/watched", async (req, res) => {
    // console.log(req.body);
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.json(null);
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(verified.user).populate('watchedAnimes');

        const { id, name, duration, poster, stats, episodes } = req.body;

        if (!id || !name || !duration || !poster || !stats || !episodes) {
            return res.status(400).json({
                errorMessage: "Please provide all required fields: id, name, duration, poster, stats, and episodes.",
            });
        }

        // Convert each episode number to string and ensure episodeId is included
        const episodesWithStr = episodes.map(ep => ({
            ...ep,
            episodeId: ep.episodeId.toString(),
        }));

        let existingAnime = user.watchedAnimes.find(anime => anime.id === id);

        if (existingAnime) {
            // Process each episode from the request
            episodesWithStr.forEach(newEpisode => {
                const existingEpisodeId = existingAnime.episodes.findIndex(
                    ep => ep.episodeId === newEpisode.episodeId
                );

                if (existingEpisodeId !== -1) {
                    // If episodeId exists, only update the time
                    existingAnime.episodes[existingEpisodeId].time = newEpisode.time;
                } else {
                    // If episodeId doesn't exist, add the new episode
                    existingAnime.episodes.push(newEpisode);
                }
            });

            // Sort episodes by episodeId
            existingAnime.episodes.sort((a, b) => parseInt(a.episodeId) - parseInt(b.episodeId));
            
            await existingAnime.save();
        } else {
            // Sort episodes before adding new anime
            episodesWithStr.sort((a, b) => parseInt(a.episodeId) - parseInt(b.episodeId));

            // Add a new anime to the watched list
            existingAnime = new Anime({
                user: user._id,
                id,
                name,
                duration,
                poster,
                stats,
                episodes: episodesWithStr
            });
            await existingAnime.save();
            user.watchedAnimes.push(existingAnime._id);
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
        const user = await User.findById(verified.user).populate('watchedAnimes');

        res.json(user.watchedAnimes);

    } catch (error) {
        console.error("Get watched anime error:", error);
        res.json(null);
    }
});

module.exports = router;