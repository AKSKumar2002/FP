import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, FileText, ShoppingBag, ShoppingCart, Package } from 'lucide-react';

import { useAppContext } from '../context/AppContext';

const MobileBottomNavigation = () => {
    const location = useLocation();
    const { getCartCount, animateCart } = useAppContext();
    const cartCount = getCartCount();

    const navItems = [
        { path: '/blog', label: 'Blog', icon: <FileText size={22} /> },
        { path: '/products', label: 'Shop', icon: <ShoppingBag size={22} /> },
        { path: '/', label: 'Home', icon: <Home size={28} />, isCenter: true },
        { path: '/cart', label: 'Cart', icon: <ShoppingCart size={22} /> },
        { path: '/my-orders', label: 'Orders', icon: <Package size={22} /> }
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
            <div className="bg-white/95 backdrop-blur-md border border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] rounded-[32px] h-20 px-6 flex items-center justify-between relative">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const isCart = item.label === 'Cart';

                    if (item.isCenter) {
                        const isHomeActive = location.pathname === '/';
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className="relative -top-5"
                            >
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isHomeActive ? 'bg-[#E7F5EF] text-[#10B981] shadow-md border-4 border-white' : 'bg-white text-gray-400 shadow-sm border border-gray-100'}`}>
                                    <div className={`p-3 rounded-full ${isHomeActive ? 'bg-white shadow-sm' : ''}`}>
                                        <Home size={28} strokeWidth={isHomeActive ? 2.5 : 2} />
                                    </div>
                                </div>
                                <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[11px] font-bold ${isHomeActive ? 'text-[#10B981]' : 'text-gray-400'}`}>
                                    {item.label}
                                </span>
                            </NavLink>
                        );
                    }

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center gap-1 transition-all ${isActive ? 'text-[#10B981]' : 'text-gray-400'}`}
                        >
                            <div className={`transition-transform relative ${isActive ? 'scale-110 mb-0.5' : 'mb-0.5'} ${isCart && animateCart ? 'animate-bounce text-green-600' : ''}`}>
                                {React.cloneElement(item.icon, {
                                    strokeWidth: isActive ? 2.5 : 2,
                                    fill: isActive ? '#E7F5EF' : 'none'
                                })}
                                {isCart && cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className={`text-[11px] font-bold transition-opacity ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                                {item.label}
                            </span>
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileBottomNavigation;
