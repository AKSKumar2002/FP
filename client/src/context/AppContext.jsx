import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

// ✅ Use this instance everywhere
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState({});

  // ✅ Fetch Seller Status
  const fetchSeller = async () => {
    try {
      const { data } = await axiosInstance.get("/api/seller/is-auth");
      setIsSeller(data.success);
    } catch {
      setIsSeller(false);
    }
  };

  // ✅ Fetch User Auth & Cart
  const fetchUser = async () => {
    try {
      const { data } = await axiosInstance.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems || {});
      }
    } catch {
      setUser(null);
    }
  };

  // ✅ Fetch Products
  const fetchProducts = async () => {
    try {
      const { data } = await axiosInstance.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Cart Operations
  const addToCart = (productId, variantIndex) => {
    const key = `${productId}|${variantIndex}`;
    setCartItems((prev) => ({
      ...prev,
      [key]: prev[key] ? prev[key] + 1 : 1,
    }));
  };

  const updateCartItem = (cartKey, quantity) => {
    setCartItems((prev) => ({
      ...prev,
      [cartKey]: quantity,
    }));
  };

  const removeFromCart = (cartKey) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      delete updated[cartKey];
      return updated;
    });
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce((acc, cur) => acc + cur, 0);
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const key in cartItems) {
      const [productId, variantIndex] = key.split("|");
      const product = products.find((item) => item._id === productId);
      const variant = product?.variants?.[variantIndex];
      if (variant) {
        totalAmount += variant.offerPrice * cartItems[key];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  // ✅ Fetch on App Load
  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);

  // ✅ Update Cart in DB
  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axiosInstance.post("/api/cart/update", {
          userId: user._id,
          cartItems,
        });
        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    if (user) updateCart();
  }, [cartItems]);

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    searchQuery,
    setSearchQuery,
    getCartAmount,
    getCartCount,
    axios: axiosInstance, // ✅ Expose the correct instance
    fetchProducts,
    setCartItems,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
