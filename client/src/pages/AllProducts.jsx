import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard'
import './AllProducts.css'; // Import CSS file

const AllProducts = () => {

    const {products, categories } = useAppContext()
    const [filteredProducts, setFilteredProducts] = useState([])
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [draggedIndex, setDraggedIndex] = useState(null);

    useEffect(()=>{
        if (selectedCategory === "All") {
            setFilteredProducts(products.filter((p) => p.inStock));
        } else {
            setFilteredProducts(
              products.filter(
                (p) => p.inStock && p.category?.name === selectedCategory
              )
            );
          }
    },[selectedCategory, products])

    const handleDragStart = (index) => {
        setDraggedIndex(index);
      };
    
      const handleDragEnter = (index) => {
        if (draggedIndex === null || draggedIndex === index) return;
    
        const newProducts = [...products];
        const draggedItem = newProducts[draggedIndex];
        
        newProducts.splice(draggedIndex, 1);
        newProducts.splice(index, 0, draggedItem);
        
        setDraggedIndex(index);
        setProducts(newProducts);
      };
    
      const handleDragEnd = async () => {
        if (draggedIndex === null) return;
    
        const productOrders = products.map((product, index) => ({
          id: product._id,
          displayOrder: index + 1
        }));
    
        try {
          await fetch('/api/products/reorder', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productOrders })
          });
          console.log('Order saved successfully');
        } catch (error) {
          console.error('Error saving order:', error);
        }
    
        setDraggedIndex(null);
      };

  return (
    <div className="mt-11">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-medium">ALL PRODUCTS</h1>
        
        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">Filter:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Pills (Optional - for better UX) */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            selectedCategory === "All"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedCategory === cat.name
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl">No products found in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
          {filteredProducts.map((product, index) => (
            <div
              key={product._id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={`${
                draggedIndex === index ? 'dragging' : ''
              }`}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProducts;
