import express from 'express';
import { isAuth, login, logout, register } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';

const userRouter = express.Router();

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.get('/is-auth', authUser, isAuth)
userRouter.get('/logout', authUser, logout)

// Add this route for password reset
userRouter.post('/reset-password', async (req, res) => {
  // TODO: Implement actual password reset logic
  res.status(200).json({ message: 'Password reset endpoint reached.' });
});

export default userRouter