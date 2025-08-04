// Navbar.jsx
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState(localStorage.getItem('siteMode') || 'B2C')

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

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate('/products')
    }
  }, [searchQuery])

  return (
    <nav className="backdrop-blur-md bg-[rgba(255,255,255,0.65)] text-black border-b border-gray-300 shadow-md flex items-center justify-between px-6 md:px-12 lg:px-20 xl:px-28 py-2 sticky top-0 z-50 transition-all">
      <NavLink to='/' onClick={() => setOpen(false)} className="rounded-lg bg-white/60 backdrop-blur-sm p-1 shadow-sm">
        <img className="h-10 w-auto rounded-lg object-contain" src={assets.logo2} alt="logo" />
      </NavLink>

      <div className="hidden sm:flex items-center gap-8 text-gray-800">
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/products'>All Product</NavLink>
        <NavLink to='/About'>About</NavLink>
        <NavLink to='/Contact'>Contact Us</NavLink>

        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-2 py-1 rounded-full bg-white/50 backdrop-blur">
          <input onChange={(e) => setSearchQuery(e.target.value)} className="py-1 w-full bg-transparent outline-none placeholder-gray-500 text-black" type="text" placeholder="Search products" />
          <img src={assets.search_icon} alt='search' className='w-4 h-4 opacity-70' />
        </div>

        <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
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

        {!user ? (
          <button onClick={() => setShowUserLogin(true)} className="cursor-pointer px-6 py-1.5 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
            Login
          </button>
        ) : (
          <div className='relative group'>
            <img src={assets.profile_icon} className='w-8' alt="profile" />
            <ul className='hidden group-hover:block absolute top-8 right-0 bg-white shadow border border-gray-200 py-2 w-28 rounded-md text-sm z-40 text-black'>
              <li onClick={() => navigate("my-orders")} className='p-1 pl-3 hover:bg-primary/10 cursor-pointer'>My Orders</li>
              <li onClick={logout} className='p-1 pl-3 hover:bg-primary/10 cursor-pointer'>Logout</li>
            </ul>
          </div>
        )}
      </div>

      <div className='flex items-center gap-4 sm:hidden'>
        <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
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
        <button onClick={() => setOpen(!open)} aria-label="Menu">
          <img src={assets.menu_icon} alt='menu' />
        </button>
      </div>

      {open && (
        <div className="md:hidden absolute top-[60px] left-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-lg py-4 px-4 flex flex-col gap-3 text-black rounded-b-xl text-sm">
          <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)}>All Product</NavLink>
          <NavLink to="/About" onClick={() => setOpen(false)}>About</NavLink>
          <NavLink to="/Contact" onClick={() => setOpen(false)}>Contact</NavLink>
          {user && <NavLink to="/my-orders" onClick={() => setOpen(false)}>My Orders</NavLink>}
          {!user ? (
            <button onClick={() => {
              setOpen(false)
              setShowUserLogin(true)
            }} className="cursor-pointer px-5 py-1.5 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
              Login
            </button>
          ) : (
            <button onClick={logout} className="cursor-pointer px-5 py-1.5 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
