// Mobile Bottom Navigation Component
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const MobileBottomNav = () => {
    const location = useLocation();

    const navItems = [
        {
            path: '/blog',
            label: 'Blog',
            icon: '📑'
        },
        {
            path: '/products',
            label: 'Shop',
            icon: '🧺'
        },
        {
            path: '/',
            label: 'Home',
            icon: '🏡'
        },
        {
            path: '/cart',
            label: 'Cart',
            icon: '🛒'
        },
        {
            path: '/my-orders',
            label: 'Orders',
            icon: '📦'
        }
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-green-100 shadow-2xl z-50 rounded-t-2xl" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
            <div className="grid grid-cols-5 h-16 relative">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`group flex flex-col items-center justify-center transition-all duration-300 relative ${isActive ? 'transform -translate-y-1' : ''
                                }`}
                        >
                            {/* Icon Container with Effect */}
                            <div className={`p-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-green-50 shadow-sm ring-1 ring-green-100 scale-110' : 'grayscale-[0.3] hover:grayscale-0'
                                }`}>
                                <span className="text-2xl filter drop-shadow-sm">{item.icon}</span>
                            </div>

                            <span className={`text-[10px] mt-0.5 font-medium transition-colors ${isActive ? 'text-primary font-bold' : 'text-gray-400'}`}>
                                {item.label}
                            </span>

                            {/* Active Indicator Dot */}
                            {isActive && (
                                <div className="absolute top-1 right-3 w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>
                            )}
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileBottomNav;
