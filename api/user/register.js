import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';

// Simple file-based OTP and user store for demo (not for production!)
const OTP_FILE = '/tmp/otp-store.json';
const USER_FILE = '/tmp/user-store.json';

function readStore(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return {};
  }
}
function writeStore(file, data) {
  fs.writeFileSync(file, JSON.stringify(data));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  const { name, email, mobile, otp, password } = req.body;
  if (!name || !email || !mobile || !otp || !password) {
    return res.status(400).json({ success: false, message: 'Missing Details' });
  }
  // Read OTP store
  const otpStore = readStore(OTP_FILE);
  const otpData = otpStore[mobile];
  if (!otpData || otpData.otp !== otp || otpData.email !== email || otpData.name !== name) {
    return res.status(400).json({ success: false, message: 'Invalid OTP or details' });
  }
  if (otpData.expires < Date.now()) {
    delete otpStore[mobile];
    writeStore(OTP_FILE, otpStore);
    return res.status(400).json({ success: false, message: 'OTP expired' });
  }
  // Read user store
  const userStore = readStore(USER_FILE);
  if (userStore[email] || Object.values(userStore).some(u => u.mobile === mobile)) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  userStore[email] = { name, email, mobile, password: hashedPassword };
  writeStore(USER_FILE, userStore);
  delete otpStore[mobile];
  writeStore(OTP_FILE, otpStore);
  // Create JWT (for demo, use a static secret)
  const token = jwt.sign({ email }, 'demo_secret', { expiresIn: '7d' });
  res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=604800`);
  return res.status(200).json({ success: true, user: { name, email, mobile } });
}
