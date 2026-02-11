import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Search, Bell, Mic, ChevronDown, User, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';

const MobileHeader = () => {
    const { user, navigate, searchQuery, setSearchQuery, preferredAddress, unreadCount, installPwa, isPwaInstalled, deferredPrompt } = useAppContext();

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            navigate('/products');
        }
    };

    const handleVoiceSearch = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Voice search is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setSearchQuery(transcript);
            navigate('/products');
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
        };
    };

    return (
        <div className="md:hidden bg-[#E7F5EF] px-4 py-4 space-y-4">
            {/* Top Row: Avatar, Delivery Info, and Icons */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div
                        className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md flex items-center justify-center bg-white cursor-pointer active:scale-95 transition-transform"
                        onClick={() => navigate('/settings')}
                    >
                        {user?.avatar ? (
                            <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-inner">
                                <User size={24} strokeWidth={2.5} />
                            </div>
                        )}
                    </div>

                    {/* Delivery Info */}
                    <div className="flex flex-col cursor-pointer max-w-[180px]" onClick={() => navigate('/add-address', { state: { openMap: true } })}>
                        <span className="text-[11px] text-gray-500 font-bold uppercase tracking-tight leading-none mb-0.5">Delivery to</span>
                        <div className="flex items-center gap-1 overflow-hidden">
                            <span className="text-[14px] font-extrabold text-gray-800 truncate">
                                {preferredAddress
                                    ? `${preferredAddress.city || preferredAddress.street.split(',')[0]}...`
                                    : "Set Location"
                                }
                            </span>
                            <ChevronDown size={14} className="text-primary flex-shrink-0" />
                        </div>
                    </div>
                </div>

                {/* Icons */}
                <div className="flex items-center gap-2">
                    {/* PWA Install Button (Only visible if not installed) */}
                    {!isPwaInstalled && (
                        <button
                            className="bg-emerald-500 p-2.5 rounded-full shadow-lg shadow-emerald-200 text-white animate-pulse active:scale-95 transition-transform"
                            onClick={() => {
                                if (deferredPrompt) {
                                    installPwa();
                                } else {
                                    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
                                    if (isIOS) {
                                        toast('Tap Share ⎋ → Add to Home Screen ➕', {
                                            icon: '🍏',
                                            duration: 5000,
                                            style: { borderRadius: '12px', background: '#333', color: '#fff' },
                                        });
                                    } else {
                                        toast('Tap browser menu (⋮) → "Install App"', {
                                            icon: '📱',
                                            duration: 4000,
                                            style: { borderRadius: '12px', background: '#333', color: '#fff' },
                                        });
                                    }
                                }
                            }}
                        >
                            <Smartphone size={20} strokeWidth={2.5} />
                        </button>
                    )}

                    <button
                        className="p-3 bg-white rounded-full shadow-sm text-gray-600 relative active:scale-95 transition-transform"
                        onClick={() => navigate('/notifications')}
                    >
                        <Bell size={20} strokeWidth={2.5} />
                        {unreadCount > 0 && (
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white pulse"></span>
                        )}
                    </button>
                </div>
            </div>

            {/* Bottom Row: Search Bar */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-11 flex items-center pointer-events-none text-gray-400">
                    {/* Search icon inside input */}
                </div>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    placeholder="Search Grocery"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    className="w-full bg-white border-none rounded-[18px] py-3.5 pl-11 pr-12 text-[15px] shadow-sm placeholder:text-gray-400 font-medium outline-none"
                />
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                    <div
                        onClick={handleVoiceSearch}
                        className="w-10 h-10 bg-[#D1EBE1] rounded-[14px] flex items-center justify-center text-[#10B981] active:scale-95 transition-all cursor-pointer"
                    >
                        <Mic size={20} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileHeader;
