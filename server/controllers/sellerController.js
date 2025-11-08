import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Seller from '../models/Seller.js'; // ✅ Add .js extension and proper path

// Login Seller : /api/seller/login
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email }); // Debug
    
    // Find seller
    const seller = await Seller.findOne({ email });
    
    if (!seller) {
      console.log('Seller not found:', email);
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, seller.password);
    
    if (!isMatch) {
      console.log('Invalid password for:', email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Create token with role
    const token = jwt.sign(
      { 
        id: seller._id, 
        role: 'seller',
        email: seller.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log('✅ Login successful for:', seller.email);
    
    res.json({
      success: true,
      token,
      message: 'Login successful',
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email
      }
    });
  } catch (error) {
    console.error('❌ Seller login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Seller isAuth : /api/seller/is-auth
export const isSellerAuth = async (req, res) => {
    try {
        return res.json({ success: true });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Logout Seller : /api/seller/logout

export const sellerLogout = async (req, res) => {
    try {
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({ success: true, message: "Logged Out" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}