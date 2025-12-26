import User from "../models/User.js";
import OtpModel from "../models/Otp.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';

// Helper to send SMS (Placeholder for now)
// Helper to send SMS via Fast2SMS
const sendSms = async (mobile, otp) => {
    try {
        const apiKey = "WYEKXxnv9NIyDRjw6HGhJd7QBTfFV1M5zcLSAkP032oalUpCbgJpge0rIh6LSsudfzRQXMVavqx7mcP5";
        await axios.get('https://www.fast2sms.com/dev/bulkV2', {
            headers: {
                authorization: apiKey,
            },
            params: {
                variables_values: otp,
                route: "otp",
                numbers: mobile,
            }
        });
        console.log(`SMS Sent to ${mobile}: ${otp}`);
    } catch (error) {
        console.error("SMS Sending Failed:", error.response?.data || error.message);
    }
}

// Register User : /api/user/register
export const register = async (req, res) => {
    try {
        const { name, email, password, mobile, dob, otp } = req.body;

        if (!name || !email || !password || !mobile || !otp) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        // Verify OTP
        const existingOtpUser = await User.findOne({ mobile, otp, otpExpire: { $gt: Date.now() } });
        if (!existingOtpUser) {
            return res.json({ success: false, message: 'Invalid or Expired OTP' });
        }

        // Check if email already used (independent of mobile check done earlier)
        const emailExists = await User.findOne({ email });
        if (emailExists) return res.json({ success: false, message: 'Email already registered' });

        const hashedPassword = await bcrypt.hash(password, 10)

        // Update the user who holds the OTP with full details (or create new if logic differs, but here we used mobile to store OTP)
        // Actually, we usually create a temporary record or update the existing one. 
        // Strategy: We can't save 'otp' in the main User record if the user doesn't exist yet?
        // Ah, typically we store OTP in a separate Redis or temporary collection. 
        // But to keep it simple with MongoDB User model:
        // We might have created a "placeholder" user during "Send OTP" if they didn't exist?
        // OR: "Send OTP" logic handles creating a user record if not exists?
        // Let's refine: 
        // If Send OTP is called for new mobile: Create User with mobile & otp only? But 'name'/'email' required?
        // Better: Store OTP in the User document. User must exist? 
        // Problem: Registration flow. User doesn't exist.
        // Solution: Upsert User with mobile only during Send OTP. 
        // But Schema requires name/email/password. We'd need to make them optional or use a separate OTP model.
        // Let's allow name/email/password to be optional temporarily? No, that breaks strictness.
        // SIMPLER APPROACH for this project: 
        // Frontend sends OTP. Backend just verifies it provided in the request matches what was 'expected'? 
        // BUT how does backend know what was expected if we don't store it?
        // Let's make `name`, `email`, `password` NOT required in Mongoose, but checked in Controller?
        // OR: Use a separate `OtpModel`.
        // Let's use a separate `OtpModel` (cleaner).
        // Wait, for now let's use the USER model but update `register` to:
        // 1. Check `OtpModel` for this mobile. verify.
        // 2. Create User.

        // Let's stick to User model modifications for simplicity if possible, but schema validation will fail.
        // Let's create an `OTP` model quickly in the same file or new file?
        // Or just let `register` verify the OTP sent in the body?
        // But `register` needs to know if the OTP is correct.
        // Let's assume `sendOtp` saves to a temporary `otps` collection.
        // I will create a simple in-memory OTP store for this session? No, server restarts lose it.
        // I will add a `Otp.js` model.

        // RE-EVALUATION: The user wants "Real OTP".
        // Let's create an `Otp` model.

        const validOtp = await OtpModel.findOne({ mobile, otp });
        if (!validOtp) return res.json({ success: false, message: "Invalid OTP" });

        const user = await User.create({ name, email, mobile, dob, password: hashedPassword })

        // Clean up OTP
        await OtpModel.deleteOne({ mobile });

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

// Send OTP : /api/user/send-otp
export const sendOtp = async (req, res) => {
    try {
        const { mobile } = req.body;
        if (!mobile) return res.json({ success: false, message: "Mobile number required" });

        // Generate 4 digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        // Save to DB (Update existing or Create new OTP record)
        await OtpModel.findOneAndUpdate(
            { mobile },
            { mobile, otp, createdAt: Date.now() },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Send SMS
        await sendSms(mobile, otp);

        res.json({ success: true, message: "OTP Sent" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Mobile Login (OTP Verified on Backend) : /api/user/login-mobile
export const loginWithMobile = async (req, res) => {
    try {
        const { mobile, otp } = req.body;

        if (!mobile || !otp) return res.json({ success: false, message: "Mobile and OTP required" });

        // Verify OTP
        const validOtp = await OtpModel.findOne({ mobile, otp });
        if (!validOtp) return res.json({ success: false, message: "Invalid or Expired OTP" });

        const user = await User.findOne({ mobile });

        if (!user) return res.json({ success: false, message: "User not found with this mobile number" });

        // Clear OTP after usage
        await OtpModel.deleteOne({ mobile });

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