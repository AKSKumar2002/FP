import { v2 as cloudinary } from "cloudinary"
import Product from "../models/Product.js"

// Add Product : /api/product/add
export const addProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData)

        const images = req.files

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url
            })
        )

        await Product.create({ ...productData, image: imagesUrl })



        res.json({ success: true, message: "Product Added" })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Get Product : /api/product/list
export const productList = async (req, res) => {
  try {
    const products = await Product.find({}).populate("category");
    res.json({ success: true, products });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


// Get single Product : /api/product/id
export const productById = async (req, res) => {
    try {
        const { id } = req.body
        const product = await Product.findById(id)
        res.json({ success: true, product })
    } catch (error) {
        console.log(error.message);

        res.json({ success: false, message: error.message })
    }
}

// Change Product inStock : /api/product/stock
export const changeStock = async (req, res) => {
    try {
        const { id, inStock } = req.body
        await Product.findByIdAndUpdate(id, { inStock })
        res.json({ success: true, message: "Stock Updated" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Add in productController.js

// Edit Product : /api/product/edit
export const editProduct = async (req, res) => {
  try {
    const { id } = req.body;
    let productData = JSON.parse(req.body.productData);
    const images = req.files;

    let imagesUrl = [];

    // If new images uploaded, upload to Cloudinary
    if (images && images.length > 0) {
      imagesUrl = await Promise.all(
        images.map(async (item) => {
          let result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
    }

    if (imagesUrl.length > 0) {
      productData.image = imagesUrl;
    }

    await Product.findByIdAndUpdate(id, productData);

    res.json({ success: true, message: "Product Updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


// Add in productController.js

// Delete Product : /api/product/delete/:id
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ success: true, message: "Product Deleted" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

<<<<<<< HEAD
// Get Product Display Order : /api/product/display-order
export const getProductDisplayOrder = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .sort({ displayOrder: 1, createdAt: -1 });
=======
// Get Popular Products : /api/product/popular
export const getPopularProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const products = await Product.find({ inStock: true })
      .populate("category")
      .sort({ displayOrder: 1, orderCount: -1 }) // ✅ Sort by displayOrder first, then orderCount
      .limit(limit);
>>>>>>> c1f506592b4b4e358822e21395dc780ca502b16a
    res.json({ success: true, products });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

<<<<<<< HEAD
// Update Product Display Order : /api/product/update-order
export const updateProductDisplayOrder = async (req, res) => {
  try {
    const { orders } = req.body; // Array of { id, displayOrder }
    
    if (!Array.isArray(orders)) {
      return res.json({ success: false, message: "Invalid data format" });
    }

    // Update all products in parallel
    await Promise.all(
      orders.map(({ id, displayOrder }) =>
        Product.findByIdAndUpdate(id, { displayOrder })
      )
    );

    res.json({ success: true, message: "Display order updated successfully" });
=======
// Increment Order Count : /api/product/increment-order
export const incrementOrderCount = async (req, res) => {
  try {
    const { productIds } = req.body; // Array of product IDs
    
    if (!productIds || !Array.isArray(productIds)) {
      return res.json({ success: false, message: "Invalid product IDs" });
    }

    await Product.updateMany(
      { _id: { $in: productIds } },
      { $inc: { orderCount: 1 } }
    );

    res.json({ success: true, message: "Order count updated" });
>>>>>>> c1f506592b4b4e358822e21395dc780ca502b16a
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

<<<<<<< HEAD
// Toggle Best Seller Status
export const toggleBestSeller = async (req, res) => {
    try {
        const { id, isBestSeller } = req.body;
        await Product.findByIdAndUpdate(id, { isBestSeller });
        res.json({ 
            success: true, 
            message: isBestSeller ? "Added to Best Sellers" : "Removed from Best Sellers" 
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
=======
// Set Product Display Order : /api/product/set-order
export const setProductOrder = async (req, res) => {
  try {
    const { productId, displayOrder } = req.body;

    if (!productId || displayOrder === undefined) {
      return res.json({ success: false, message: "Product ID and display order are required" });
    }

    await Product.findByIdAndUpdate(productId, { displayOrder: parseInt(displayOrder) });

    res.json({ success: true, message: "Product order updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Bulk Set Product Display Order : /api/product/bulk-set-order
export const bulkSetProductOrder = async (req, res) => {
  try {
    const { orders } = req.body; // [{ productId, displayOrder }, ...]

    if (!orders || !Array.isArray(orders)) {
      return res.json({ success: false, message: "Invalid orders data" });
    }

    const bulkOps = orders.map(({ productId, displayOrder }) => ({
      updateOne: {
        filter: { _id: productId },
        update: { displayOrder: parseInt(displayOrder) }
      }
    }));

    await Product.bulkWrite(bulkOps);

    res.json({ success: true, message: "Product orders updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
>>>>>>> c1f506592b4b4e358822e21395dc780ca502b16a
};


