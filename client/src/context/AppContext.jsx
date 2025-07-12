import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate();
    const [user, setUser] = useState(null)
    const [isSeller, setIsSeller] = useState(false)
    const [showUserLogin, setShowUserLogin] = useState(false)
    const [products, setProducts] = useState([])

    const [cartItems, setCartItems] = useState({})
    const [searchQuery, setSearchQuery] = useState({})

    // Fetch Seller Status
    const fetchSeller = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/seller/is-auth`, { withCredentials: true });
            if (data.success) {
                setIsSeller(true)
            } else {
                setIsSeller(false)
            }
        } catch (error) {
            setIsSeller(false)
        }
    }

    // Fetch User Auth Status , User Data and Cart Items
    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/user/is-auth');
            if (data.success) {
                setUser(data.user)
                setCartItems(data.user.cartItems)
            }
        } catch (error) {
            setUser(null)
        }
    }



    // Fetch All Products
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/product/list')
            if (data.success) {
                setProducts(data.products)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Add Product to Cart
    const addToCart = (productId, variantIndex) => {
        const key = `${productId}|${variantIndex}`;
        setCartItems((prev) => ({
            ...prev,
            [key]: prev[key] ? prev[key] + 1 : 1,
        }));
    };

    // Update Cart Item Quantity
    const updateCartItem = (cartKey, quantity) => {
        setCartItems((prev) => ({
            ...prev,
            [cartKey]: quantity,
        }));
    };


    // Remove Product from Cart
    const removeFromCart = (cartKey) => {
        setCartItems((prev) => {
            const updated = { ...prev };
            delete updated[cartKey];
            return updated;
        });
    };


    // Get Cart Item Count
    const getCartCount = () => {
        let totalCount = 0;
        for (const item in cartItems) {
            totalCount += cartItems[item];
        }
        return totalCount;
    }

    // Get Cart Total Amount
    const getCartAmount = () => {
        let totalAmount = 0;

        for (const key in cartItems) {
            const [productId, variantIndex] = key.split("|");
            const product = products.find((item) => item._id === productId);

            if (product) {
                const variant = product.variants?.[variantIndex];
                if (variant) {
                    totalAmount += variant.offerPrice * cartItems[key];
                }
            }
        }

        return Math.floor(totalAmount * 100) / 100;
    };


    useEffect(() => {
        fetchUser()
        fetchSeller()
        fetchProducts()
    }, [])

    // Update Database Cart Items
    useEffect(() => {
        const updateCart = async () => {
            try {
                const { data } = await axios.post('/api/cart/update', {
                    userId: user._id,     // ✅ Must include this!
                    cartItems: cartItems  // ✅ Good
                });
                if (!data.success) {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        };

        if (user) {
            updateCart();
        }
    }, [cartItems]);


    const value = {
        navigate, user, setUser, setIsSeller, isSeller,
        showUserLogin, setShowUserLogin, products, currency, addToCart, updateCartItem, removeFromCart, cartItems, searchQuery, setSearchQuery, getCartAmount, getCartCount, axios, fetchProducts, setCartItems
    }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = () => {
    return useContext(AppContext)
}
