const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Check if email exists
router.post('/check-email', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (user) {
            res.json({ exists: true, name: user.name });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Reset password
router.post('/reset-password', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        user.password = password;
        await user.save();
        
        res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;