import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
    minlength: 2,
    trim: true,
  },
  savedAt: {
    type: Date,
    default: Date.now,
  },
});

const Location = mongoose.model('Location', locationSchema);
export default Location;
