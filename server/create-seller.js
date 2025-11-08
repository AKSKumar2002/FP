import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const createSeller = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const sellerSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      createdAt: Date
    });

    const Seller = mongoose.model('Seller', sellerSchema);

    // Check if seller already exists
    const existing = await Seller.findOne({ email: 'admin@farmpicks.com' });
    if (existing) {
      console.log('⚠️  Seller already exists');
      process.exit(0);
    }

    // Create new seller
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const seller = await Seller.create({
      name: 'Admin Seller',
      email: 'admin@farmpicks.com',
      password: hashedPassword,
      role: 'seller',
      createdAt: new Date()
    });

    console.log('✅ Seller created successfully!');
    console.log('📧 Email:', seller.email);
    console.log('🔑 Password: admin123');
    console.log('👤 Name:', seller.name);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createSeller();
