import React from 'react'
import { useAppContext } from '../context/AppContext'

// Import images from assets
import organic_vegitable_image from '../assets/organic_vegitable_image.png'
import fresh_fruits_image from '../assets/fresh_fruits_image.png'
import spinach_image from '../assets/spinach_image_1.png'
import bottles_image from '../assets/budle-pack-removebg-preview.png'

// Category background colors - cycles through these for dynamic categories
const categoryColors = [
  "#FEF6DA", // Yellow - Vegetables
  "#FEE0E0", // Pink - Fruits
  "#E0F6FE", // Light Blue - Greens
  "#F0F5DE", // Light Green - Bundle
  "#FEE6CD", // Orange
  "#F1E3F9", // Purple
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
    <div className='mt-2 px-4 md:px-8 lg:px-16'>
      {/* Centered flex container with equal spacing - auto adjusts for any number of categories */}
      <div className='flex flex-wrap justify-center gap-6 md:gap-10 lg:gap-16'>
        {displayCategories.map((category, index) => (
          <div
            key={category._id || index}
            className='group cursor-pointer py-4 px-6 md:py-5 md:px-8 rounded-xl flex flex-col justify-center items-center hover:scale-105 hover:shadow-lg transition-all duration-300 shadow-sm border border-gray-100 min-w-[120px] md:min-w-[140px] lg:min-w-[160px]'
            style={{ backgroundColor: categoryColors[index % categoryColors.length] }}
            onClick={() => {
              navigate(`/products/${category.name.toLowerCase()}`);
              scrollTo(0, 0)
            }}
          >
            {/* 3D Category Image */}
            <img
              src={categoryImages[category.name] || organic_vegitable_image}
              alt={category.name}
              className='w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-md'
            />
            <p className='text-xs md:text-sm lg:text-base font-semibold text-center leading-tight mt-2 text-gray-700'>
              {category.name === 'Fresh Farm' ? 'Greens' : category.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Categories
