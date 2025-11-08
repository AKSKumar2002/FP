import express from 'express';
import { sellerLogin, isSellerAuth, sellerLogout } from '../controllers/sellerController.js';
import authSeller from '../middlewares/authSeller.js';

const sellerRouter = express.Router();

// ✅ Login route
sellerRouter.post('/login', sellerLogin);

// ✅ Check auth
sellerRouter.get('/is-auth', authSeller, isSellerAuth);

// ✅ Logout
sellerRouter.get('/logout', sellerLogout);

export default sellerRouter;