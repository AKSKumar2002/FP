import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import MainBanner from '../components/MainBanner'
import Categories from '../components/Categories'
import BestSeller from '../components/BestSeller'
import BottomBanner from '../components/BottomBanner'
import NewsLetter from '../components/NewsLetter'
import Details from '../components/VoiceOfTrust'
import ProductCard from '../components/ProductCard'

const Home = () => {
  const { getPopularProducts } = useAppContext()
  const [popularProducts, setPopularProducts] = useState([])

  useEffect(() => {
    const fetchPopular = async () => {
      const products = await getPopularProducts(8)
      if (products) setPopularProducts(products)
    }
    fetchPopular()
  }, [])

  return (
    <div className='mt-10'>
      <MainBanner />
      <Categories />
      <div id="best-sellers">
        <BestSeller />
      </div>
      <Details />
      <BottomBanner />
      <NewsLetter />

      {/* Popular Products Section */}
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center w-max">
          <p className="text-3xl font-medium">Most Ordered Products</p>
          <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 w-full">
          {popularProducts.map((product, index) => (
            <div key={product._id} className="relative">
              <div className="absolute -top-2 -left-2 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm z-10">
                {index + 1}
              </div>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
