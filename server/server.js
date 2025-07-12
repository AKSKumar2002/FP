import cookieParser from 'cookie-parser';
import Location from './models/Location.js';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';

const app = express();
const port = process.env.PORT || 4000;

await connectDB();
await connectCloudinary();

// Allow multiple origins
const allowedOrigins = ['http://localhost:5173', 'https://farm-pick-v1.vercel.app'];

// Middleware configuration
app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', 1); // Required for secure cookies on Vercel/Heroku etc.
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Routes
app.get('/', (req, res) => res.send("API is Working"));

app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

// ✅ New Location Route with DB Save + Validation
app.post('/api/location', async (req, res) => {
  const { location } = req.body;

  if (!location || location.trim().length < 2) {
    return res.status(400).json({ message: 'Invalid location provided' });
  }

  try {
    const newLocation = new Location({ location: location.trim() });
    await newLocation.save();
    res.status(201).json({ message: 'Location saved to database' });
  } catch (error) {
    console.error('Error saving location:', error);
    res.status(500).json({ message: 'Server error while saving location' });
  }
});
