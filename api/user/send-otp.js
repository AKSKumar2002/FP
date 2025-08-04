
// In-memory OTP store (for demo only, resets on every deployment)
const otpStore = {};

export default async function handler(req, res) {
  try {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*'); // Change to your frontend URL in production
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { name, email, mobile } = req.body;
    if (!name || !email || !mobile) {
      return res.status(400).json({ success: false, message: 'Missing Details' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[mobile] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
      name,
      email
    };
    console.log(`OTP for ${mobile}: ${otp}`);
    // TODO: Integrate with SMS API here
    return res.status(200).json({ success: true, message: 'OTP sent to mobile (check logs for demo)' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
