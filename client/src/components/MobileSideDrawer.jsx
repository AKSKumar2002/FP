// Mobile Side Drawer Component
import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

const MobileSideDrawer = ({ isOpen, onClose }) => {
    const { user, setShowUserLogin } = useAppContext();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const menuItems = [
        { path: '/', icon: '🏠', label: 'Home' },
        { path: '/products', icon: '🛍️', label: 'All Products' },
        { path: '/blog', icon: '📰', label: 'Blog' },
        { path: '/about', icon: 'ℹ️', label: 'About Us' },
        { path: '/contact', icon: '📞', label: 'Contact Us' },
    ];

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="md:hidden fixed inset-0 bg-black/50 z-50 animate-fadeIn"
                onClick={onClose}
            ></div>

            {/* Drawer */}
            <div className="md:hidden fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl animate-slideInLeft overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-primary-dull text-white p-6 pb-8">
                    <div className="flex items-center justify-between mb-6">
                        <img src={assets.logo2} alt="Farm Pick" className="h-10" />
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white/20 active:bg-white/30 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {user ? (
                        <div className="flex items-center gap-3">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm">
                                👤
                            </div>
                            <div>
                                <p className="font-bold text-lg">Hi, {user.name}</p>
                                <p className="text-sm text-green-100">Welcome back!</p>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                setShowUserLogin(true);
                                onClose();
                            }}
                            className="w-full bg-white/20 backdrop-blur-sm py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors"
                        >
                            Login / Sign Up
                        </button>
                    )}
                </div>

                {/* Menu Items */}
                <div className="py-4">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-6 py-4 hover:bg-gray-100 active:bg-gray-200 transition-colors ${isActive ? 'bg-green-50 border-r-4 border-primary text-primary font-semibold' : 'text-gray-700'
                                }`
                            }
                        >
                            <span className="text-2xl">{item.icon}</span>
                            <span className="text-base">{item.label}</span>
                        </NavLink>
                    ))}

                    {user && (
                        <>
                            <div className="my-2 border-t border-gray-200"></div>
                            <NavLink
                                to="/my-orders"
                                onClick={onClose}
                                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-100 active:bg-gray-200 transition-colors text-gray-700"
                            >
                                <span className="text-2xl">📦</span>
                                <span className="text-base">My Orders</span>
                            </NavLink>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gray-50 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                        Farm Pick © 2025
                        <br />
                        Fresh & Organic
                    </p>
                </div>
            </div>

            <style jsx>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.3s ease-out;
        }
      `}</style>
        </>
    );
};

export default MobileSideDrawer;
