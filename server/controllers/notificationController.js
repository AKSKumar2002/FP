import Notification from "../models/Notification.js";

// Fetch user notifications
export const getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.body;
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
        res.json({ success: true, notifications });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.body;
        await Notification.findByIdAndUpdate(notificationId, { read: true });
        res.json({ success: true, message: "Marked as read" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Mark all as read
export const markAllAsRead = async (req, res) => {
    try {
        const { userId } = req.body;
        await Notification.updateMany({ userId, read: false }, { read: true });
        res.json({ success: true, message: "All marked as read" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Helper function to create notification (for internal use)
export const createNotification = async (userId, title, message, type = 'info') => {
    try {
        await Notification.create({ userId, title, message, type });
    } catch (error) {
        console.log("Failed to create notification:", error.message);
    }
};
