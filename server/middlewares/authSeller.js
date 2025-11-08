import jwt from 'jsonwebtoken';

const authSeller = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user is a seller
    if (decoded.role !== 'seller' && decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Sellers only.' });
    }

    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

export default authSeller;