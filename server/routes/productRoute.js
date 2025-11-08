import express from 'express';
import { upload } from '../configs/multer.js';
import authSeller from '../middlewares/authSeller.js';
import Product from '../models/productModel.js';
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

const productRouter = express.Router();

// List all products (public)
productRouter.get('/list', productList);
productRouter.get('/id', productById);

// Protected seller routes
productRouter.post('/add', upload.array(["images"]), authSeller, addProduct);
productRouter.post('/stock', authSeller, changeStock);
productRouter.post('/edit', upload.array(["images"]), authSeller, editProduct);

// Delete routes (both for compatibility)
productRouter.delete('/delete/:id', authSeller, deleteProduct);
productRouter.delete('/remove/:id', authSeller, deleteProduct);

// Display order routes
productRouter.get('/display-order', authSeller, getProductDisplayOrder);
productRouter.post('/update-order', authSeller, updateProductDisplayOrder);
productRouter.post('/best-seller', authSeller, toggleBestSeller);

// ✅ IMPORTANT: Toggle stock - specific route before reorder
productRouter.post('/toggle-stock/:id', authSeller, async (req, res) => {
  try {
    const { id } = req.params;
    const { available } = req.body;
    
    console.log('Toggle stock:', { id, available });
    
    const product = await Product.findByIdAndUpdate(
      id, 
      { available, inStock: available }, 
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, message: 'Stock status updated', product });
  } catch (error) {
    console.error('Toggle stock error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ IMPORTANT: Reorder route - must be AFTER toggle-stock
productRouter.post('/reorder', authSeller, async (req, res) => {
  try {
    const { orders } = req.body;
    
    console.log('Reorder request received:', orders);
    
    if (!orders || !Array.isArray(orders)) {
      return res.status(400).json({ success: false, message: 'Invalid orders data' });
    }
    
    const updatePromises = orders.map((item) => 
      Product.findByIdAndUpdate(
        item.id, 
        { display_order: item.display_order },
        { new: true }
      )
    );
    
    await Promise.all(updatePromises);
    
    console.log('Products reordered successfully');
    res.json({ success: true, message: 'Product order updated successfully' });
  } catch (error) {
    console.error('Reorder error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default productRouter;