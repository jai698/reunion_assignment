const User = require("../models/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Register a new user (signup)
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the user already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        await User.create({ 
            name: name.toLowerCase(),
            email: email,
            password: hashedPassword,
        });

        res.status(201).json({ message: "You are signed up" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login a user (signin)
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const response = await User.findOne({ email });
        
        const isMatchedPassword = await bcrypt.compare(password, response.password);
        if(isMatchedPassword){
            const token = jwt.sign({
                id: response._id.toString()
            },process.env.JWT_SECRET);
            res.json({
                token:token,
            })
        }
        else{
            res.status(400).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
