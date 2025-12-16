// Navbar.jsx
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBoxOpen, faInfoCircle, faPhone, faShoppingBag, faSignInAlt, faSignOutAlt, faNewspaper } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ onMenuClick }) => {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState(localStorage.getItem('siteMode') || 'B2C')
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownFixed, setDropdownFixed] = useState(false);
  const dropdownCloseTimeout = React.useRef(null);

  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    setSearchQuery,
    searchQuery,
    getCartCount,
    axios,
    animateCart,
    products,
    currency,
  } = useAppContext()

  const logout = async () => {
    try {
      const { data } = await axios.get('/api/user/logout')
      if (data.success) {
        toast.success(data.message)
        setUser(null)
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleModeChange = (e) => {
    const selectedMode = e.target.value
    setMode(selectedMode)
    localStorage.setItem('siteMode', selectedMode)

    if (selectedMode === 'B2B') navigate('/b2b')
    else if (selectedMode === 'seller') navigate('/seller')
    else if (selectedMode === 'admin') navigate('/admin')
    else navigate('/')
  }

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    setShowSearchResults(value.length > 0)
  }

  const handleSearchResultClick = (product) => {
    setSearchQuery('')
    setShowSearchResults(false)
    navigate(`/products/${product.category?.name?.toLowerCase()}/${product._id}`)
    window.scrollTo(0, 0)
  }

  const handleProfileMouseEnter = () => {
    if (dropdownCloseTimeout.current) {
      clearTimeout(dropdownCloseTimeout.current);
      dropdownCloseTimeout.current = null;
    }
    setDropdownOpen(true);
  };

  const handleProfileMouseLeave = () => {
    if (!dropdownFixed) {
      dropdownCloseTimeout.current = setTimeout(() => {
        setDropdownOpen(false);
      }, 180);
    }
  };

  const handleProfileClick = () => {
    if (dropdownCloseTimeout.current) {
      clearTimeout(dropdownCloseTimeout.current);
      dropdownCloseTimeout.current = null;
    }
    setDropdownOpen(true);
    setDropdownFixed(true);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
    setDropdownFixed(false);
  };

  useEffect(() => {
    return () => {
      if (dropdownCloseTimeout.current) {
        clearTimeout(dropdownCloseTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest('.profile-dropdown-trigger') &&
        !event.target.closest('.profile-dropdown-menu')
      ) {
        closeDropdown();
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const filteredSearchResults = products
    .filter(product => {
      if (!product.inStock) return false;

      const query = String(searchQuery || '').toLowerCase();
      const productName = String(product.name || '').toLowerCase();

      return productName.includes(query);
    })
    .slice(0, 5)

  useEffect(() => {
    // Remove the auto-navigation effect
    // if (searchQuery.length > 0) {
    //   navigate('/products')
    // }
  }, [searchQuery])


  return (
    <nav className="backdrop-blur-md bg-[rgba(255,255,255,0.65)] text-black border-b border-gray-300 shadow-md px-6 md:px-12 lg:px-20 xl:px-28 py-2 sticky top-0 z-50 transition-all">
      {/* ========== MOBILE ONLY - Logo + Hamburger ========== */}
      <div className="md:hidden flex items-center justify-between w-full">
        {/* Logo LEFT */}
        <NavLink
          to="/"
          onClick={() => {
            setOpen(false);
            window.location.href = '/';
          }}
          className="rounded-lg bg-white/60 backdrop-blur-sm p-1 shadow-sm"
        >
          <img className="h-10 w-auto rounded-lg object-contain" src={assets.logo2} alt="logo" />
        </NavLink>

        {/* Hamburger RIGHT - ONLY ICON IN MOBILE */}
        <button
          onClick={onMenuClick}
          className="p-2 -mr-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* ========== DESKTOP ONLY - Full Navbar ========== */}
      <div className="hidden md:flex items-center justify-between w-full">
        {/* Desktop Logo */}
        <NavLink
          to="/"
          onClick={() => {
            setOpen(false);
            window.location.href = '/';
          }}
          className="rounded-lg bg-white/60 backdrop-blur-sm p-1 shadow-sm"
        >
          <img className="h-10 w-auto rounded-lg object-contain" src={assets.logo2} alt="logo" />
        </NavLink>

        <div className="hidden sm:flex items-center gap-8 text-gray-800">
          <NavLink to='/' className="hover:scale-110 hover:text-primary transition duration-200">Home</NavLink>
          <NavLink to='/products' className="hover:scale-110 hover:text-primary transition duration-200">All Products</NavLink>
          <NavLink to='/About' className="hover:scale-110 hover:text-primary transition duration-200">About</NavLink>
          <NavLink to='/blog' className="hover:scale-110 hover:text-primary transition duration-200">Blog</NavLink>
          <NavLink to='/Contact' className="hover:scale-110 hover:text-primary transition duration-200">Contact Us</NavLink>

          <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-2 py-1 rounded-full bg-white/50 backdrop-blur relative">
            <input
              onChange={handleSearchChange}
              value={searchQuery || ''}
              onFocus={() => (searchQuery || '').length > 0 && setShowSearchResults(true)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 300)}
              className="py-1 w-full bg-transparent outline-none placeholder-gray-500 text-black"
              type="text"
              placeholder="Search products"
            />
            <img src={assets.search_icon} alt='search' className='w-4 h-4 opacity-70' />

            {showSearchResults && filteredSearchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-[60] max-h-96 overflow-y-auto">
                {filteredSearchResults.map((product) => (
                  <div
                    key={product._id}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSearchResultClick(product)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  >
                    <img
                      src={product.image[0]}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.category?.name}
                      </p>
                      <p className="text-xs text-primary font-medium">
                        {currency}{product.variants[0].offerPrice}
                      </p>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
              </div>
            )}

            {showSearchResults && (searchQuery || '').length > 0 && filteredSearchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-[60] p-4 text-center">
                <p className="text-sm text-gray-500">No products found for "{searchQuery}"</p>
              </div>
            )}
          </div>

          {/* Cart Icon - HIDDEN ON MOBILE */}
          <div onClick={() => navigate("/cart")} className="hidden md:block relative cursor-pointer">
            <img
              id="cart-icon"
              src={assets.nav_cart_icon}
              alt='cart'
              className={`w-5 opacity-80 transition-transform duration-300 ${animateCart ? "animate-bounce" : ""}`}
            />
            <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[16px] h-[16px] rounded-full">
              {getCartCount()}
            </button>
          </div>

          {/* Login/Profile - HIDDEN ON MOBILE */}
          {!user ? (
            <button onClick={() => setShowUserLogin(true)} className="hidden md:block cursor-pointer px-6 py-1.5 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
              Login / Signup
            </button>
          ) : (
            <div className="hidden md:block relative flex items-center">
              {/* Profile trigger */}
              <div
                className="profile-dropdown-trigger flex items-center cursor-pointer select-none"
                onMouseEnter={handleProfileMouseEnter}
                onMouseLeave={handleProfileMouseLeave}
                onClick={handleProfileClick}
                tabIndex={0}
                style={{ minWidth: '120px' }}
              >
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  Hi, <span className="text-primary font-semibold">{user.name}</span>
                </span>
                <img src={assets.profile_icon} className='w-8 h-8 cursor-pointer ml-2 rounded-full border border-gray-200 bg-white' alt="profile" />
              </div>
              {/* Dropdown menu */}
              {dropdownOpen && (
                <div
                  className="profile-dropdown-menu absolute right-0 top-[calc(100%+8px)] w-48 bg-white rounded-xl shadow-2xl z-[100] border border-gray-200 animate-fadeIn"
                  onMouseEnter={handleProfileMouseEnter}
                  onMouseLeave={handleProfileMouseLeave}
                  style={{
                    minWidth: '180px',
                    padding: '0.5rem 0',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  }}
                >
                  <ul className='py-1 text-sm text-black'>
                    <li
                      onClick={() => {
                        navigate("my-orders");
                        closeDropdown();
                      }}
                      className='px-5 py-2 hover:bg-primary/10 cursor-pointer rounded transition'
                    >
                      My Orders
                    </li>
                    <li
                      onClick={() => {
                        logout();
                        closeDropdown();
                      }}
                      className='px-5 py-2 hover:bg-primary/10 cursor-pointer rounded transition'
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Close Desktop Navbar Container */}
      </div>
    </nav>
  )
}

export default Navbar
