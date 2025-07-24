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

    // Navigate to correct route
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
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">

      {/* Logo */}
      <NavLink to='/' onClick={() => setOpen(false)}>
        <img className="h-18 w-40 p-2" src={assets.logo2} alt="logo" />
      </NavLink>

      {/* Desktop Nav */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/products'>All Product</NavLink>
        <NavLink to='/About'>About</NavLink>
        <NavLink to='/Contact'>Contact Us</NavLink>

        {/* Search */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input onChange={(e) => setSearchQuery(e.target.value)} className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Search products" />
          <img src={assets.search_icon} alt='search' className='w-4 h-4' />
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
            <ul className='hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40'>
              <li onClick={() => navigate("my-orders")} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>My Orders</li>
              <li onClick={logout} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>Logout</li>
            </ul>
          </div>
        )}

        {/* ✅ Mode Switch */}
        <select
          value={mode}
          onChange={handleModeChange}
          className="border border-green-600 rounded px-2 py-1 text-sm text-green-700"
        >
          <option value="B2C">B2C</option>
          <option value="B2B">B2B</option>
          {/* <option value="seller">Seller</option>
          <option value="admin">Admin</option> */}
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

      {/* Mobile Nav Menu */}
      {open && (
        <div className={`absolute top-[70px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden z-50`}>
          <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)}>All Product</NavLink>
          {user && <NavLink to="/my-orders" onClick={() => setOpen(false)}>My Orders</NavLink>}
          <NavLink to="/Contact" onClick={() => setOpen(false)}>Contact</NavLink>

          {!user ? (
            <button onClick={() => {
              setOpen(false)
              setShowUserLogin(true)
            }} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
              Login
            </button>
          ) : (
            <button onClick={logout} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
              Logout
            </button>
          )}

          {/* ✅ Mode Switch for Mobile */}
          <select
            value={mode}
            onChange={(e) => {
              setOpen(false)
              handleModeChange(e)
            }}
            className="border border-green-600 mt-3 rounded px-2 py-1 text-sm text-green-700"
          >
            <option value="B2C">B2C</option>
            <option value="B2B">B2B</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      )}
    </nav>
  )
}

export default Navbar
