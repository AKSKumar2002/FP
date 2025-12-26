import express from 'express';
import { isAuth, login, logout, register, loginWithMobile, checkUserByMobile, sendOtp } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import User from '../models/User.js'; // Make sure this path is correct
import bcrypt from 'bcryptjs';

const userRouter = express.Router();

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.post('/check-mobile', checkUserByMobile)
userRouter.post('/send-otp', sendOtp)
userRouter.post('/login-mobile', loginWithMobile)
userRouter.get('/is-auth', authUser, isAuth)
userRouter.get('/logout', authUser, logout)

userRouter.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and new password are required.' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ success: true, message: 'Password has been reset successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

export default userRouter