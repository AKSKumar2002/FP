import express from 'express';
import { upload } from '../configs/multer.js';
import authSeller from '../middlewares/authSeller.js';
<<<<<<< HEAD
import { 
  addProduct, 
  changeStock, 
  productById, 
  productList, 
  editProduct, 
  deleteProduct,
  getProductDisplayOrder,
  updateProductDisplayOrder,
  toggleBestSeller
} from '../controllers/productController.js';
=======
import { addProduct, changeStock, productById, productList, editProduct, deleteProduct, getPopularProducts, incrementOrderCount, setProductOrder, bulkSetProductOrder } from '../controllers/productController.js';
>>>>>>> c1f506592b4b4e358822e21395dc780ca502b16a

const productRouter = express.Router();

productRouter.post('/add', upload.array(["images"]), authSeller, addProduct);
productRouter.get('/list', productList);
<<<<<<< HEAD
productRouter.get('/id', productById);
productRouter.post('/stock', authSeller, changeStock);
=======
productRouter.get('/popular', getPopularProducts); // ✅ New route
productRouter.get('/id', productById);
productRouter.post('/stock', authSeller, changeStock);
productRouter.post('/increment-order', incrementOrderCount); // ✅ New route
productRouter.post('/set-order', authSeller, setProductOrder); // ✅ New route
productRouter.post('/bulk-set-order', authSeller, bulkSetProductOrder); // ✅ New route
>>>>>>> c1f506592b4b4e358822e21395dc780ca502b16a
productRouter.post('/edit', upload.array(["images"]), authSeller, editProduct);
productRouter.delete('/delete/:id', authSeller, deleteProduct);
productRouter.get('/display-order', authSeller, getProductDisplayOrder);
productRouter.post('/update-order', authSeller, updateProductDisplayOrder);
productRouter.post('/best-seller', authSeller, toggleBestSeller);

export default productRouter;