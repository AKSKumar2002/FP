import express from 'express';
import authUser from '../middlewares/authUser.js';
import { getUserNotifications, markAsRead, markAllAsRead } from '../controllers/notificationController.js';

const notificationRouter = express.Router();

notificationRouter.get('/list', authUser, getUserNotifications);
notificationRouter.post('/read', authUser, markAsRead);
notificationRouter.post('/read-all', authUser, markAllAsRead);

export default notificationRouter;
