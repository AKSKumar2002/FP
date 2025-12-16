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

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((currentIndex - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((currentIndex + 1) % banners.length);
  };

  // Touch handlers for manual swipe
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  return (
    <div
      className='relative rounded-[2rem] md:rounded-2xl overflow-hidden shadow-sm md:shadow-md group mx-3 md:mx-0 mt-3 md:mt-0 select-none'
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Banners Slider */}
      <div
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div key={banner.id} className='relative min-w-full w-full flex-shrink-0'>
            {/* Desktop Image */}
            <img
              src={banner.image}
              alt={`banner ${index + 1}`}
              className='w-full hidden md:block object-cover'
              style={{ height: '350px' }}
            />

            {/* Mobile Image - Optimized Aspect Ratio (4:5 or 1:1) */}
            <img
              src={banner.imageSm}
              alt={`banner ${index + 1}`}
              className='w-full md:hidden object-cover'
              style={{ aspectRatio: '4/5', maxHeight: '500px' }}
            />


            <div className='absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center pb-12 md:pb-0 px-6 md:pl-18 lg:pl-24 bg-gradient-to-t from-black/50 via-transparent to-transparent md:bg-none'>
              <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left text-white md:text-gray-800 max-w-xs md:max-w-md lg:max-w-lg leading-tight drop-shadow-md md:drop-shadow-none'>
                {banner.title}
              </h1>

              {banner.showButtons && (
                <div className='flex items-center mt-6 font-medium'>
                  <Link to={"/products"} className='group flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dull transition rounded-full md:rounded-lg text-white cursor-pointer shadow-lg'>
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
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`transition-all duration-300 rounded-full ${currentIndex === index
              ? 'bg-primary w-8 h-2'
              : 'bg-white/70 w-2 h-2 hover:bg-white'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Manual Navigation Arrows (Desktop Only) */}
      <button
        onClick={goToPrevious}
        className="hidden md:flex absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white text-gray-800 p-3 rounded-full transition-all z-10 opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="hidden md:flex absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white text-gray-800 p-3 rounded-full transition-all z-10 opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

export default MainBanner
