import React, { useState, useEffect, useRef } from 'react';

const ProductBanner = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef(null);

    // Array of 4 products - you can modify these
    const products = [
        {
            id: 1,
            title: "Product 1",
            image: "https://via.placeholder.com/400x300/FF6B6B/ffffff?text=Product+1",
            description: "Amazing product description here",
            price: "$99.99"
        },
        {
            id: 2,
            title: "Product 2",
            image: "https://via.placeholder.com/400x300/4ECDC4/ffffff?text=Product+2",
            description: "Another great product",
            price: "$149.99"
        },
        {
            id: 3,
            title: "Product 3",
            image: "https://via.placeholder.com/400x300/45B7D1/ffffff?text=Product+3",
            description: "Best seller of the month",
            price: "$79.99"
        },
        {
            id: 4,
            title: "Product 4",
            image: "https://via.placeholder.com/400x300/FFA07A/ffffff?text=Product+4",
            description: "Limited time offer",
            price: "$199.99"
        }
    ];

    // Auto-scroll every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [products.length]);

    // Smooth scroll when currentIndex changes
    useEffect(() => {
        if (containerRef.current) {
            const scrollWidth = containerRef.current.scrollWidth / products.length;
            containerRef.current.scrollTo({
                left: scrollWidth * currentIndex,
                behavior: 'smooth'
            });
        }
    }, [currentIndex, products.length]);

    const handleDotClick = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="w-full py-12 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
                    Featured Products
                </h2>

                {/* Banner Container */}
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                    {/* Products Scroll Container */}
                    <div
                        ref={containerRef}
                        className="flex overflow-x-hidden scroll-smooth"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="min-w-full flex-shrink-0 relative"
                            >
                                <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-gray-900 to-gray-700">
                                    {/* Product Image */}
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="w-full h-full object-cover opacity-80"
                                    />

                                    {/* Overlay Content */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
                                        <div className="p-8 md:p-12 w-full">
                                            <h3 className="text-3xl md:text-5xl font-bold text-white mb-3">
                                                {product.title}
                                            </h3>
                                            <p className="text-lg md:text-xl text-gray-200 mb-4">
                                                {product.description}
                                            </p>
                                            <div className="flex items-center gap-6">
                                                <span className="text-4xl font-bold text-white">
                                                    {product.price}
                                                </span>
                                                <button className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
                                                    Shop Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Dots */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
                        {products.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleDotClick(index)}
                                className={`transition-all duration-300 rounded-full ${currentIndex === index
                                        ? 'bg-white w-8 h-3'
                                        : 'bg-white/50 w-3 h-3 hover:bg-white/75'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Manual Navigation Arrows (Optional) */}
                    <button
                        onClick={() => setCurrentIndex((currentIndex - 1 + products.length) % products.length)}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-3 rounded-full transition-all z-10"
                        aria-label="Previous slide"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={() => setCurrentIndex((currentIndex + 1) % products.length)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-3 rounded-full transition-all z-10"
                        aria-label="Next slide"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Progress Bar (Optional) */}
                <div className="mt-4 w-full bg-gray-300 h-1 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${((currentIndex + 1) / products.length) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductBanner;
