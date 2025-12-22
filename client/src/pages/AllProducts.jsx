import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import './AllProducts.css';

const AllProducts = () => {
    const { products, categories, currency, addToCart, user, setShowUserLogin } = useAppContext()
    const navigate = useNavigate()
    const [filteredProducts, setFilteredProducts] = useState([])
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [selectedVariant, setSelectedVariant] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        let filtered = products.filter((p) => p.inStock)

        if (selectedCategory !== "All") {
            filtered = filtered.filter((p) => p.category?.name === selectedCategory)
        }

        if (searchQuery.trim()) {
            filtered = filtered.filter((p) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        setFilteredProducts(filtered)
    }, [selectedCategory, products, searchQuery])

    const openProductPopup = (product) => {
        setSelectedProduct(product)
        setSelectedVariant(product.variants?.[0] || null)
        document.body.style.overflow = 'hidden'
    }

    const closeProductPopup = () => {
        setSelectedProduct(null)
        setSelectedVariant(null)
        document.body.style.overflow = 'unset'
    }

    const handleQuickAddToCart = (e, product) => {
        e.stopPropagation();
        if (!user) {
            setShowUserLogin(true);
            return;
        }
        const variantIndex = 0;
        addToCart(`${product._id}|${variantIndex}`);
    };

    const handleQuickBuyNow = (e, product) => {
        e.stopPropagation();
        if (!user) {
            setShowUserLogin(true);
            return;
        }
        const variantIndex = 0;
        addToCart(`${product._id}|${variantIndex}`);
        document.body.style.overflow = 'unset';
        navigate('/cart');
    };

    const handleAddToCart = () => {
        if (!user) {
            setShowUserLogin(true);
            return;
        }
        if (selectedProduct && selectedVariant) {
            const variantIndex = selectedProduct.variants.indexOf(selectedVariant);
            addToCart(`${selectedProduct._id}|${variantIndex}`)
            closeProductPopup()
        }
    }

    const handleBuyNow = () => {
        if (!user) {
            setShowUserLogin(true);
            return;
        }
        if (selectedProduct && selectedVariant) {
            const variantIndex = selectedProduct.variants.indexOf(selectedVariant)
            addToCart(`${selectedProduct._id}|${variantIndex}`)
            // ✅ Reset body overflow before navigation
            document.body.style.overflow = 'unset'
            navigate('/cart')
        }
    }

    // ✅ Also reset overflow when component unmounts
    useEffect(() => {
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [])

    return (
        <div className="min-h-screen bg-gray-100 md:bg-gray-50 md:py-4 md:px-2">
            <div className="w-full mx-auto">
                {/* Header - Mobile Optimized */}
                <div className="bg-white md:rounded-lg shadow-sm mb-3 md:mb-6 sticky top-14 md:top-0 z-10">
                    <div className="p-4 md:p-6">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 md:gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-1 md:mb-2">
                                    நம்ம Products
                                </h1>
                                <p className="text-sm md:text-base text-gray-600">Greens delivered to your door 🌿</p>
                            </div>

                            {/* Search Bar - Android Material Style */}
                            <div className="relative w-full lg:w-96">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2.5 md:py-3 border border-gray-300 rounded-full md:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm text-sm md:text-base"
                                />
                                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Pills - Mobile Dropdown, Desktop Horizontal Scroll */}
                <div className="bg-white md:rounded-lg shadow-sm mb-3 md:mb-6 overflow-hidden">
                    {/* MOBILE ONLY - Dropdown Selector */}
                    <div className="md:hidden p-3">
                        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">📂 Select Category</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 text-gray-800 font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm appearance-none cursor-pointer"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23059669'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.75rem center',
                                backgroundSize: '1.5em 1.5em',
                                paddingRight: '2.5rem'
                            }}
                        >
                            <option value="All">🌟 All Products</option>
                            {categories.filter(cat => ['Vegetables', 'Fruits', 'Greens', 'Fresh Farm', 'Bundle packages'].includes(cat.name)).map((cat) => (
                                <option key={cat._id} value={cat.name}>
                                    {cat.name === 'Fresh Farm' ? 'Greens' : cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* DESKTOP ONLY - Horizontal Scroll Pills */}
                    <div className="hidden md:block overflow-x-auto scrollbar-hide">
                        <div className="flex gap-2 p-4 whitespace-nowrap">
                            <button
                                onClick={() => setSelectedCategory("All")}
                                className={`px-5 py-2 rounded-full font-medium text-sm transition-all shadow-sm ${selectedCategory === "All"
                                    ? "bg-primary text-white shadow-lg scale-105"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95"
                                    }`}
                            >
                                All Products
                            </button>
                            {categories.filter(cat => ['Vegetables', 'Fruits', 'Greens', 'Fresh Farm', 'Bundle packages'].includes(cat.name)).map((cat) => (
                                <button
                                    key={cat._id}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    className={`px-5 py-2 rounded-full font-medium text-sm transition-all shadow-sm ${selectedCategory === cat.name
                                        ? "bg-primary text-white shadow-lg scale-105"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95"
                                        }`}
                                >
                                    {cat.name === 'Fresh Farm' ? 'Greens' : cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Products Grid - MOBILE OPTIMIZED WITH BREATHING SPACE */}
                {filteredProducts.length === 0 ? (
                    <div className="bg-white rounded-lg md:shadow-sm p-12 md:p-20 text-center mx-3 md:mx-0">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-xl font-semibold text-gray-700 mb-2">No products found</p>
                        <p className="text-gray-500">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 p-3 md:p-0">
                        {filteredProducts.map((product) => (
                            <div
                                key={product._id}
                                onClick={() => openProductPopup(product)}
                                className="bg-white rounded-2xl md:rounded-lg shadow-md md:shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group active:scale-95"
                                style={{
                                    boxShadow: window.innerWidth < 768
                                        ? '0 2px 8px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06)'
                                        : undefined
                                }}
                            >
                                {/* Product Image with Badge */}
                                <div className="relative">
                                    <img
                                        src={product.image[0]}
                                        alt={product.name}
                                        className="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {product.isBestSeller && (
                                        <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 md:px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span className="hidden md:inline">Best</span>
                                        </div>
                                    )}
                                </div>

                                {/* Product Info - MOBILE OPTIMIZED PADDING */}
                                <div className="p-3 md:p-4">
                                    <h3 className="font-semibold text-gray-800 text-sm md:text-base mb-2 line-clamp-2 leading-snug">
                                        {product.name}
                                    </h3>

                                    {/* Price & Weight */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <p className="text-xs text-gray-500 line-through">{currency}{product.variants[0].price}</p>
                                            <p className="text-lg md:text-xl font-bold text-primary">
                                                {currency}{product.variants[0].offerPrice}
                                            </p>
                                        </div>
                                        <div className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-medium">
                                            {product.variants[0].weight} {product.variants[0].unit}
                                        </div>
                                    </div>

                                    {/* Quick Action Buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => handleQuickAddToCart(e, product)}
                                            className="flex-1 py-2 md:py-2.5 bg-white border-2 border-primary text-primary text-xs md:text-sm font-semibold rounded-lg md:rounded-xl hover:bg-green-50 active:scale-95 transition-all flex items-center justify-center gap-1 shadow-sm"
                                            title="Add to Cart"
                                        >
                                            <span className="md:hidden">Add</span>
                                            <span className="hidden md:inline">Add 🛒</span>
                                        </button>
                                        <button
                                            onClick={(e) => handleQuickBuyNow(e, product)}
                                            className="flex-1 py-2 md:py-2.5 bg-gradient-to-r from-primary to-primary-dull text-white text-xs md:text-sm font-semibold rounded-lg md:rounded-xl hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1 shadow-md"
                                            title="Buy Now"
                                        >
                                            <span className="md:hidden">Buy</span>
                                            <span className="hidden md:inline">Buy ⚡</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ✅ Flip Animation Popup */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
                    <div
                        className="absolute inset-0"
                        onClick={closeProductPopup}
                    ></div>

                    <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-lg animate-flipIn">
                        <button
                            onClick={closeProductPopup}
                            className="absolute top-4 right-4 p-2 bg-white hover:bg-gray-100 rounded-full shadow-lg z-10"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="grid md:grid-cols-2 gap-6 p-6">
                            {/* Product Images */}
                            <div className="space-y-3">
                                <div className="bg-gray-100 rounded-lg overflow-hidden">
                                    <img
                                        src={selectedProduct.image[0]}
                                        alt={selectedProduct.name}
                                        className="w-full h-80 object-cover"
                                    />
                                </div>

                                {selectedProduct.image.length > 1 && (
                                    <div className="grid grid-cols-4 gap-2">
                                        {selectedProduct.image.map((img, idx) => (
                                            <div key={idx} className="bg-gray-100 rounded overflow-hidden">
                                                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-16 object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Product Details */}
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                        {selectedProduct.name}
                                    </h2>
                                    <div className="flex items-center gap-1">
                                        {Array(5).fill('').map((_, i) => (
                                            <svg key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                        <span className="text-sm text-gray-600 ml-2">(4 reviews)</span>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                    <div className="flex items-baseline gap-3">
                                        <p className="text-sm text-gray-600 line-through">{currency}{selectedVariant?.price}</p>
                                        <p className="text-3xl font-bold text-primary">
                                            {currency}{selectedVariant?.offerPrice}
                                        </p>
                                    </div>
                                    <p className="text-green-600 font-medium mt-1">
                                        Save {currency}{selectedVariant ? (selectedVariant.price - selectedVariant.offerPrice) : 0}
                                    </p>
                                </div>

                                {/* Variant Selector */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Variant</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {selectedProduct.variants.map((variant, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedVariant(variant)}
                                                className={`p-3 rounded-lg font-medium transition border-2 ${selectedVariant === variant
                                                    ? 'bg-primary text-white border-primary'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                                                    }`}
                                            >
                                                <div className="text-base">{variant.weight} {variant.unit}</div>
                                                <div className="text-sm">{currency}{variant.offerPrice}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">About this product</h3>
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                        <ul className="space-y-1 text-sm text-gray-700">
                                            {Array.isArray(selectedProduct.description) ? (
                                                selectedProduct.description.map((desc, idx) => (
                                                    <li key={idx} className="flex items-start gap-2">
                                                        <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        <span>{desc}</span>
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="flex items-start gap-2">
                                                    <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span>{selectedProduct.description}</span>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {/* Action Buttons - Sticky on Mobile */}
                                <div className="sticky bottom-0 -mx-6 -mb-6 p-4 bg-white border-t border-gray-100 md:static md:border-none md:p-0 md:mx-0 md:mb-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:shadow-none">
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleAddToCart}
                                            className="flex-1 py-3 bg-white border-2 border-primary text-primary font-semibold rounded-lg hover:bg-gray-50 transition active:scale-95"
                                        >
                                            🛒 Add to Cart
                                        </button>
                                        <button
                                            onClick={handleBuyNow}
                                            className="flex-1 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dull transition active:scale-95 shadow-md"
                                        >
                                            ⚡ Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AllProducts
