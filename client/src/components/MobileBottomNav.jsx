// Mobile Bottom Navigation Component
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const MobileBottomNav = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', icon: '🏠', label: 'Home' },
        { path: '/products', icon: '🛍️', label: 'Shop' },
        { path: '/blog', icon: '📰', label: 'Blog' },
        { path: '/cart', icon: '🛒', label: 'Cart' },
        { path: '/my-orders', icon: '📦', label: 'Orders' }
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
            <div className="grid grid-cols-5 h-16">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center transition-all duration-200 ${isActive ? 'text-primary' : 'text-gray-500'
                                }`}
                        >
                            <div className={`text-2xl transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                                {item.icon}
                            </div>
                            <span className={`text-xs mt-1 font-medium ${isActive ? 'font-bold' : ''}`}>
                                {item.label}
                            </span>
                            {isActive && (
                                <div className="absolute bottom-0 w-12 h-1 bg-primary rounded-t-full animate-fadeIn"></div>
                            )}
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileBottomNav;
