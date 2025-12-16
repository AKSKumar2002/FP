// Floating Action Button (FAB) Component
import React from 'react';

const FloatingActionButton = ({ icon, onClick, badge = null }) => {
    return (
        <button
            onClick={onClick}
            className="md:hidden fixed bottom-20 right-6 w-14 h-14 bg-gradient-to-br from-primary to-primary-dull text-white rounded-full shadow-2xl hover:shadow-3xl active:scale-95 transition-all duration-200 flex items-center justify-center z-40"
            style={{
                boxShadow: '0 8px 24px rgba(0,0,0,0.3), 0 0 0 4px rgba(255,255,255,0.1)'
            }}
        >
            <span className="text-2xl">{icon}</span>
            {badge && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                    {badge}
                </div>
            )}
        </button>
    );
};

export default FloatingActionButton;
