import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register User : /api/user/register
export const register = async (req, res) => {
    try {
        const { name, email, password, mobile, dob } = req.body;

        if (!name || !email || !password || !mobile) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        const existingUser = await User.findOne({ email })

        if (existingUser)
            return res.json({ success: false, message: 'User already exists' })

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({ name, email, mobile, dob, password: hashedPassword })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true, // Prevent JavaScript to access cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time
        })

        return res.json({ success: true, user: { email: user.email, name: user.name } })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Login User : /api/user/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body; // 'email' field can contain email OR mobile

        if (!email || !password)
            return res.json({ success: false, message: 'Email/Mobile and password are required' });

        // Check if input is email or mobile
        const isEmail = email.includes('@');
        const query = isEmail ? { email } : { mobile: email };

        const user = await User.findOne(query);

        if (!user) {
            return res.json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch)
            return res.json({ success: false, message: 'Invalid email or password' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.json({ success: true, user: { email: user.email, name: user.name } })
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
export const logout = async (req, res) => {
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

// Mobile Login (OTP Verified on Frontend) : /api/user/login-mobile
export const loginWithMobile = async (req, res) => {
    try {
        const { mobile } = req.body;

        if (!mobile) return res.json({ success: false, message: "Mobile number required" });

        const user = await User.findOne({ mobile });

        if (!user) return res.json({ success: false, message: "User not found with this mobile number" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.json({ success: true, user: { email: user.email, name: user.name, mobile: user.mobile } })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Check if user exists by mobile : /api/user/check-mobile
export const checkUserByMobile = async (req, res) => {
    try {
        const { mobile } = req.body;
        if (!mobile) return res.json({ success: false, message: "Mobile number required" });

        const user = await User.findOne({ mobile });

        if (user) {
            return res.json({ success: true, exists: true, message: "User exists" });
        } else {
            return res.json({ success: true, exists: false, message: "User does not exist" });
        }
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}