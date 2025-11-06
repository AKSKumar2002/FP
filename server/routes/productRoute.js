import express from 'express';
import { upload } from '../configs/multer.js';
import authSeller from '../middlewares/authSeller.js';
import { addProduct, changeStock, productById, productList, editProduct, deleteProduct, getPopularProducts, incrementOrderCount, setProductOrder, bulkSetProductOrder } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post('/add', upload.array(["images"]), authSeller, addProduct);
productRouter.get('/list', productList);
productRouter.get('/popular', getPopularProducts); // ✅ New route
productRouter.get('/id', productById);
productRouter.post('/stock', authSeller, changeStock);
productRouter.post('/increment-order', incrementOrderCount); // ✅ New route
productRouter.post('/set-order', authSeller, setProductOrder); // ✅ New route
productRouter.post('/bulk-set-order', authSeller, bulkSetProductOrder); // ✅ New route
productRouter.post('/edit', upload.array(["images"]), authSeller, editProduct);
productRouter.delete('/delete/:id', authSeller, deleteProduct);

export default productRouter;