
import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// In-memory OTP store (for demo; use Redis/DB for production)
const otpStore = {};

// Send OTP : /api/user/send-otp
export const sendOtp = async (req, res) => {
    try {
        const { name, email, mobile } = req.body;
        if (!name || !email || !mobile) {
            return res.json({ success: false, message: 'Missing Details' });
        }
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
        if (existingUser) {
            return res.json({ success: false, message: 'User already exists' });
        }
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore[mobile] = { otp, expires: Date.now() + 5 * 60 * 1000, name, email };
        // TODO: Integrate with SMS API here
        console.log(`OTP for ${mobile}: ${otp}`); // For demo
        return res.json({ success: true, message: 'OTP sent to mobile' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Register User : /api/user/register (with OTP)
export const register = async (req, res) => {
    try {
        const { name, email, mobile, otp, password } = req.body;
        if (!name || !email || !mobile || !otp || !password) {
            return res.json({ success: false, message: 'Missing Details' });
        }
        // Check OTP
        const otpData = otpStore[mobile];
        if (!otpData || otpData.otp !== otp || otpData.email !== email || otpData.name !== name) {
            return res.json({ success: false, message: 'Invalid OTP or details' });
        }
        if (otpData.expires < Date.now()) {
            delete otpStore[mobile];
            return res.json({ success: false, message: 'OTP expired' });
        }
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
        if (existingUser) {
            return res.json({ success: false, message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, mobile, password: hashedPassword });
        delete otpStore[mobile];
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.json({ success: true, user: { email: user.email, name: user.name, mobile: user.mobile } });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Register User : /api/user/register
export const register = async (req, res)=>{
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password){
            return res.json({success: false, message: 'Missing Details'})
        }

        const existingUser = await User.findOne({email})

        if(existingUser)
            return res.json({success: false, message: 'User already exists'})

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({name, email, password: hashedPassword})

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true, // Prevent JavaScript to access cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time
        })

        return res.json({success: true, user: {email: user.email, name: user.name}})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Login User : /api/user/login

export const login = async (req, res)=>{
    try {
        const { email, password } = req.body;

        if(!email || !password)
            return res.json({success: false, message: 'Email and password are required'});
        const user = await User.findOne({email});

        if(!user){
            return res.json({success: false, message: 'Invalid email or password'});
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch)
            return res.json({success: false, message: 'Invalid email or password'});

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.json({success: true, user: {email: user.email, name: user.name}})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


// Check Auth : /api/user/is-auth
export const isAuth = async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.json({ success: false, message: 'Not Authorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.json({ success: false, message: 'Not Authorized' });
    }

    return res.json({ success: true, user });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
}


// Logout User : /api/user/logout

export const logout = async (req, res)=>{
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({ success: true, message: "Logged Out" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}