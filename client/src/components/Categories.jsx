import React from 'react'
import { useAppContext } from '../context/AppContext'

// Import images from assets
import organic_vegitable_image from '../assets/organic_vegitable_image.png'
import fresh_fruits_image from '../assets/fresh_fruits_image.png'
import spinach_image from '../assets/spinach_image_1.png'
import bottles_image from '../assets/budle-pack-removebg-preview.png'

// Category background colors
const categoryColors = [
  "#FEF6DA", // Yellow - Vegetables
  "#FEE0E0", // Pink - Fruits
  "#E0F6FE", // Light Blue - Greens
  "#F0F5DE", // Light Green - Bundle
];

// Category images mapping
const categoryImages = {
  'Vegetables': organic_vegitable_image,
  'Fruits': fresh_fruits_image,
  'Greens': spinach_image,
  'Fresh Farm': spinach_image,
  'Bundle packages': bottles_image,
};

const Categories = () => {
  const { navigate, categories } = useAppContext()

  // Filter to only show the 4 main categories and sort them
  const allowedCategories = ['Vegetables', 'Fruits', 'Greens', 'Fresh Farm', 'Bundle packages'];
  const displayCategories = categories
    .filter(cat => allowedCategories.includes(cat.name))
    .sort((a, b) => {
      const order = ['Vegetables', 'Fruits', 'Greens', 'Fresh Farm', 'Bundle packages'];
      return order.indexOf(a.name) - order.indexOf(b.name);
    });

  return (
    <div className='px-4 sm:px-6 md:px-8 lg:px-16'>
      {/* Grid layout - 2x2 on mobile, 4 in a row on larger screens */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-10 max-w-4xl mx-auto'>
        {displayCategories.map((category, index) => (
          <div
            key={category._id || index}
            className='group cursor-pointer py-3 px-3 sm:py-4 sm:px-4 md:py-5 md:px-6 rounded-xl flex flex-col justify-center items-center hover:scale-105 hover:shadow-lg transition-all duration-300 shadow-sm border border-gray-100'
            style={{ backgroundColor: categoryColors[index % categoryColors.length] }}
            onClick={() => {
              navigate(`/products/${category.name.toLowerCase()}`);
              scrollTo(0, 0)
            }}
          >
            {/* Category Image */}
            <img
              src={categoryImages[category.name] || organic_vegitable_image}
              alt={category.name}
              className='w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-md'
            />
            <p className='text-xs sm:text-sm md:text-base font-semibold text-center leading-tight mt-1.5 sm:mt-2 text-gray-700'>
              {category.name === 'Fresh Farm' ? 'Greens' : category.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Categories
