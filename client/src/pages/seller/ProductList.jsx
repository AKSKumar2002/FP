import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ProductList = () => {
    const { products, currency, axios, fetchProducts, categories } = useAppContext()

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [filterCategories] = useState(['All', 'Vegetables', 'Fruits', 'Bundle packages', 'Dairy products', 'Fresh Farm', 'Greens', 'Agro']);

    const handleEdit = (product) => {
        setEditingProduct({
            ...product,
            category: product.category?._id || product.category,
            description: Array.isArray(product.description) ? product.description : [product.description]
        });
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            const { data } = await axios.delete(`/api/product/delete/${id}`);
            if (data.success) {
                toast.success(data.message);
                fetchProducts();
            } else {
                toast.error(data.message);
            }
        }
    };

    const toggleStock = async (id, inStock) => {
        try {
            const { data } = await axios.post('/api/product/stock', { id, inStock });
            if (data.success) {
                fetchProducts();
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const toggleBestSeller = async (id, isBestSeller) => {
        try {
            const { data } = await axios.post('/api/product/best-seller', { id, isBestSeller });
            if (data.success) {
                fetchProducts();
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleEditSubmit = async () => {
        const formData = new FormData();
        formData.append("productData", JSON.stringify(editingProduct));
        formData.append("id", editingProduct._id);
        if (editingProduct.newImages) {
            for (let i = 0; i < editingProduct.newImages.length; i++) {
                formData.append("images", editingProduct.newImages[i]);
            }
        }

        const { data } = await axios.post(
            "/api/product/edit",
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );

        if (data.success) {
            toast.success(data.message);
            fetchProducts();
            setIsEditModalOpen(false);
            setEditingProduct(null);
        } else {
            toast.error(data.message);
        }
    };

    const addVariant = () => {
        setEditingProduct({
            ...editingProduct,
            variants: [...editingProduct.variants, { weight: '', unit: 'gm', price: '', offerPrice: '' }]
        });
    };

    const removeVariant = (index) => {
        if (editingProduct.variants.length === 1) {
            toast.error('At least one variant is required');
            return;
        }
        const newVariants = editingProduct.variants.filter((_, i) => i !== index);
        setEditingProduct({ ...editingProduct, variants: newVariants });
    };

    const updateVariant = (index, field, value) => {
        const newVariants = [...editingProduct.variants];
        newVariants[index][field] = value;
        setEditingProduct({ ...editingProduct, variants: newVariants });
    };

    // Filter products based on selected category
    const filteredProducts = selectedCategory === 'All' 
        ? products 
        : products.filter(product => {
            const categoryName = product.category?.name?.toLowerCase() || '';
            const selectedLower = selectedCategory.toLowerCase();
            return categoryName.includes(selectedLower) || categoryName === selectedLower;
        });

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
            <div className="w-full p-6 md:p-10">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">All Products</h1>
                    <p className="text-gray-500">Manage your product inventory and stock status</p>
                </div>

                {/* Category Filter Tabs */}
                <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {filterCategories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                                selectedCategory === category
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {category}
                            <span className="ml-2 text-xs opacity-75">
                                ({category === 'All' 
                                    ? products.length 
                                    : products.filter(p => {
                                        const catName = p.category?.name?.toLowerCase() || '';
                                        const filterLower = category.toLowerCase();
                                        return catName.includes(filterLower) || catName === filterLower;
                                    }).length})
                            </span>
                        </button>
                    ))}
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Best Seller
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        In Stock
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                </svg>
                                                <p className="text-lg font-medium mb-1">No products yet</p>
                                                <p className="text-sm">Add your first product to get started</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                                                        <img 
                                                            src={product.image[0]} 
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {product.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {product.variants?.length || 0} variant(s)
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                                    {product.category?.name || 'Uncategorized'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => toggleBestSeller(product._id, !product.isBestSeller)}
                                                    className="p-2 hover:bg-yellow-50 rounded-lg transition-colors"
                                                    title={product.isBestSeller ? "Remove from Best Sellers" : "Add to Best Sellers"}
                                                >
                                                    <svg 
                                                        className={`w-6 h-6 ${product.isBestSeller ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                                        fill={product.isBestSeller ? "currentColor" : "none"}
                                                        stroke="currentColor" 
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path 
                                                            strokeLinecap="round" 
                                                            strokeLinejoin="round" 
                                                            strokeWidth={2} 
                                                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
                                                        />
                                                    </svg>
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={product.inStock}
                                                        onChange={() => toggleStock(product._id, !product.inStock)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-primary transition-colors duration-200 relative">
                                                        <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                                                    </div>
                                                    <span className="ml-3 text-sm font-medium text-gray-700">
                                                        {product.inStock ? 'Available' : 'Out of Stock'}
                                                    </span>
                                                </label>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product._id)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Edit Product Modal */}
                {isEditModalOpen && editingProduct && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                            {/* Modal Header */}
                            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
                                    <p className="text-sm text-gray-500 mt-1">Update product information and variants</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsEditModalOpen(false);
                                        setEditingProduct(null);
                                    }}
                                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                                {/* Product Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Product Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={editingProduct.name}
                                        onChange={(e) =>
                                            setEditingProduct({ ...editingProduct, name: e.target.value })
                                        }
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                        placeholder="e.g., Fresh Cauliflower"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Product Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={Array.isArray(editingProduct.description) ? editingProduct.description.join('\n') : editingProduct.description}
                                        onChange={(e) =>
                                            setEditingProduct({
                                                ...editingProduct,
                                                description: e.target.value.split('\n'),
                                            })
                                        }
                                        rows={4}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
                                        placeholder="Enter product description..."
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={editingProduct.category}
                                        onChange={(e) =>
                                            setEditingProduct({ ...editingProduct, category: e.target.value })
                                        }
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors bg-white"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Current Images Preview */}
                                {editingProduct.image && editingProduct.image.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Current Images
                                        </label>
                                        <div className="grid grid-cols-4 gap-3">
                                            {editingProduct.image.map((img, idx) => (
                                                <div key={idx} className="aspect-square bg-gray-100 rounded-lg border-2 border-gray-200 overflow-hidden">
                                                    <img
                                                        src={img}
                                                        alt={`Product ${idx + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Upload New Images */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Upload New Images (Optional)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) =>
                                                setEditingProduct({
                                                    ...editingProduct,
                                                    newImages: Array.from(e.target.files),
                                                })
                                            }
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Upload new images to replace existing ones
                                    </p>
                                </div>

                                {/* Product Variants */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Product Variants <span className="text-red-500">*</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addVariant}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Add Variant
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {editingProduct.variants?.map((variant, index) => (
                                            <div key={index} className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 hover:border-primary/30 transition-colors">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-sm font-semibold text-gray-700">Variant #{index + 1}</span>
                                                    {editingProduct.variants.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeVariant(index)}
                                                            className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Weight/Size</label>
                                                        <input
                                                            type="number"
                                                            value={variant.weight}
                                                            onChange={(e) => updateVariant(index, 'weight', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
                                                            placeholder="500"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Unit</label>
                                                        <select
                                                            value={variant.unit}
                                                            onChange={(e) => updateVariant(index, 'unit', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm bg-white"
                                                        >
                                                            <option value="gm">grams (gm)</option>
                                                            <option value="kg">kilograms (kg)</option>
                                                            <option value="ml">milliliters (ml)</option>
                                                            <option value="ltr">liters (ltr)</option>
                                                            <option value="pcs">pieces (pcs)</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1.5">MRP (₹)</label>
                                                        <input
                                                            type="number"
                                                            value={variant.price}
                                                            onChange={(e) => updateVariant(index, 'price', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
                                                            placeholder="100"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Offer Price (₹)</label>
                                                        <input
                                                            type="number"
                                                            value={variant.offerPrice}
                                                            onChange={(e) => updateVariant(index, 'offerPrice', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
                                                            placeholder="80"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3">
                                <button
                                    onClick={handleEditSubmit}
                                    className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary-dull transition-colors font-semibold shadow-sm hover:shadow-md"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditModalOpen(false);
                                        setEditingProduct(null);
                                    }}
                                    className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductList
