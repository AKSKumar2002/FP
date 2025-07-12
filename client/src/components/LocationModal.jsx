import React, { useState } from 'react'

const LocationModal = ({ onSelect }) => {
  const [location, setLocation] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (location.trim()) {
      onSelect(location.trim())
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-[90%] max-w-md border border-green-200">
        <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
          🌾 Choose Your Delivery Location
        </h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          Select your city or pincode to check availability of fresh farm produce.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your city or pincode"
            className="w-full px-4 py-2 border border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-4 text-sm"
            required
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold w-full py-2 rounded-lg transition duration-200 shadow"
          >
            ✅ Save Location
          </button>
        </form>
      </div>
    </div>
  )
}

export default LocationModal
