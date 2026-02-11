import React from 'react';
import { useAppContext } from '../context/AppContext';
import { FaPlus, FaHeart } from 'react-icons/fa';

const MobileProductCard = ({ product }) => {
    const { navigate, currency, addToCart, user, setShowUserLogin, setSelectedQuickProduct } = useAppContext();
    const variant = product.variants?.[0];

    // Calculate savings percentage
    const savings = variant ? Math.round(((variant.price - variant.offerPrice) / variant.price) * 100) : 0;

    const handleAdd = (e) => {
        e.stopPropagation();
        if (!user) {
            setShowUserLogin(true);
            return;
        }
        addToCart(`${product._id}|0`);
    };

    return (
        <div
            onClick={() => setSelectedQuickProduct(product)}
            className="flex-shrink-0 w-[160px] bg-white rounded-3xl p-3 shadow-[0_8px_20px_rgba(0,0,0,0.04)] border border-gray-50 relative group active:scale-95 transition-all"
        >
            {/* Savings Badge */}
            {savings > 0 && (
                <div className="absolute top-3 left-3 z-10 bg-green-100 text-green-600 text-[10px] font-bold px-2 py-1 rounded-lg">
                    {savings}% Save
                </div>
            )}

            {/* Wishlist Button */}
            <button className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors shadow-sm">
                <FaHeart size={14} />
            </button>

            {/* Image Container */}
            <div className="h-32 flex items-center justify-center mb-3">
                <img
                    src={product.image[0]}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
            </div>

            {/* Info */}
            <div className="space-y-1">
                <h3 className="text-xs font-bold text-gray-800 truncate">{product.name}</h3>
                <p className="text-[10px] text-gray-400 font-medium">1 unit</p>

                <div className="flex items-center justify-between pt-1">
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-900">{currency}{variant?.offerPrice || 0}</span>
                        {savings > 0 && (
                            <span className="text-[10px] text-gray-400 line-through">{currency}{variant?.price || 0}</span>
                        )}
                    </div>

                    <button
                        onClick={handleAdd}
                        className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-200 active:bg-green-700 transition-colors"
                    >
                        <FaPlus size={12} />
                    </button>
                </div>

                {/* Promo Text */}
                <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider pt-1">
                    {savings}% OFF" ya "BUY 1 GET 1
                </p>
            </div>
        </div>
    );
};

export default MobileProductCard;
