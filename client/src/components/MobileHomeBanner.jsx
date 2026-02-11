import React from 'react';

const MobileHomeBanner = () => {
    return (
        <div className="md:hidden px-4 py-2">
            <div className="relative h-44 rounded-3xl overflow-hidden bg-gradient-to-br from-green-700 to-emerald-900 shadow-xl shadow-green-200/50">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: '20px 20px'
                }}></div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-center p-6 z-10">
                    <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest mb-1 italic">Fresh & Healthy</span>
                    <h2 className="text-white text-3xl font-black leading-none mb-3">VEGETABLES</h2>
                    <p className="text-white/60 text-[9px] max-w-[160px] leading-relaxed mb-4">
                        LIMITED TIME OFFER <br />
                        Fresh vegetables at your doorstep within 24 hours.
                    </p>

                    <button className="bg-white text-green-800 text-[10px] font-black px-6 py-2 rounded-full w-fit shadow-lg active:scale-95 transition-transform uppercase tracking-wider">
                        ORDER NOW
                    </button>
                </div>

                {/* Image Placeholder - In real app, use the vegetable image from Ui.jpeg */}
                <div className="absolute top-0 right-0 h-full w-1/2 overflow-hidden">
                    <div className="absolute -right-8 -top-8 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
                    <img
                        src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80"
                        alt="Vegetables"
                        className="h-full w-full object-cover transform scale-125 translate-x-4 rotate-12 opacity-80"
                    />

                    {/* Price Badge Overlay */}
                    <div className="absolute top-6 right-6 w-12 h-12 bg-yellow-400 rounded-full flex flex-col items-center justify-center text-green-900 border-2 border-white shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
                        <span className="text-[8px] font-bold leading-none">ONLY</span>
                        <span className="text-sm font-black leading-none">5.00</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileHomeBanner;
