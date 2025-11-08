import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Sortable Product Item Component
const SortableProductItem = ({ product, onEdit, onDelete, onToggleStock }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-2"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>

      {/* Product Image */}
      <img
        src={product.image?.[0] || '/placeholder.png'}
        alt={product.name}
        className="w-20 h-20 object-cover rounded-lg"
      />

      {/* Product Info */}
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.variants?.length || 0} variant(s)</p>
        <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
          {product.category?.name || 'Uncategorized'}
        </span>
      </div>

      {/* Best Seller Badge */}
      {product.isBestSeller && (
        <div className="text-yellow-500 text-2xl">⭐</div>
      )}

      {/* Stock Toggle */}
      <label className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            checked={product.available !== false}
            onChange={() => onToggleStock(product._id, product.available)}
            className="sr-only"
          />
          <div className={`w-12 h-6 rounded-full transition ${product.available !== false ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${product.available !== false ? 'translate-x-6' : ''}`}></div>
        </div>
        <span className="ml-2 text-sm">{product.available !== false ? 'Available' : 'Unavailable'}</span>
      </label>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(product._id)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product._id)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login as a seller to continue');
      navigate('/seller');
      return;
    }
  }, [navigate]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/category/list`);
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Session expired. Please login again');
        navigate('/seller');
        return;
      }
      
      const response = await axios.get(`${backendUrl}/api/product/list`, {
        headers: { 
          token,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        setProducts(response.data.products);
        filterProductsByCategory(response.data.products, activeCategory);
      } else {
        toast.error(response.data.message || 'Failed to fetch products');
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Session expired. Please login again');
        localStorage.removeItem('token');
        navigate('/seller');
      } else {
        toast.error('Failed to fetch products');
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter products by category
  const filterProductsByCategory = (productList, category) => {
    if (category === 'all') {
      setFilteredProducts(productList);
    } else {
      const filtered = productList.filter(p => p.category?.name === category);
      setFilteredProducts(filtered);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProductsByCategory(products, activeCategory);
  }, [activeCategory, products]);

  // Handle drag end
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = filteredProducts.findIndex(p => p._id === active.id);
    const newIndex = filteredProducts.findIndex(p => p._id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedProducts = arrayMove(filteredProducts, oldIndex, newIndex);
    setFilteredProducts(reorderedProducts);

    const orders = reorderedProducts.map((product, index) => ({
      id: product._id,
      display_order: index,
    }));

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Session expired. Please login again');
        navigate('/seller');
        return;
      }
      
      console.log('🔵 Reorder URL:', `${backendUrl}/api/product/reorder`);
      console.log('🔵 Token:', token.substring(0, 20) + '...');
      console.log('🔵 Orders:', orders);
      
      const response = await axios.post(
        `${backendUrl}/api/product/reorder`, 
        { orders },
        { 
          headers: { 
            token,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      console.log('✅ Reorder response:', response.data);
      
      if (response.data.success) {
        toast.success('Product order updated!');
      } else {
        toast.error(response.data.message || 'Failed to update order');
        fetchProducts();
      }
    } catch (error) {
      console.error('❌ Reorder error:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error data:', error.response?.data);
      
      if (error.response?.status === 404) {
        toast.error('Endpoint not found. Please check if backend is deployed correctly.');
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Session expired. Please login again');
        localStorage.removeItem('token');
        navigate('/seller');
      } else {
        toast.error(error.response?.data?.message || 'Failed to update order');
        fetchProducts();
      }
    }
  };

  // Toggle stock
  const handleToggleStock = async (id, currentStatus) => {
    const newStatus = currentStatus === false ? true : false;
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Session expired. Please login again');
        navigate('/seller');
        return;
      }
      
      const response = await axios.post(
        `${backendUrl}/api/product/toggle-stock/${id}`, 
        { available: newStatus },
        { 
          headers: { 
            token,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      if (response.data.success) {
        toast.success('Stock status updated');
        const updatedProducts = products.map(p => 
          p._id === id ? { ...p, available: newStatus, inStock: newStatus } : p
        );
        setProducts(updatedProducts);
        filterProductsByCategory(updatedProducts, activeCategory);
      } else {
        toast.error(response.data.message || 'Failed to update stock');
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Session expired. Please login again');
        localStorage.removeItem('token');
        navigate('/seller');
      } else {
        toast.error(error.response?.data?.message || 'Failed to update stock');
      }
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Session expired. Please login again');
        navigate('/seller');
        return;
      }
      
      const response = await axios.delete(
        `${backendUrl}/api/product/delete/${id}`, 
        { headers: { token } }
      );
      
      if (response.data.success) {
        toast.success('Product deleted successfully');
        fetchProducts();
      } else {
        toast.error(response.data.message || 'Failed to delete product');
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Session expired. Please login again');
        localStorage.removeItem('token');
        navigate('/seller');
      } else {
        toast.error(error.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading products...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">All Products</h1>
      <p className="text-gray-600 mb-6">Manage your product inventory and stock status</p>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition ${
            activeCategory === 'all'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All ({products.length})
        </button>
        {categories.map((cat) => {
          const count = products.filter(p => p.category?.name === cat.name).length;
          return (
            <button
              key={cat._id}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition ${
                activeCategory === cat.name
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Drag and Drop Product List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredProducts.map(p => p._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {filteredProducts.length === 0 ? (
              <p className="text-center text-gray-500 py-10">No products found in this category</p>
            ) : (
              filteredProducts.map((product) => (
                <SortableProductItem
                  key={product._id}
                  product={product}
                  onEdit={(id) => console.log('Edit', id)}
                  onDelete={handleDelete}
                  onToggleStock={handleToggleStock}
                />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ProductList;
