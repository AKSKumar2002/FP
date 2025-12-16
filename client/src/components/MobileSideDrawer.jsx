// Mobile Side Drawer Component
import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import { toast } from 'react-hot-toast';

const MobileSideDrawer = ({ isOpen, onClose }) => {
    const { user, setShowUserLogin, setUser, navigate, axios } = useAppContext();

    const logout = async () => {
        try {
            const { data } = await axios.get('/api/user/logout');
            if (data.success) {
                toast.success(data.message);
                setUser(null);
                onClose();
                navigate('/');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

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
            <div className="md:hidden fixed top-0 left-0 h-[100dvh] w-80 max-w-[85vw] bg-white z-50 shadow-2xl animate-slideInLeft rounded-r-3xl flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-primary-dull text-white p-6 pb-8 rounded-tr-3xl flex-shrink-0">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <img src={assets.logo2} alt="Farm Pick" className="h-10 rounded-xl bg-white/90 px-2 py-1 shadow-sm" />
                            {user && (
                                <button
                                    onClick={logout}
                                    className="h-10 px-4 rounded-xl bg-red-500 text-white font-bold text-sm shadow-sm active:scale-95 transition-transform flex items-center justify-center border-2 border-white/20"
                                >
                                    Logout
                                </button>
                            )}
                        </div>
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
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm border-2 border-white/30">
                                🧑‍🌾
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
                            className="w-full bg-white/20 backdrop-blur-sm py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors border border-white/30 shadow-sm"
                        >
                            Login / Sign Up
                        </button>
                    )}
                </div>

                {/* Menu Items - Scrollable Area */}
                <div className="py-4 flex-1 overflow-y-auto min-h-0">
                    <NavLink
                        to="/"
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-6 py-4 hover:bg-gray-50 active:bg-green-50 transition-colors ${isActive ? 'bg-green-50 border-r-4 border-primary text-primary font-bold' : 'text-gray-700 font-medium'
                            }`
                        }
                    >
                        <span className="text-2xl drop-shadow-sm">🏡</span>
                        <span className="text-base">Home</span>
                    </NavLink>

                    <NavLink
                        to="/products"
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-6 py-4 hover:bg-gray-50 active:bg-green-50 transition-colors ${isActive ? 'bg-green-50 border-r-4 border-primary text-primary font-bold' : 'text-gray-700 font-medium'
                            }`
                        }
                    >
                        <span className="text-2xl drop-shadow-sm">🧺</span>
                        <span className="text-base">All Products</span>
                    </NavLink>

                    <NavLink
                        to="/blog"
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-6 py-4 hover:bg-gray-50 active:bg-green-50 transition-colors ${isActive ? 'bg-green-50 border-r-4 border-primary text-primary font-bold' : 'text-gray-700 font-medium'
                            }`
                        }
                    >
                        <span className="text-2xl drop-shadow-sm">📑</span>
                        <span className="text-base">Blog</span>
                    </NavLink>

                    <NavLink
                        to="/about"
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-6 py-4 hover:bg-gray-50 active:bg-green-50 transition-colors ${isActive ? 'bg-green-50 border-r-4 border-primary text-primary font-bold' : 'text-gray-700 font-medium'
                            }`
                        }
                    >
                        <span className="text-2xl drop-shadow-sm">🌻</span>
                        <span className="text-base">About Us</span>
                    </NavLink>

                    <NavLink
                        to="/settings"
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-6 py-4 hover:bg-gray-50 active:bg-green-50 transition-colors ${isActive ? 'bg-green-50 border-r-4 border-primary text-primary font-bold' : 'text-gray-700 font-medium'
                            }`
                        }
                    >
                        <span className="text-2xl drop-shadow-sm">⚙️</span>
                        <span className="text-base">Settings</span>
                    </NavLink>

                    <NavLink
                        to="/contact"
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-6 py-4 hover:bg-gray-50 active:bg-green-50 transition-colors ${isActive ? 'bg-green-50 border-r-4 border-primary text-primary font-bold' : 'text-gray-700 font-medium'
                            }`
                        }
                    >
                        <span className="text-2xl drop-shadow-sm">📞</span>
                        <span className="text-base">Contact Us</span>
                    </NavLink>

                    {user && (
                        <>
                            <div className="my-2 border-t border-gray-100 mx-6"></div>
                            <NavLink
                                to="/my-orders"
                                onClick={onClose}
                                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 active:bg-green-50 transition-colors text-gray-700 font-medium"
                            >
                                <span className="text-2xl drop-shadow-sm">📦</span>
                                <span className="text-base">My Orders</span>
                            </NavLink>
                        </>
                    )}
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
