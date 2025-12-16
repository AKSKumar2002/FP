// Mobile App Header Component
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const MobileAppHeader = ({ title, showBack = false, actions = [] }) => {
    const navigate = useNavigate();

    return (
        <div className="md:hidden sticky top-0 z-40 bg-gradient-to-r from-primary to-primary-dull text-white shadow-lg">
            <div className="flex items-center justify-between px-4 h-14">
                <div className="flex items-center gap-3">
                    {showBack ? (
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 -ml-2 rounded-full hover:bg-white/20 active:bg-white/30 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    ) : (
                        <img src={assets.logo2} alt="Logo" className="h-8 w-auto" />
                    )}
                    <h1 className="text-lg font-bold">{title}</h1>
                </div>

                <div className="flex items-center gap-2">
                    {actions.map((action, index) => (
                        <button
                            key={index}
                            onClick={action.onClick}
                            className="p-2 rounded-full hover:bg-white/20 active:bg-white/30 transition-colors"
                        >
                            {action.icon}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MobileAppHeader;
