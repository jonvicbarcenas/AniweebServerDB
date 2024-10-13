const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:3000", "https://jvbarcenas.tech"],
    credentials: true,
}));

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

app.use("/auth", require('./routers/userRouter'));
app.use("/customer", require('./routers/customerRouter'));
app.use("/list", require('./routers/avatarRouter'));



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
