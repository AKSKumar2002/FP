import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets' // make sure logo2, icons exist
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState(localStorage.getItem('siteMode') || 'B2C')
  const [dark, setDark] = useState(localStorage.getItem('darkMode') === 'true')

  const { user, setUser, setShowUserLogin, navigate, setSearchQuery, searchQuery, getCartCount, axios } = useAppContext()

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

  const toggleDarkMode = () => {
    setDark(!dark)
    localStorage.setItem('darkMode', !dark)
    document.documentElement.classList.toggle('dark')
  }

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate('/products')
    }
  }, [searchQuery])

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])

  return (
    <nav className="sticky top-0 z-50 bg-white/30 dark:bg-black/30 backdrop-blur-lg shadow-md border-b border-white/40 dark:border-white/10 transition-all">
      <div className="flex items-center justify-between px-6 md:px-12 py-3">

        {/* Logo inside frosted glass */}
        <NavLink to="/" className="flex-shrink-0">
          <img
            src={assets.logo2}
            alt="logo"
            className="h-13 w-auto object-contain rounded-xl p-1 bg-white/10 dark:bg-white/10 backdrop-blur-md"
          />
        </NavLink>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {['Home', 'Products', 'About', 'Contact'].map((item) => (
            <NavLink
              key={item}
              to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
              className="px-4 py-2 rounded-full hover:bg-white/10 dark:hover:bg-white/10 transition"
            >
              {item === 'Products' ? 'All Products' : item}
            </NavLink>
          ))}

          {/* Search */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 dark:bg-white/10 border border-gray-300 dark:border-gray-700">
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm w-44 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              type="text"
              placeholder="Search products"
            />
            <img src={assets.search_icon} alt="search" className="w-4 h-4" />
          </div>

          {/* Cart */}
          <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
            <img src={assets.nav_cart_icon} alt="cart" className="w-6 opacity-80" />
            <span className="absolute -top-2 -right-3 text-xs text-white bg-primary w-5 h-5 rounded-full flex items-center justify-center">{getCartCount()}</span>
          </div>

          {/* Login/Profile */}
          {!user ? (
            <button onClick={() => setShowUserLogin(true)} className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dull transition">
              Login
            </button>
          ) : (
            <div className="relative group">
              <img src={assets.profile_icon} className="w-10 cursor-pointer" alt="profile" />
              <ul className="hidden group-hover:block absolute top-12 right-0 bg-white dark:bg-gray-800 shadow-lg border rounded-md py-2 z-40 text-sm">
                <li onClick={() => navigate("/my-orders")} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">My Orders</li>
                <li onClick={logout} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Logout</li>
              </ul>
            </div>
          )}

          {/* Mode Dropdown */}
          <select
            value={mode}
            onChange={handleModeChange}
            className="border border-green-600 text-green-700 dark:text-green-400 bg-transparent rounded px-2 py-1"
          >
            <option value="B2C">B2C</option>
            <option value="B2B">B2B</option>
            {/* <option value="seller">Seller</option>
            <option value="admin">Admin</option> */}
          </select>

          {/* Dark Mode Toggle */}
          <button onClick={toggleDarkMode} className="text-xs px-2 py-1 rounded-full border dark:border-gray-600">
            {dark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden flex flex-col gap-[6px] z-50">
          <span className={`w-6 h-0.5 bg-black dark:bg-white rounded transition-all duration-300 ${open ? 'rotate-45 translate-y-1.5' : ''}`} />
          <span className={`w-6 h-0.5 bg-black dark:bg-white rounded transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`w-6 h-0.5 bg-black dark:bg-white rounded transition-all duration-300 ${open ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden flex flex-col gap-4 px-6 pb-6 text-sm bg-white/80 dark:bg-black/80 backdrop-blur-lg transition-all">
          <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)}>All Products</NavLink>
          {user && <NavLink to="/my-orders" onClick={() => setOpen(false)}>My Orders</NavLink>}
          <NavLink to="/Contact" onClick={() => setOpen(false)}>Contact</NavLink>

          {!user ? (
            <button onClick={() => {
              setOpen(false)
              setShowUserLogin(true)
            }} className="px-6 py-2 bg-primary text-white rounded-full">
              Login
            </button>
          ) : (
            <button onClick={logout} className="px-6 py-2 bg-primary text-white rounded-full">
              Logout
            </button>
          )}

          <select
            value={mode}
            onChange={(e) => {
              setOpen(false)
              handleModeChange(e)
            }}
            className="border border-green-600 rounded px-2 py-1 text-green-700"
          >
            <option value="B2C">B2C</option>
            <option value="B2B">B2B</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>

          <button onClick={toggleDarkMode} className="text-xs px-2 py-1 rounded-full border w-fit dark:border-gray-600">
            {dark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar
