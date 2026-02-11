import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FloatingActionButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleOpen = () => setIsOpen(!isOpen);

    const handleWhatsApp = () => {
        // Replace with your actual WhatsApp number
        window.open('https://wa.me/918825935176', '_blank');
    };

    const menuItems = [
        {
            label: 'Chat with us',
            icon: (
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
            ),
            onClick: handleWhatsApp,
            delay: '100ms'
        },
        {
            label: 'Track order',
            icon: (
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            onClick: () => navigate('/my-orders'),
            delay: '50ms'
        },
        {
            label: 'Contact us',
            icon: (
                <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            onClick: () => navigate('/contact'),
            delay: '0ms'
        }
    ];

    return (
        <div className="md:hidden fixed bottom-[100px] right-6 flex flex-col items-end gap-3 z-50 pointer-events-none">
            {/* Expanded Menu Options */}
            <div className={`flex flex-col gap-3 transition-all duration-300 pointer-events-auto ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            item.onClick();
                            setIsOpen(false);
                        }}
                        className="flex items-center gap-3 bg-white pl-2 pr-4 py-2 rounded-full shadow-lg border border-gray-100 active:scale-95 transition-transform"
                        style={{ transitionDelay: isOpen ? item.delay : '0ms' }}
                    >
                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                            {item.icon}
                        </div>
                        <span className="font-semibold text-gray-700 text-sm whitespace-nowrap">{item.label}</span>
                    </button>
                ))}
            </div>

            {/* Main Toggle Button */}
            <button
                onClick={toggleOpen}
                className={`w-14 h-14 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 z-50 relative opacity-90 hover:opacity-100 pointer-events-auto ${isOpen ? 'bg-gray-800 rotate-45' : 'bg-green-600'}`}
                style={{
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3), 0 0 0 4px rgba(255,255,255,0.1)'
                }}
            >
                {isOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                ) : (
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.44-5.15-3.75-6.59-6.59l1.97-1.57c.26-.27.35-.66.24-1.01-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3.3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .72-.63.72-1.19v-3.44c0-.54-.45-.99-.99-.99z" />
                    </svg>
                )}
            </button>

            {/* Backdrop to close when clicking outside */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-[1px] -z-10 pointer-events-auto"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default FloatingActionButton;
