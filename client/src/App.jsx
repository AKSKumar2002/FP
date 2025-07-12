import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import { Toaster } from "react-hot-toast";
import Footer from './components/Footer';
import { useAppContext } from './context/AppContext';
import Login from './components/Login';
import AllProducts from './pages/AllProducts';
import ProductCategory from './pages/ProductCategory';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AddAddress from './pages/AddAddress';
import MyOrders from './pages/MyOrders';
import SellerLogin from './components/seller/SellerLogin';
import SellerLayout from './pages/seller/SellerLayout';
import AddProduct from './pages/seller/AddProduct';
import ProductList from './pages/seller/ProductList';
import Orders from './pages/seller/Orders';
import Loading from './components/Loading';

// Properly routed B2B and Admin pages
const B2BPage = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-green-50 text-green-800 px-4 text-center">
    <h1 className="text-4xl font-bold mb-4 animate-bounce">🚧 B2B Portal</h1>
    <p className="mb-2 text-lg">Server under maintenance.</p>
    <p className="mb-4">This feature will be live soon.</p>
    <div className="bg-green-100 px-4 py-2 rounded shadow-sm mb-6">
      Please contact <strong>Admin - Mr.AKS</strong> for further details.
    </div>
    <a
      href="/"
      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded transition"
    >
      Go Back to Home
    </a>
  </div>
);

const AdminPage = () => (
  <div className="text-center mt-20 text-xl text-gray-600">Admin Panel Coming Soon</div>
);

const App = () => {
  const isSellerPath = useLocation().pathname.includes("seller");
  const { showUserLogin, isSeller } = useAppContext();
  const navigate = useNavigate();

  const [showInitialLoader, setShowInitialLoader] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isModeSelected, setIsModeSelected] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialLoader(false);
      setShowDropdown(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleSelect = (e) => {
    const selected = e.target.value;
    if (selected === "B2B") {
      navigate("/b2b"); // ✅ Correct path
    } else if (selected === "Admin") {
      navigate("/admin");
    } else {
      navigate("/"); // Default B2C
    }
    setIsModeSelected(true);
  };

  if (showInitialLoader) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white text-green-700">
        <div className="flex items-center justify-center w-44 h-44 mb-6 bg-white rounded-full shadow-lg">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-36 h-36 object-contain"
            loading="eager"
          />
        </div>
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-green-500 border-dotted rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-2 border-green-300 border-solid rounded-full animate-spin-slower"></div>
        </div>
        <p className="mt-4 text-sm text-green-600 tracking-wide">Loading FarmPick...</p>
      </div>
    );
  }

  if (showDropdown && !isModeSelected) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white text-green-700">
        <div className="mb-4 text-xl font-semibold">Hi User</div>
        <select
          onChange={handleSelect}
          defaultValue=""
          className="border border-green-500 rounded px-4 py-2 text-green-700 focus:outline-none"
        >
          <option value="">Select Site</option>
          <option value="B2C">1. B2C</option>
          <option value="B2B">2. B2B</option>
          <option value="Admin">3. Admin</option>
        </select>
      </div>
    );
  }

  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
      {!isSellerPath && <Navbar />}
      {showUserLogin && <Login />}
      <Toaster />
      <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/b2b' element={<B2BPage />} /> {/* ✅ Correct route */}
          <Route path='/admin' element={<AdminPage />} />
          <Route path='/products' element={<AllProducts />} />
          <Route path='/products/:category' element={<ProductCategory />} />
          <Route path='/products/:category/:id' element={<ProductDetails />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/add-address' element={<AddAddress />} />
          <Route path='/my-orders' element={<MyOrders />} />
          <Route path='/loader' element={<Loading />} />
          <Route path='/seller' element={isSeller ? <SellerLayout /> : <SellerLogin />}>
            <Route index element={isSeller ? <AddProduct /> : null} />
            <Route path='product-list' element={<ProductList />} />
            <Route path='orders' element={<Orders />} />
          </Route>
        </Routes>
      </div>
      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;
