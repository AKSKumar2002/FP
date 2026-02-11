import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import toast from 'react-hot-toast';
import LocationPickerModal from '../components/LocationPickerModal';
import {
    MapPin, User, Mail, Phone, Home, Building,
    Flag, Globe, Save, ArrowLeft, CheckCircle2
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

// Ultra-Clean Input Component
const ModernInput = ({ icon: Icon, label, ...props }) => (
    <div className="relative group w-full">
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">{label}</label>
        <div className="relative flex items-center">
            <div className="absolute left-4 text-gray-300 group-focus-within:text-emerald-600 transition-colors pointer-events-none">
                <Icon size={18} strokeWidth={2} />
            </div>
            <input
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all font-semibold text-gray-800 placeholder:text-gray-300 text-sm"
                {...props}
            />
            {props.value && (
                <div className="absolute right-4 text-emerald-500 animate-in fade-in zoom-in duration-300">
                    <CheckCircle2 size={16} />
                </div>
            )}
        </div>
    </div>
);

const AddAddress = () => {
    const { axios, user, setPreferredAddress } = useAppContext();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMapOpen, setIsMapOpen] = useState(false);

    const [address, setAddress] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value,
        }));
    };

    const handleLocationSelect = (data) => {
        const addr = data.address;
        const newAddress = {
            ...address,
            street: data.display_name.split(',')[0] + (addr.suburb ? `, ${addr.suburb}` : ''),
            city: addr.city || addr.town || addr.village || '',
            state: addr.state || '',
            zipcode: addr.postcode || '',
            country: addr.country || '',
        };
        setAddress(newAddress);

        setPreferredAddress(newAddress);
        localStorage.setItem('preferredAddress', JSON.stringify(newAddress));

        if (user) {
            axios.post('/api/address/add', { address: newAddress, userId: user._id })
                .then(res => {
                    if (res.data.success) {
                        setPreferredAddress(res.data.address);
                        localStorage.setItem('preferredAddress', JSON.stringify(res.data.address));
                    }
                })
                .catch(err => console.error("Auto-save address failed", err));
        }

        toast.success("Location auto-filled from map!");
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error("Please login first");
            navigate('/login');
            return;
        }

        try {
            const { data } = await axios.post('/api/address/add', { address });

            if (data.success) {
                toast.success("Address saved securely");
                setPreferredAddress(address);
                localStorage.setItem('preferredAddress', JSON.stringify(address));
                navigate('/cart');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (location.state?.openMap) {
            setIsMapOpen(true);
        }
    }, [location.state]);

    return (
        <div className="min-h-screen bg-[#F8F9FA] pt-24 pb-20 px-4 md:px-0 flex justify-center">

            <div className="w-full max-w-2xl">
                {/* Minimal Header */}
                <div className="flex items-center justify-between mb-8 px-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <h1 className="text-xl font-black tracking-tight text-gray-900">NEW ADDRESS</h1>
                    <div className="w-10"></div> {/* Spacer for alignment */}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100"
                >
                    {/* Map Action Banner */}
                    <div
                        onClick={() => setIsMapOpen(true)}
                        className="relative overflow-hidden bg-gray-900 rounded-3xl p-6 mb-10 cursor-pointer group"
                    >
                        <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/5 group-hover:bg-emerald-500 transition-colors duration-500">
                                    <MapPin size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">Use Current Location</h3>
                                    <p className="text-gray-400 text-xs font-medium mt-0.5">Tap to pinpoint on map</p>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                <ArrowLeft className="rotate-180 text-white" size={14} />
                            </div>
                        </div>

                        {/* Subtle patterns */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl translate-x-10 -translate-y-10"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-x-10 translate-y-10"></div>
                    </div>

                    <form onSubmit={onSubmitHandler} className="space-y-10">
                        {/* Section 1 */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-gray-300 uppercase tracking-[0.2em]">Contact Details</h3>
                            <div className="grid grid-cols-2 gap-5">
                                <ModernInput icon={User} label="First Name" name="firstName" value={address.firstName} onChange={handleChange} placeholder="John" required />
                                <ModernInput icon={User} label="Last Name" name="lastName" value={address.lastName} onChange={handleChange} placeholder="Doe" required />
                            </div>
                            <ModernInput icon={Phone} label="Mobile Number" name="phone" type="tel" value={address.phone} onChange={handleChange} placeholder="+91 00000 00000" required />
                            <ModernInput icon={Mail} label="Email Address" name="email" type="email" value={address.email} onChange={handleChange} placeholder="john@example.com" required />
                        </div>

                        {/* Section 2 */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-gray-300 uppercase tracking-[0.2em]">Delivery Address</h3>
                            <ModernInput icon={Home} label="Flat, House, Building" name="street" value={address.street} onChange={handleChange} placeholder="Format: No./Street Name" required />

                            <div className="grid grid-cols-2 gap-5">
                                <ModernInput icon={Building} label="City / Town" name="city" value={address.city} onChange={handleChange} placeholder="City" required />
                                <ModernInput icon={MapPin} label="Pincode" name="zipcode" value={address.zipcode} onChange={handleChange} placeholder="000000" required />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <ModernInput icon={Globe} label="State" name="state" value={address.state} onChange={handleChange} placeholder="State" required />
                                <ModernInput icon={Flag} label="Country" name="country" value={address.country} onChange={handleChange} placeholder="Country" required />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-emerald-600 text-white h-14 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3"
                        >
                            <Save size={18} strokeWidth={2.5} />
                            Save & Continue
                        </button>
                    </form>
                </motion.div>

                <p className="text-center text-gray-300 text-[10px] font-bold uppercase tracking-widest mt-8">
                    Secure & Encrypted Information
                </p>
            </div>

            <LocationPickerModal
                isOpen={isMapOpen}
                onClose={() => setIsMapOpen(false)}
                onLocationSelect={handleLocationSelect}
            />
        </div>
    );
};

export default AddAddress;
