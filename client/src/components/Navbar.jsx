import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState(localStorage.getItem('siteMode') || 'B2C')

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

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate('/products')
    }
  }, [searchQuery])

  return (
    <nav className="backdrop-blur-md bg-[rgba(255,255,255,0.65)] text-black border-b border-gray-300 shadow-md flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 sticky top-0 z-50 transition-all">

      {/* Logo */}
      <NavLink to='/' onClick={() => setOpen(false)} className="rounded-lg bg-white/60 backdrop-blur-sm p-1.5 shadow-sm">
        <img className="h-14 w-auto rounded-lg object-contain" src={assets.logo2} alt="logo" />
      </NavLink>

      {/* Desktop Nav */}
      <div className="hidden sm:flex items-center gap-8 text-gray-800">
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/products'>All Product</NavLink>
        <NavLink to='/About'>About</NavLink>
        <NavLink to='/Contact'>Contact Us</NavLink>

        {/* Search */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 py-1 rounded-full bg-white/50 backdrop-blur">
          <input onChange={(e) => setSearchQuery(e.target.value)} className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500 text-black" type="text" placeholder="Search products" />
          <img src={assets.search_icon} alt='search' className='w-4 h-4 opacity-70' />
        </div>

        {/* Cart */}
        <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
          <img src={assets.nav_cart_icon} alt='cart' className='w-6 opacity-80' />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
        </div>

        {/* Login/Profile */}
        {!user ? (
          <button onClick={() => setShowUserLogin(true)} className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full">
            Login
          </button>
        ) : (
          <div className='relative group'>
            <img src={assets.profile_icon} className='w-10' alt="profile" />
            <ul className='hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40 text-black'>
              <li onClick={() => navigate("my-orders")} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>My Orders</li>
              <li onClick={logout} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>Logout</li>
            </ul>
          </div>
        )}

        {/* Mode Switch for Desktop */}
        <select
          value={mode}
          onChange={handleModeChange}
          className="border border-green-600 rounded px-2 py-1 text-sm text-green-1000 bg-white/60 backdrop-blur-sm"
        >
          <option value="B2C">B2C</option>
          <option value="B2B">B2B</option>
        </select>
      </div>

      {/* Mobile Nav Toggle */}
      <div className='flex items-center gap-6 sm:hidden'>
        <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
          <img src={assets.nav_cart_icon} alt='cart' className='w-6 opacity-80' />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
        </div>
        <button onClick={() => setOpen(!open)} aria-label="Menu">
          <img src={assets.menu_icon} alt='menu' />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="absolute top-[70px] left-0 w-full bg-white/80 backdrop-blur-md shadow-md py-4 flex-col items-start gap-2 px-5 text-sm sm:hidden z-50 text-black">
          <NavLink to="/" onClick={() => setOpen(false)} className="block py-2">Home</NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)} className="block py-2">All Product</NavLink>
          {user && <NavLink to="/my-orders" onClick={() => setOpen(false)} className="block py-2">My Orders</NavLink>}
          <NavLink to="/Contact" onClick={() => setOpen(false)} className="block py-2">Contact</NavLink>

          {!user ? (
            <button
              onClick={() => {
                setOpen(false)
                setShowUserLogin(true)
              }}
              className="w-full mt-3 py-2 text-white bg-primary hover:bg-primary-dull rounded-full text-sm"
            >
              Login
            </button>
          ) : (
            <button
              onClick={logout}
              className="w-full mt-3 py-2 text-white bg-primary hover:bg-primary-dull rounded-full text-sm"
            >
              Logout
            </button>
          )}

          {/* Vertical Dropdown Mode Switch */}
          <div className="w-full mt-3">
            <label className="block text-sm mb-1 text-gray-700">Switch Mode:</label>
            <select
              value={mode}
              onChange={(e) => {
                setOpen(false)
                handleModeChange(e)
              }}
              className="w-full border border-green-600 rounded px-2 py-1 text-sm text-green-700 bg-white/60 backdrop-blur-sm"
            >
              <option value="B2C">B2C</option>
              <option value="B2B">B2B</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
