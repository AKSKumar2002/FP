import React from 'react'
import { categories } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const Categories = () => {

  const { navigate } = useAppContext()

  return (
    <div className='mt-2 px-4 md:px-0'>
      <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-4 md:gap-3'>

        {categories.map((category, index) => (
          <div key={index} className='group cursor-pointer py-3 px-2 gap-2 md:gap-2 rounded-lg flex flex-col justify-center items-center hover:scale-105 transition shadow-sm'
            style={{ backgroundColor: category.bgColor }}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              scrollTo(0, 0)
            }}
          >
            <img src={category.image} alt={category.text} className='w-14 h-14 md:w-auto md:h-auto md:max-w-[5rem] object-contain group-hover:scale-108 transition' />
            <p className='text-xs md:text-sm font-medium text-center leading-tight line-clamp-2'>{category.text}</p>
          </div>

        ))}


      </div>
    </div>
  )
}

export default Categories
