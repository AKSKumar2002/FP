import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Notifications = () => {
    const navigate = useNavigate();
    const { notifications, fetchNotifications, axios, user, setUnreadCount } = useAppContext();

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);

    const markAllAsRead = async () => {
        if (!user) return;
        try {
            const { data } = await axios.post('/api/notification/read-all', { userId: user._id });
            if (data.success) {
                fetchNotifications();
                setUnreadCount(0);
                toast.success("All caught up!");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getIconAndColor = (type) => {
        switch (type) {
            case 'order': return { icon: "🚚", color: "bg-green-50 text-green-600" };
            case 'payment': return { icon: "💳", color: "bg-blue-50 text-blue-600" };
            case 'sale': return { icon: "⚡", color: "bg-orange-50 text-orange-600" };
            case 'info':
            default: return { icon: "📖", color: "bg-emerald-50 text-emerald-600" };
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-lg flex items-center justify-center text-4xl mb-6">🔒</div>
                <h1 className="text-2xl font-black text-gray-800 mb-2">Login Required</h1>
                <p className="text-gray-500 mb-8">Please login to see your personalized notifications.</p>
                <button
                    onClick={() => navigate('/login')}
                    className="w-full max-w-xs bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-100 active:scale-95 transition-all"
                >
                    Login Now
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white sticky top-0 z-10 shadow-sm px-4 py-6 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-extrabold text-gray-800">Notifications</h1>
            </div>

            <div className="p-4 space-y-4">
                {notifications.length > 0 ? (
                    notifications.map((notif) => {
                        const { icon, color } = getIconAndColor(notif.type);
                        return (
                            <div
                                key={notif._id}
                                className={`bg-white p-5 rounded-[2rem] shadow-sm border-l-4 transition-all active:scale-[0.98] ${!notif.read ? 'border-primary' : 'border-transparent'}`}
                            >
                                <div className="flex gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl shadow-inner ${color}`}>
                                        {icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1.5">
                                            <h3 className={`font-black text-base transition-colors ${!notif.read ? 'text-gray-900' : 'text-gray-500'}`}>
                                                {notif.title}
                                            </h3>
                                            <span className="text-[10px] font-black text-gray-400 whitespace-nowrap uppercase tracking-tighter">
                                                {formatTime(notif.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                            {notif.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center scale-in-center">
                        <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center text-5xl mb-6">
                            📭
                        </div>
                        <h2 className="text-2xl font-black text-gray-800 mb-2">All Caught Up!</h2>
                        <p className="text-gray-500 font-medium max-w-[200px] mx-auto leading-tight">We'll notify you when something fresh happens.</p>
                    </div>
                )}
            </div>

            {/* Clear All Button */}
            {notifications.some(n => !n.read) && (
                <div className="px-6 mt-6">
                    <button
                        onClick={markAllAsRead}
                        className="w-full py-4 text-xs font-black text-gray-400 hover:text-primary uppercase tracking-[0.2em] transition-all bg-white rounded-2xl border border-gray-100 shadow-sm"
                    >
                        Mark all as read
                    </button>
                </div>
            )}
        </div>
    );
};

export default Notifications;
