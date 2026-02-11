import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

// Desktop Components
import MainBanner from '../components/MainBanner';
import Categories from '../components/Categories';
import BestSeller from '../components/BestSeller';
import BottomBanner from '../components/BottomBanner';
import NewsLetter from '../components/NewsLetter';
import Details from '../components/VoiceOfTrust';

// Mobile Redesign Components (Matches Ui.jpeg)
import MobileHeader from '../components/MobileHeader';
import MobileHomeBanner from '../components/MobileHomeBanner';
import MobileCategories from '../components/MobileCategories';
import MobileFlashSales from '../components/MobileFlashSales';
import MobileProductCard from '../components/MobileProductCard';
import { assets } from '../assets/assets';

const Home = () => {
  const { products, currency, addToCart, user, setShowUserLogin } = useAppContext();
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Filter best sellers for desktop auto-scroll
  const bestSellerProducts = products.filter(product => product.isBestSeller && product.inStock);

  // Continuous auto-scroll for desktop best sellers
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !products || products.length === 0) return;
    const scrollSpeed = 0.5;
    let animationFrameId;
    const scroll = () => {
      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += scrollSpeed;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };
    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [products]);

  const openProductPopup = (product) => {
    setSelectedProduct(product);
    setSelectedVariant(product.variants?.[0] || null);
    document.body.style.overflow = 'hidden';
  };

  const closeProductPopup = () => {
    setSelectedProduct(null);
    setSelectedVariant(null);
    document.body.style.overflow = 'unset';
  };

  const handleAddToCart = () => {
    if (!user) { setShowUserLogin(true); return; }
    if (selectedProduct && selectedVariant) {
      const variantIndex = selectedProduct.variants.indexOf(selectedVariant);
      addToCart(`${selectedProduct._id}|${variantIndex}`);
      closeProductPopup();
    }
  };

  const handleQuickAddToCart = (e, product) => {
    e.stopPropagation();
    if (!user) { setShowUserLogin(true); return; }
    addToCart(`${product._id}|0`);
  };

  const handleQuickBuyNow = (e, product) => {
    e.stopPropagation();
    if (!user) { setShowUserLogin(true); return; }
    addToCart(`${product._id}|0`);
    navigate('/cart');
  };

  return (
    <div className='relative bg-white md:bg-gray-50 min-h-screen pb-20 md:pb-0'>

      {/* ========================================== */}
      {/* MOBILE UI - MATCHES Ui.jpeg               */}
      {/* ========================================== */}
      <div className="md:hidden">
        <MobileHeader />
        <MainBanner />
        <MobileCategories />
        <MobileFlashSales />

        {/* Secondary "Our Pick for you" Section */}
        <div className="py-2 mb-6">
          <div className="flex items-center justify-between px-4 mb-4">
            <h2 className="text-lg font-black text-gray-800">Our Pick for you</h2>
            <button className="text-gray-400 font-black text-xl leading-none px-2 -mr-2 text-primary">...</button>
          </div>
          <div className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide">
            {products.filter(p => !p.isBestSeller && p.inStock).slice(0, 6).map(p => (
              <MobileProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* DESKTOP UI                                 */}
      {/* ========================================== */}
      <div className="hidden md:block">
        {/* Background Decor */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-green-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <MainBanner />

        <div className="relative mt-8 px-4 lg:px-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">Shop by Category</h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-2 rounded-full"></div>
          </div>
          <Categories />
        </div>

        {/* Best Sellers Auto-Scroll Row */}
        <div id="best-sellers" className="relative mt-20">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
              ⭐ Best Sellers
            </h2>
          </div>

          <div ref={scrollContainerRef} className="overflow-x-auto scrollbar-hide pb-10">
            <div className="flex gap-6 min-w-max px-8">
              {[...bestSellerProducts, ...bestSellerProducts].map((product, index) => (
                <div
                  key={index}
                  onClick={() => openProductPopup(product)}
                  className="w-64 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden border border-gray-100 group"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img src={product.image[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-2 right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full shadow-sm">BEST</div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 truncate">{product.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xl font-black text-primary">{currency}{product.variants[0].offerPrice}</span>
                      <span className="text-xs text-gray-400 line-through">{currency}{product.variants[0].price}</span>
                    </div>
                    <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => handleQuickAddToCart(e, product)} className="flex-1 py-1 px-2 border border-primary text-primary text-xs rounded-lg font-bold">Add</button>
                      <button onClick={(e) => handleQuickBuyNow(e, product)} className="flex-1 py-1 px-2 bg-primary text-white text-xs rounded-lg font-bold">Buy</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 lg:px-16 mt-20">
          <BestSeller />
        </div>

        <Details />
        <BottomBanner />
        <NewsLetter />
      </div>

      {/* Product Quick View Popup (Shared) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="absolute inset-0" onClick={closeProductPopup}></div>
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-3xl animate-slideUp shadow-2xl">
            <button onClick={closeProductPopup} className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-gray-200 rounded-full z-10">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="grid md:grid-cols-2 gap-8 p-8">
              <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-center">
                <img src={selectedProduct.image[0]} alt={selectedProduct.name} className="max-h-96 object-contain" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-3xl font-black text-gray-800">{selectedProduct.name}</h2>
                <div className="mt-4 p-4 bg-green-50 rounded-2xl border border-green-100">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-black text-primary">{currency}{selectedVariant?.offerPrice}</span>
                    <span className="text-lg text-gray-400 line-through">{currency}{selectedVariant?.price}</span>
                  </div>
                </div>

                <div className="mt-8">
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Select Size</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.variants.map((v, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-6 py-3 rounded-xl font-bold transition-all border-2 ${selectedVariant === v ? 'border-primary bg-primary text-white' : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-green-200'}`}
                      >
                        {v.weight} {v.unit}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-8 flex gap-4">
                  <button onClick={handleAddToCart} className="flex-1 py-4 bg-white border-2 border-primary text-primary font-bold rounded-2xl hover:bg-green-50 transition-colors">Add to Cart</button>
                  <button onClick={handleAddToCart} className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-green-200 hover:bg-green-700 transition-colors">Buy Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
