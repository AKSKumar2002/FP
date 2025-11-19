export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      // Your reset password logic here
      const { email } = req.body;
      
      // TODO: Implement your password reset logic
      
      res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }