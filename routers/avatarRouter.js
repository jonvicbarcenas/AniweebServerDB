const router = require('express').Router();
const fs = require('fs');
const path = require('path');

//* GET METHOD: display avatar
router.get('/', (req, res) => {
    const avatarsDir = path.join(__dirname, '../avatars');

    // Check if the directory exists
    if (!fs.existsSync(avatarsDir)) {
        return res.status(404).json({ error: 'Avatars directory not found' });
    }

    // Read all files in the avatars directory
    fs.readdir(avatarsDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading avatars directory' });
        }

        // Map files to URL links
        const avatars = files.map(file => {
            return {
                filename: file,
                url: `${req.protocol}://${req.get('host')}/avatars/${file}`
            };
        });

        res.json(avatars);
    });
});

module.exports = router;
