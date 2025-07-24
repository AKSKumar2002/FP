import React, { useEffect, useState, useRef } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast'
import io from "socket.io-client"

const socket = io("http://localhost:4000", { withCredentials: true })

// ✅ Make sure the bell sound is inside your public folder
const bellSound = new Audio('/bell-notification-337658.mp3')
bellSound.preload = 'auto'

const Orders = () => {
  const { currency, axios } = useAppContext()
  const [orders, setOrders] = useState([])
  const prevOrdersRef = useRef([])
  const [soundEnabled, setSoundEnabled] = useState(false)

  // ✅ Load bell sound enabled flag on first mount
  useEffect(() => {
    const saved = localStorage.getItem('bellSoundEnabled')
    if (saved === 'true') {
      setSoundEnabled(true)
    }
  }, [])

  const enableSound = () => {
    bellSound.play().catch(() => {})
    bellSound.pause()
    setSoundEnabled(true)
    localStorage.setItem('bellSoundEnabled', 'true') // ✅ persist flag
    toast.success('🔔 Sound enabled! New orders will ring.')
  }

  const playBellSound = () => {
    let playCount = 0
    const interval = setInterval(() => {
      const sound = new Audio('/bell-notification-337658.mp3') // ✅ new instance each time
      sound.play().catch(err => console.log(err))
      playCount++
      if (playCount >= 10) {
        clearInterval(interval)
      }
    }, 1000)
  }

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/order/seller')
      if (data.success) {
        if (
          prevOrdersRef.current.length > 0 &&
          data.orders.length > prevOrdersRef.current.length
        ) {
          if (soundEnabled) playBellSound()
        }
        prevOrdersRef.current = [...data.orders]
        setOrders(data.orders)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 500)
    return () => clearInterval(interval)
  }, [soundEnabled])

  // ✅ Listen for socket event
  useEffect(() => {
    socket.on('new-order', (newOrder) => {
      toast.success('📦 New Order Received!')
      setOrders(prev => [newOrder, ...prev])
      prevOrdersRef.current = [newOrder, ...prevOrdersRef.current]
      if (soundEnabled) playBellSound()
    })

    return () => {
      socket.off('new-order')
    }
  }, [soundEnabled])

  return (
    <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll'>
      <div className="md:p-10 p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Orders List</h2>
          {!soundEnabled && (
            <button
              onClick={enableSound}
              className="px-4 py-2 bg-primary text-white rounded"
            >
              Enable Bell Sound 🔔
            </button>
          )}
        </div>

        {orders.map((order, index) => (
          <div
            key={index}
            className="flex flex-col md:items-center md:flex-row gap-5 justify-between p-5 max-w-4xl rounded-md border border-gray-300"
          >
            <div className="flex flex-col gap-4 max-w-80">
              {order.items.map((item, index) => {
                const variantIndex = item.variantIndex ?? 0
                const variant = item.product?.variants?.[variantIndex] || {}

                return (
                  <div key={index} className="flex gap-5">
                    <img
                      className="w-12 h-12 object-cover"
                      src={assets.box_icon}
                      alt="boxIcon"
                    />
                    <div>
                      <p className="font-medium">
                        {item.product?.name || "Deleted Product"}{" "}
                        <span className="text-primary">x {item.quantity}</span>
                      </p>
                      <p className="text-sm text-black/60">
                        Category: {item.product?.category?.name || "N/A"}
                      </p>
                      <p className="text-sm text-black/60">
                        Variant: {variant.weight || "-"} {variant.unit || ""}
                      </p>
                      <p className="text-sm text-black/60">
                        Unit Price: {currency}{variant.offerPrice || 0}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="text-sm md:text-base text-black/60">
              {order.address ? (
                <>
                  <p className='text-black/80'>
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <p>{order.address.street}, {order.address.city}</p>
                  <p>{order.address.state}, {order.address.zipcode}, {order.address.country}</p>
                  <p>{order.address.phone}</p>
                </>
              ) : (
                <p className="text-red-500">No address info</p>
              )}
            </div>

            <p className="font-medium text-lg my-auto">
              {currency}{order.amount}
            </p>

            <div className="flex flex-col text-sm md:text-base text-black/60">
              <p>Method: {order.paymentType}</p>
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
