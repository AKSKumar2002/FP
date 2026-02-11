import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import LocationPickerModal from '../components/LocationPickerModal'
import { MapPin } from 'lucide-react'
import { useLocation } from 'react-router-dom'

// Input Field Component
const InputField = ({ type, placeholder, name, handleChange, address }) => (
    <input className='w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition'
        type={type}
        placeholder={placeholder}
        onChange={handleChange}
        name={name}
        value={address[name]}
        required
    />
)

const AddAddress = () => {

    const { axios, user, navigate, setPreferredAddress } = useAppContext();
    const location = useLocation();
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
    })

    const handleChange = (e) => {
        const { name, value } = e.target;

        setAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value,
        }))
    }

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

        // Also update the global preferred address for immediate UI feedback
        setPreferredAddress(newAddress);
        localStorage.setItem('preferredAddress', JSON.stringify(newAddress));

        // If user is already logged in, save to backend immediately so we get an _id
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

        toast.success("Location updated from map!");
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error("Please login to save address to your account");
            navigate('/login');
            return;
        }

        try {
            const { data } = await axios.post('/api/address/add', { address });

            if (data.success) {
                toast.success(data.message)
                setPreferredAddress(address);
                localStorage.setItem('preferredAddress', JSON.stringify(address));
                navigate('/cart')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        // Auto-open map if coming from header trigger
        if (location.state?.openMap) {
            setIsMapOpen(true);
        }
    }, [location.state])

    return (
        <div className='mt-16 pb-16 px-4 md:px-0'>
            <div className="flex items-center justify-between mb-2">
                <p className='text-2xl md:text-3xl text-gray-500 tracking-tight'>Add Shipping <span className='font-semibold text-primary'>Address</span></p>
                <button
                    onClick={() => setIsMapOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-50 text-primary border border-primary/20 rounded-xl font-bold text-sm active:scale-95 transition-all shadow-sm"
                >
                    <MapPin size={16} />
                    Select on Map
                </button>
            </div>

            <div className='flex flex-col-reverse md:flex-row justify-between mt-10'>
                <div className='flex-1 max-w-md'>
                    <form onSubmit={onSubmitHandler} className='space-y-3 mt-6 text-sm'>

                        <div className='grid grid-cols-2 gap-4'>
                            <InputField handleChange={handleChange} address={address} name='firstName' type="text" placeholder="First Name" />
                            <InputField handleChange={handleChange} address={address} name='lastName' type="text" placeholder="Last Name" />
                        </div>

                        <InputField handleChange={handleChange} address={address} name='email' type="email" placeholder="Email address" />
                        <InputField handleChange={handleChange} address={address} name='street' type="text" placeholder="Street / Area / Landmark" />

                        <div className='grid grid-cols-2 gap-4'>
                            <InputField handleChange={handleChange} address={address} name='city' type="text" placeholder="City" />
                            <InputField handleChange={handleChange} address={address} name='state' type="text" placeholder="State" />
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <InputField handleChange={handleChange} address={address} name='zipcode' type="text" placeholder="Zip code" />
                            <InputField handleChange={handleChange} address={address} name='country' type="text" placeholder="Country" />
                        </div>

                        <InputField handleChange={handleChange} address={address} name='phone' type="text" placeholder="Phone Number" />

                        <button className='w-full mt-6 bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-dull transition-all cursor-pointer uppercase shadow-lg'>
                            Save delivery address
                        </button>
                    </form>
                </div>
                <img className='md:mr-16 mb-16 md:mt-0 opacity-80' src={assets.add_address_iamge} alt="Add Address" />
            </div>

            <LocationPickerModal
                isOpen={isMapOpen}
                onClose={() => setIsMapOpen(false)}
                onLocationSelect={handleLocationSelect}
            />
        </div>
    )
}

export default AddAddress
