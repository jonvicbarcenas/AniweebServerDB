const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const passport = require('./middleware/googleAuth');
const session = require('express-session');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:3000", "https://jvbarcenas.tech"],
    credentials: true,
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
        sameSite: 'none' // Adjust as needed
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Serve static files from the "avatars" directory
app.use('/avatars', express.static(path.join(__dirname, 'avatars')));

// Connect to MongoDB
mongoose.connect(process.env.MDB_CONNECT)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error(err);
    });

// SET UP ROUTES
app.use("/customer", require('./routers/customerRouter'));
app.use("/auth", require('./routers/userRouter'));
app.use("/list", require('./routers/avatarRouter'));
app.use("/vtt", require('./routers/introVtt'));

// Google OAuth 2.0 routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    // Generate JWT token
    const token = jwt.sign({
        user: req.user._id,
    }, process.env.JWT_SECRET);

    // Send the token in an HTTP-only cookie
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
        sameSite: 'none', // Adjust as needed
        maxAge: 90 * 24 * 60 * 60 * 1000 // 90 days
    });

    // Redirect to the last visited page
    res.redirect('jvbarcenas.tech');
    
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));