const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Registration endpoint
router.post('/register', async (req, res) => {
    const { name, email, password, mobile } = req.body; // Include mobile
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, mobile });
        await user.save();
        res.status(201).json({ success: true, user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    const { email, mobile, password } = req.body; // Include mobile
    try {
        // Find user by email or mobile
        const user = await User.findOne({ $or: [{ email }, { mobile }] });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
