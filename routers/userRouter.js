const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//* REGISTER
router.post("/", async (req, res) => {
     console.log(req.body); // this run because there's app.use(express.json()); in the index.js

    //destructuring
    try {
        const { username, email, password, passwordVerify } = req.body;

        //* validation

        if (!username || !email || !password || !passwordVerify) {
            return res
                .status(400)
                .json({ 
                    errorMessage: "Please enter all required fields."
                });
        }

        //* password length validation
        if (password.length < 6) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 6 characters.",
                });
        }

        //* password match validation
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice.",
                });
        }

        //* username validation
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res
                .status(400)
                .json({
                    errorMessage: "An account with this username already exists.",
                });
        }


        //* email validation
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({
                    errorMessage: "An account with this email already exists.",
                });
        }


        //* hash the password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt); 
        
        //* save a new user account to the db
        const newUser = new User({
            username,
            email,
            passwordHash,
        });

        const savedUser = await newUser.save();


        //* sign the token
        const token = jwt.sign({
            user: savedUser._id,
        }, process.env.JWT_SECRET);

        //* send the token in a HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
        }).send();

    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
})

//* LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        //* validation
        if (!email || !password) {
            return res
                .status(400)
                .json({ 
                    errorMessage: "Please enter all required fields."
                });
        }

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong email or password.",
                });
        }

        //* checks the password to hashed password
        const passwordCorrect = await bcrypt.compare(
            password, 
            existingUser.passwordHash
        );

        if (!passwordCorrect) {
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong email or password.",
                });
        }

        //* sign the token
        const token = jwt.sign({
            user: existingUser._id,
        }, process.env.JWT_SECRET);

        //* send the token in a HTTP-only cookie

        res.cookie("token", token, {
            httpOnly: true,
        }).send();

    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
});


router.get("/logout", (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
    }).send();
});

router.get("/loggedIn", (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.json(false);
        }

        jwt.verify(token, process.env.JWT_SECRET);

        res.send(true);

        
    } catch (error) {
        res.json(false);
    }
});

//* GEt user profile
router.get("/profile", async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.json(null);
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(verified.user);

        res.json(user);

    } catch (error) {
        res.json(null);
    }
});


module.exports = router;