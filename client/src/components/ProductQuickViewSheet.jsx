import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Heart, Share2, Star } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import MobileProductCard from './MobileProductCard';

const ProductQuickViewSheet = () => {
    const {
        selectedQuickProduct,
        setSelectedQuickProduct,
        currency,
        addToCart,
        user,
        setShowUserLogin,
        products
    } = useAppContext();

    const [quantity, setQuantity] = useState(1);
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

    const scrollRef = React.useRef(null);

    useEffect(() => {
        if (selectedQuickProduct) {
            setQuantity(1);
            setSelectedVariantIndex(0);
            document.body.style.overflow = 'hidden';
            if (scrollRef.current) scrollRef.current.scrollTop = 0;
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [selectedQuickProduct]);

    if (!selectedQuickProduct) return null;

    const variant = selectedQuickProduct.variants[selectedVariantIndex];
    const savings = Math.round(((variant.price - variant.offerPrice) / variant.price) * 100);

    const handleAddToCart = () => {
        if (!user) {
            setShowUserLogin(true);
            return;
        }
        for (let i = 0; i < quantity; i++) {
            addToCart(`${selectedQuickProduct._id}|${selectedVariantIndex}`);
        }
        setSelectedQuickProduct(null);
    };

    // Recommendations logic
    const recommendations = products
        .filter(p => p.category?._id === selectedQuickProduct.category?._id && p._id !== selectedQuickProduct._id)
        .slice(0, 4);

    return (
        <AnimatePresence>
            {selectedQuickProduct && (
                <div className="fixed inset-0 z-[1000] flex items-end justify-center">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedQuickProduct(null)}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-lg bg-white rounded-t-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
                    >
                        {/* Drag Handle */}
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 mb-2 flex-shrink-0" />

                        {/* Sticky Header with Close Button */}
                        <div className="absolute top-6 right-6 z-20">
                            <button
                                onClick={() => setSelectedQuickProduct(null)}
                                className="w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-400 hover:text-gray-800 transition-colors border border-gray-100"
                            >
                                <X size={20} strokeWidth={3} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto pb-40 px-6 scroll-smooth">
                            {/* Product Image Section */}
                            <div className="relative pt-4 pb-8 flex items-center justify-center min-h-[300px] group">
                                {savings > 0 && (
                                    <div className="absolute top-4 left-0 bg-green-500 text-white font-black px-4 py-2 rounded-r-2xl text-xs z-10 shadow-lg shadow-green-100">
                                        {savings}% Save
                                    </div>
                                )}
                                <motion.img
                                    key={selectedQuickProduct._id}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    src={selectedQuickProduct.image[0]}
                                    alt={selectedQuickProduct.name}
                                    className="max-h-72 object-contain drop-shadow-2xl"
                                />
                            </div>

                            {/* Product Info */}
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 leading-tight">
                                        {selectedQuickProduct.name}
                                    </h2>
                                    <div className="flex items-center gap-4 mt-3">
                                        <div className="flex flex-col">
                                            <span className="text-4xl font-black text-gray-900 tracking-tight">
                                                {currency}{variant.offerPrice}
                                            </span>
                                            {savings > 0 && (
                                                <span className="text-sm text-gray-400 font-bold line-through">
                                                    {currency}{variant.price}
                                                </span>
                                            )}
                                        </div>
                                        <div className="bg-gray-100 px-3 py-1.5 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-200">
                                            5.8K+ Sold
                                        </div>
                                    </div>
                                </div>

                                {/* Variant Selection */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Select Unit</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedQuickProduct.variants.map((v, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedVariantIndex(i)}
                                                className={`px-4 py-3 rounded-2xl font-black text-xs transition-all border-2 ${selectedVariantIndex === i ? 'border-primary bg-primary text-white shadow-lg shadow-green-100' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
                                            >
                                                {v.weight} {v.unit}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* More Details Section */}
                                <div className="space-y-2">
                                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">More Details</h3>
                                    <p className="text-sm text-gray-500 font-medium leading-relaxed italic">
                                        {selectedQuickProduct.description || "Freshly picked and delivered to your doorstep. Guaranteed quality and taste."}
                                    </p>
                                </div>

                                {/* Our Pick for you Section */}
                                {recommendations.length > 0 && (
                                    <div className="pt-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-base font-black text-gray-900">Our Pick for you</h3>
                                            <button className="text-gray-400 font-bold px-2">...</button>
                                        </div>
                                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
                                            {recommendations.map(p => (
                                                <div key={p._id} className="w-[150px] flex-shrink-0">
                                                    <MobileProductCard product={p} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Fixed Bottom Action Bar */}
                        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 px-6 py-6 pb-10 flex gap-4 items-center z-30 shadow-[0_-20px_40px_rgba(0,0,0,0.08)]">
                            {/* Quantity Selector */}
                            <div className="flex items-center bg-gray-100 rounded-[1.5rem] p-1.5 border border-gray-200 h-[60px]">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 bg-white shadow-sm active:scale-90 transition-all"
                                >
                                    <Minus size={20} strokeWidth={3} />
                                </button>
                                <span className="w-10 text-center font-black text-gray-900 text-lg">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 bg-white shadow-sm active:scale-90 transition-all"
                                >
                                    <Plus size={20} strokeWidth={3} />
                                </button>
                            </div>

                            {/* Add Button */}
                            <motion.button
                                whileTap={{ scale: 0.96 }}
                                onClick={handleAddToCart}
                                className="flex-1 h-[60px] bg-gradient-to-r from-primary to-emerald-600 text-white rounded-[1.5rem] font-black text-base shadow-xl shadow-green-200 flex items-center justify-center gap-2 group tracking-tight"
                            >
                                Add Item — ({currency}{(variant.offerPrice * quantity).toFixed(0)})
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProductQuickViewSheet;
