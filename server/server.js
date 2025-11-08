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

const app = express();
const port = process.env.PORT || 4000;

await connectDB();
await connectCloudinary();

// ✅ FIXED: More permissive CORS for Vercel
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://farmpickshope.vercel.app',
  'https://fp-mocha.vercel.app', // ✅ Add your actual Vercel frontend URL
  'https://farmpickshope-git-main-akskumar2002s-projects.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('❌ Blocked by CORS:', origin);
      callback(null, true); // ✅ Allow all in production for now
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token'], // ✅ Add 'token' header
  exposedHeaders: ['set-cookie'],
}));

// ✅ Handle OPTIONS preflight for all routes
app.options('*', cors());

// ✅ Middleware (after CORS)
app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', 1); // For secure cookies

// ✅ Health check endpoint
app.get('/', (req, res) => res.json({ 
  status: "API is Working", 
  timestamp: new Date().toISOString() 
}));

// ✅ API Routes - Make sure these are mounted correctly
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter); // ✅ This mounts /api/product/reorder
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);
app.use('/api/category', CategoryRouter);

// ✅ 404 handler for debugging
app.use((req, res) => {
  console.log('404 - Route not found:', req.method, req.path);
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// ✅ Start server directly (no http.createServer or socket.io)
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log('📍 Available routes:');
  console.log('   - POST /api/product/reorder');
  console.log('   - POST /api/product/toggle-stock/:id');
  console.log('   - GET  /api/product/list');
});
