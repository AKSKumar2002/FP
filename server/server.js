import cookieParser from 'cookie-parser';
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
import CategoryRouter from './routes/CategoryRoute.js';

// ✅ NEW: Import http & socket.io
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const port = process.env.PORT || 4000;

// ✅ Connect your DB & Cloudinary
await connectDB();
await connectCloudinary();

// ✅ Allow multiple origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://farmpickshope.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', 1);

// ✅ Basic API route
app.get('/', (req, res) => res.send("API is Working"));

// ✅ Attach your routes
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);
app.use('/api/category', CategoryRouter);

// ✅ NEW: Create HTTP server & attach Socket.IO
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

// ✅ Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('🔗 A client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ A client disconnected:', socket.id);
  });
});

// ✅ Start server
server.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
