const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();

router.post('/razorpay', async (req, res) => {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: req.body.amount * 100, // amount in paise
            currency: "INR",
            receipt: `order_rcptid_${Date.now()}`,
        };

        let order;
        try {
            order = await razorpay.orders.create(options);
            console.log("Razorpay order response:", order);
        } catch (err) {
            console.error("Razorpay order creation error:", err);
            return res.status(500).json({ success: false, message: "Razorpay API error", error: err });
        }

        if (!order || !order.id) {
            return res.status(500).json({ success: false, message: "Razorpay order creation failed", order });
        }

        res.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID,
        });
    } catch (err) {
        console.error("Razorpay error:", err);
        res.status(500).json({ success: false, message: "Failed to create Razorpay order", error: err.message });
    }
});

module.exports = router;