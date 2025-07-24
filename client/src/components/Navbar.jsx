import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Navbar = () => {
  const [open, setOpen] = React.useState(false)
  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    setSearchQuery,
    searchQuery,
    mode,
    setMode
  } = useAppContext()

  const logout = () => {
    localStorage.clear()
    setUser(null)
    toast.success("Logged out")
    setOpen(false)
    navigate('/')
  }

  const handleModeChange = (e) => {
    setMode(e.target.value)
    localStorage.setItem('mode', e.target.value)
  }

  useEffect(() => {
    const savedMode = localStorage.getItem('mode')
    if (savedMode) setMode(savedMode)
  }, [])

  return (
    <header className="w-full sticky top-0 z-50 backdrop-blur-md shadow-md bg-white/70 dark:bg-black/60 transition-all duration-300">
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-8 py-2 md:py-3">
        
        {/* Logo */}
        <NavLink to="/" className="flex-shrink-0">
          <img
            src={assets.logo2}
            alt="logo"
            className="h-12 w-auto object-contain rounded-xl p-1 bg-white/10 dark:bg-white/10 backdrop-blur-md"
          />
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" className="rounded-full px-3 py-1 hover:bg-green-100 dark:hover:bg-green-900 transition">Home</NavLink>
          <NavLink to="/products" className="rounded-full px-3 py-1 hover:bg-green-100 dark:hover:bg-green-900 transition">All Products</NavLink>
          {user && <NavLink to="/my-orders" className="rounded-full px-3 py-1 hover:bg-green-100 dark:hover:bg-green-900 transition">My Orders</NavLink>}
          <NavLink to="/contact" className="rounded-full px-3 py-1 hover:bg-green-100 dark:hover:bg-green-900 transition">Contact</NavLink>

          {!user ? (
            <button onClick={() => setShowUserLogin(true)} className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition">
              Login
            </button>
          ) : (
            <button onClick={logout} className="bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition">
              Logout
            </button>
          )}

          {/* Mode Switch */}
          <select
            value={mode}
            onChange={handleModeChange}
            className="border border-green-600 text-green-700 dark:text-green-400 bg-transparent rounded px-2 py-1"
          >
            <option value="B2C">B2C</option>
            <option value="B2B">B2B</option>
          </select>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button
            className={`relative w-8 h-8 focus:outline-none group`}
            onClick={() => setOpen(!open)}
          >
            <span className={`absolute h-0.5 w-8 bg-black dark:bg-white rounded-full transition-transform duration-300 ${open ? 'rotate-45 top-3.5' : 'top-2'}`} />
            <span className={`absolute h-0.5 w-8 bg-black dark:bg-white rounded-full transition-opacity duration-300 ${open ? 'opacity-0' : 'top-4'}`} />
            <span className={`absolute h-0.5 w-8 bg-black dark:bg-white rounded-full transition-transform duration-300 ${open ? '-rotate-45 top-3.5' : 'top-6'}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden flex flex-col gap-4 px-6 pb-6 text-sm bg-white/80 dark:bg-black/80 backdrop-blur-lg transition-all">
          <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)}>All Products</NavLink>
          {user && <NavLink to="/my-orders" onClick={() => setOpen(false)}>My Orders</NavLink>}
          <NavLink to="/contact" onClick={() => setOpen(false)}>Contact</NavLink>

          {!user ? (
            <button onClick={() => {
              setOpen(false)
              setShowUserLogin(true)
            }} className="px-6 py-2 bg-green-600 text-white rounded-full">
              Login
            </button>
          ) : (
            <button onClick={logout} className="px-6 py-2 bg-red-600 text-white rounded-full">
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
          </select>
        </div>
      )}
    </header>
  )
}

export default Navbar
