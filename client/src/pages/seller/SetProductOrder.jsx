import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';

const SetProductOrder = () => {
  const { backendUrl, sellerToken } = useAppContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/product/display-order`, {
        headers: { token: sellerToken }
      });
      
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMove = (index, direction) => {
    const newProducts = [...products];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newProducts.length) return;
    
    [newProducts[index], newProducts[targetIndex]] = [newProducts[targetIndex], newProducts[index]];
    setProducts(newProducts);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const orders = products.map((product, index) => ({
        id: product._id,
        displayOrder: index + 1
      }));

      const response = await axios.post(
        `${backendUrl}/api/product/update-order`,
        { orders },
        { headers: { token: sellerToken } }
      );

      if (response.data.success) {
        toast.success('Product order updated successfully');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading && products.length === 0) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Set Product Display Order</h1>
      
      <div className="bg-white rounded-lg shadow">
        {products.map((product, index) => (
          <div
            key={product._id}
            className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50"
          >
            <div className="flex items-center gap-4 flex-1">
              <span className="text-gray-500 font-medium">{index + 1}.</span>
              <img
                src={product.image?.[0]}
                alt={product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-500">{product.category?.name}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleMove(index, 'up')}
                disabled={index === 0}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ↑
              </button>
              <button
                onClick={() => handleMove(index, 'down')}
                disabled={index === products.length - 1}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ↓
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="mt-6 px-6 py-2 bg-primary text-white rounded hover:bg-primary-dull disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Order'}
      </button>
    </div>
  );
};

export default SetProductOrder;
