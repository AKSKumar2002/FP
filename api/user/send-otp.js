// Vercel serverless function for sending OTP
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  const { name, email, mobile } = req.body;
  if (!name || !email || !mobile) {
    return res.status(400).json({ success: false, message: 'Missing Details' });
  }
  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // For demo: print OTP to Vercel logs
  console.log(`OTP for ${mobile}: ${otp}`);
  // TODO: Integrate with SMS API here
  // You may want to store the OTP in a database or cache for verification
  // For demo, return OTP in response (remove in production)
  return res.status(200).json({ success: true, message: 'OTP sent to mobile (check logs for demo)', otp });
}
