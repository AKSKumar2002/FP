import React from 'react';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

const MobileCategories = () => {
    const { navigate } = useAppContext();

    const categories_data = [
        {
            id: 1,
            name: 'Fruits',
            image: assets.fresh_fruits_image || 'https://cdn-icons-png.flaticon.com/512/3194/3194766.png',
            color: 'bg-[#FFF7ED]'
        },
        {
            id: 2,
            name: 'Vegetables',
            image: assets.organic_vegitable_image || 'https://cdn-icons-png.flaticon.com/512/2329/2329888.png',
            color: 'bg-[#F0FDF4]'
        },
        {
            id: 3,
            name: 'Greens',
            image: assets.spinach_image_1 || 'https://cdn-icons-png.flaticon.com/512/2153/2153788.png',
            color: 'bg-[#E0F6FE]'
        },
        {
            id: 4,
            name: 'Bundles',
            image: assets.bottles_image || 'https://cdn-icons-png.flaticon.com/512/3081/3081918.png',
            color: 'bg-[#F0F5DE]'
        },
    ];

    return (
        <div className="md:hidden py-6">
            <div className="flex items-center justify-between px-5 mb-4">
                <h2 className="text-[18px] font-black text-[#1E1B4B]">Most Popular Category</h2>
                <button className="text-gray-400 font-black text-[22px] leading-none px-2 -mr-2">...</button>
            </div>

            <div className="flex justify-center gap-6 px-5 pb-2 scrollbar-hide">
                {categories_data.map((cat) => (
                    <div
                        key={cat.id}
                        onClick={() => navigate(`/products/${cat.name.toLowerCase()}`)}
                        className="flex flex-col items-center gap-2 flex-shrink-0 group active:scale-95 transition-all"
                    >
                        <div className={`w-[68px] h-[68px] ${cat.color} rounded-[18px] flex items-center justify-center p-3 shadow-sm group-hover:shadow-md transition-shadow relative overflow-hidden active:bg-opacity-80`}>
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full object-contain drop-shadow-sm"
                            />
                        </div>
                        <span className="text-[12px] font-bold text-[#1E1B4B]">{cat.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MobileCategories;
