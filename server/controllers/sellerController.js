import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Seller from '../models/Seller'; // Assuming Seller model is in models folder

// Login Seller : /api/seller/login

export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find seller
    const seller = await Seller.findOne({ email });
    
    if (!seller) {
      return res.json({ success: false, message: 'Seller not found' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, seller.password);
    
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }
    
    // Create token with role
    const token = jwt.sign(
      { 
        id: seller._id, 
        role: 'seller', // Make sure this is included
        email: seller.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log('Generated token for seller:', seller.email); // Debug
    
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
    console.error('Seller login error:', error);
    res.json({ success: false, message: error.message });
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