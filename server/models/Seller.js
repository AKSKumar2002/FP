import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'seller'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Seller = mongoose.model('Seller', sellerSchema);
export default Seller;
