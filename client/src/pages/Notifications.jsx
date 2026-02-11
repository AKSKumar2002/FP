import React from 'react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
    const navigate = useNavigate();

    const notifications = [
        {
            id: 1,
            title: "Order Delivered! 🚚",
            message: "Your order #FP12345 has been delivered successfully. Enjoy your fresh picks!",
            time: "2h ago",
            isNew: true,
            icon: "✅",
            color: "bg-green-50 text-green-600"
        },
        {
            id: 2,
            title: "Flash Sale Alert! ⚡",
            message: "Get up to 50% OFF on all organic fruits for the next 3 hours. Grab them now!",
            time: "5h ago",
            isNew: true,
            icon: "🔥",
            color: "bg-orange-50 text-orange-600"
        },
        {
            id: 3,
            title: "New Blog Post 📖",
            message: "Check out our latest tips on how to keep your greens fresh for 2 weeks!",
            time: "1d ago",
            isNew: false,
            icon: "🌱",
            color: "bg-emerald-50 text-emerald-600"
        },
        {
            id: 4,
            title: "Payment Confirmed 💳",
            message: "We've received your payment for order #FP12345. Preparing your items!",
            time: "2d ago",
            isNew: false,
            icon: "💰",
            color: "bg-blue-50 text-blue-600"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white sticky top-0 z-10 shadow-sm px-4 py-4 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold text-gray-800">Notifications</h1>
            </div>

            <div className="p-4 space-y-4">
                {notifications.length > 0 ? (
                    notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`bg-white p-4 rounded-2xl shadow-sm border-l-4 transition-all active:scale-[0.98] ${notif.isNew ? 'border-[#10B981]' : 'border-transparent'}`}
                        >
                            <div className="flex gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl ${notif.color}`}>
                                    {notif.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className={`font-bold transition-colors ${notif.isNew ? 'text-gray-900' : 'text-gray-600'}`}>
                                            {notif.title}
                                        </h3>
                                        <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap">{notif.time}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        {notif.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl mb-4">
                            📭
                        </div>
                        <h2 className="text-lg font-bold text-gray-800">No Notifications</h2>
                        <p className="text-gray-500 text-sm">We'll notify you when something important happens.</p>
                    </div>
                )}
            </div>

            {/* Clear All Button */}
            {notifications.length > 0 && (
                <div className="px-4 mt-6">
                    <button className="w-full py-3 text-sm font-bold text-gray-400 hover:text-red-500 transition-colors">
                        Mark all as read
                    </button>
                </div>
            )}
        </div>
    );
};

export default Notifications;
