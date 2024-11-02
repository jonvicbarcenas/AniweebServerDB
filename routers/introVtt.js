const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/anime', async (req, res) => {
  const { animeEpisodeId, ep } = req.query;

  if (!animeEpisodeId || !ep) {
    return res.status(400).json({ error: 'animeEpisodeId and ep are required' });
  }

  try {
    const response = await axios.get(`https://jvbarcenas.tech/api/v2/hianime/episode/sources?animeEpisodeId=${animeEpisodeId}?ep=${ep}`);
    const { intro, outro } = response.data.data;
    console.log(intro, outro);

    // Construct VTT format
    let vttContent = 'WEBVTT\n\n';
    if (intro) {
      vttContent += `${formatTime(intro.start)} --> ${formatTime(intro.end)}\nIntro\n\n`;
    }
    if (outro) {
      vttContent += `${formatTime(outro.start)} --> ${formatTime(outro.end)}\nOutro\n`;
    }

    // Set content-type to text/vtt
    res.setHeader('Content-Type', 'text/vtt');
    res.send(vttContent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from the API' });
  }
});

// Helper function to format time in HH:MM:SS format
function formatTime(seconds) {
  const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

module.exports = router;
