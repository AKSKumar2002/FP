import React, { useState, useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const MainBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  // Array of 4 banner slides - you can modify these
  const banners = [
    {
      id: 1,
      image: assets.main_banner_bg,
      imageSm: assets.main_banner_bg_sm,
      title: "Freshness You Can Trust, Savings You will Love!",
      showButtons: true
    },
    {
      id: 2,
      image: assets.main_banner_bg,
      imageSm: assets.main_banner_bg_sm,
      title: "Product Banner 2 - Replace with your content!",
      showButtons: true
    },
    {
      id: 3,
      image: assets.main_banner_bg,
      imageSm: assets.main_banner_bg_sm,
      title: "Product Banner 3 - Replace with your content!",
      showButtons: true
    },
    {
      id: 4,
      image: assets.main_banner_bg,
      imageSm: assets.main_banner_bg_sm,
      title: "Product Banner 4 - Replace with your content!",
      showButtons: true
    }
  ];

  // Auto-scroll every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [banners.length]);

  // Smooth scroll when currentIndex changes
  useEffect(() => {
    if (containerRef.current) {
      const scrollWidth = containerRef.current.scrollWidth / banners.length;
      containerRef.current.scrollTo({
        left: scrollWidth * currentIndex,
        behavior: 'smooth'
      });
    }
  }, [currentIndex, banners.length]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((currentIndex - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((currentIndex + 1) % banners.length);
  };

  return (
    <div className='relative rounded-2xl overflow-hidden'>
      {/* Banners Container */}
      <div
        ref={containerRef}
        className="flex overflow-hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {banners.map((banner, index) => (
          <div key={banner.id} className='relative min-w-full flex-shrink-0'>
            <img src={banner.image} alt={`banner ${index + 1}`} className='w-full hidden md:block' style={{ maxHeight: '350px', height: 'auto', objectFit: 'cover' }} />
            <img src={banner.imageSm} alt={`banner ${index + 1}`} className='w-full md:hidden' style={{ maxHeight: '300px', height: 'auto', objectFit: 'cover' }} />


            <div className='absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center pb-24 md:pb-0 px-4 md:pl-18 lg:pl-24'>
              <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left max-w-72 md:max-w-80 lg:max-w-105 leading-tight lg:leading-15'>
                {banner.title}
              </h1>

              {banner.showButtons && (
                <div className='flex items-center mt-6 font-medium'>
                  <Link to={"/products"} className='group flex items-center gap-2 px-7 md:px-9 py-3 bg-primary hover:bg-primary-dull transition rounded text-white cursor-pointer'>
                    Shop now
                    <img className='md:hidden transition group-focus:translate-x-1' src={assets.white_arrow_icon} alt="arrow" />
                  </Link>

                  <Link to={"/products"} className='group hidden md:flex items-center gap-2 px-9 py-3 cursor-pointer'>
                    Explore deals
                    <img className='transition group-hover:translate-x-1' src={assets.black_arrow_icon} alt="arrow" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
        {banners.map((_, index) => (
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

      {/* Manual Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-3 rounded-full transition-all z-10"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-3 rounded-full transition-all z-10"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

export default MainBanner
