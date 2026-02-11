import React, { useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import MobileProductCard from './MobileProductCard';

const MobileFlashSales = () => {
    const { products } = useAppContext();
    const flashSales = products.filter(p => p.inStock).slice(0, 6); // Take first 6 as flash sales

    return (
        <div className="md:hidden py-4">
            <div className="flex items-center justify-between px-4 mb-4">
                <h2 className="text-lg font-black text-gray-800">Flash sales today</h2>
                <button className="text-gray-400 font-black text-xl leading-none px-2 -mr-2">...</button>
            </div>

            <div className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide">
                {flashSales.length > 0 ? (
                    flashSales.map((product) => (
                        <MobileProductCard key={product._id} product={product} />
                    ))
                ) : (
                    <div className="w-full text-center py-10 text-gray-400 text-sm">
                        No flash sales available today
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobileFlashSales;
