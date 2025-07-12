import React, { useEffect, useState } from 'react'
import MainBanner from '../components/MainBanner'
import Categories from '../components/Categories'
import BestSeller from '../components/BestSeller'
import BottomBanner from '../components/BottomBanner'
import NewsLetter from '../components/NewsLetter'
import LocationModal from '../components/LocationModal'

const Home = () => {
  const [showLocationModal, setShowLocationModal] = useState(false)

  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation')
    if (!savedLocation) {
      setShowLocationModal(true)
    }
  }, [])

  const handleLocationSelect = async (location) => {
    localStorage.setItem('userLocation', location)
    setShowLocationModal(false)

    // Send location to backend
    try {
      await fetch('http://localhost:5000/api/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location }),
      })
    } catch (error) {
      console.error('Error saving location to backend:', error)
    }
  }

  return (
    <div className='mt-10'>
      {showLocationModal && <LocationModal onSelect={handleLocationSelect} />}
      <MainBanner />
      <Categories />
      <BestSeller />
      <BottomBanner />
      <NewsLetter />
    </div>
  )
}

export default Home
