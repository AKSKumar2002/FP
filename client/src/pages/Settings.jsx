import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Settings = () => {
    const navigate = useNavigate();
    const { user, setShowUserLogin, setUser } = useAppContext();

    // Independent states for "working" options
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [dataSaver, setDataSaver] = useState(false);

    const handleLogout = () => {
        // Simple logout logic
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
    };

    const ToggleSwitch = ({ checked, onChange }) => (
        <button
            onClick={() => onChange(!checked)}
            className={`w-12 h-6 rounded-full transition-colors duration-200 ease-in-out relative ${checked ? 'bg-primary' : 'bg-gray-300'}`}
        >
            <div className={`w-4 h-4 rounded-full bg-white shadow-sm absolute top-1 transition-transform duration-200 ${checked ? 'left-7' : 'left-1'}`}></div>
        </button>
    );

    const SettingItem = ({ icon, label, subLabel, type = 'arrow', checked, onChange, onClick, danger, showBorder = true }) => (
        <div
            onClick={type === 'arrow' || type === 'button' ? onClick : undefined}
            className={`flex items-center justify-between p-4 bg-white active:bg-gray-50 transition-colors ${showBorder ? 'border-b border-gray-100' : ''} cursor-pointer`}
        >
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${danger ? 'bg-red-50 text-red-500' : 'bg-green-50 text-primary'}`}>
                    {icon}
                </div>
                <div>
                    <p className={`font-medium ${danger ? 'text-red-500' : 'text-gray-800'}`}>{label}</p>
                    {subLabel && <p className="text-xs text-gray-500 mt-0.5">{subLabel}</p>}
                </div>
            </div>

            {type === 'toggle' && <ToggleSwitch checked={checked} onChange={onChange} />}
            {type === 'arrow' && <span className="text-gray-400 text-lg">›</span>}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white sticky top-0 z-10 shadow-sm px-4 py-4 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold text-gray-800">Settings</h1>
            </div>

            <div className="p-4 space-y-6">

                {/* Section: Account */}
                <div>
                    <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2 px-2">Account</h2>
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden text-sm md:text-base">
                        {user ? (
                            <>
                                <SettingItem
                                    icon="👤"
                                    label="Edit Profile"
                                    subLabel={user.name}
                                    onClick={() => { }}
                                />
                                <SettingItem
                                    icon="📦"
                                    label="My Orders"
                                    onClick={() => navigate('/my-orders')}
                                    showBorder={false}
                                />
                            </>
                        ) : (
                            <SettingItem
                                icon="🔐"
                                label="Login / Sign Up"
                                subLabel="Access your account"
                                onClick={() => setShowUserLogin(true)}
                                showBorder={false}
                            />
                        )}
                    </div>
                </div>

                {/* Section: App Preferences */}
                <div>
                    <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2 px-2">App Settings</h2>
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden text-sm md:text-base">
                        <SettingItem
                            icon="🔔"
                            label="Push Notifications"
                            type="toggle"
                            checked={notifications}
                            onChange={setNotifications}
                        />
                        <SettingItem
                            icon="🌙"
                            label="Dark Mode"
                            type="toggle"
                            checked={darkMode}
                            onChange={setDarkMode}
                        />
                        <SettingItem
                            icon="📉"
                            label="Data Saver"
                            subLabel="Reduce image quality"
                            type="toggle"
                            checked={dataSaver}
                            onChange={setDataSaver}
                            showBorder={false}
                        />
                    </div>
                </div>

                {/* Section: More */}
                <div>
                    <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2 px-2">Support & Info</h2>
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden text-sm md:text-base">
                        <SettingItem
                            icon="🌍"
                            label="Language"
                            subLabel="English (US)"
                            onClick={() => { }}
                        />
                        <SettingItem
                            icon="❓"
                            label="Help & Support"
                            onClick={() => navigate('/contact')}
                        />
                        <SettingItem
                            icon="🛡️"
                            label="Privacy Policy"
                            onClick={() => { }}
                            showBorder={false}
                        />
                    </div>
                </div>

                {/* Logout */}
                {user && (
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden mt-4">
                        <SettingItem
                            icon="🚪"
                            label="Log Out"
                            danger
                            onClick={handleLogout}
                            showBorder={false}
                        />
                    </div>
                )}

                <p className="text-center text-xs text-gray-400 mt-8">Farm Pick v1.0.0 (Build 2025)</p>
            </div>
        </div>
    );
};

export default Settings;
