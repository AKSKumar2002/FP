import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast';

const SellerLogin = () => {
    const {isSeller, setIsSeller, navigate, axios} = useAppContext()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await axios.post('/api/seller/login', {
                email,
                password
            });
            
            console.log('Login response:', response.data);
            
            if (response.data.success) {
                // Save token to localStorage
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('isSeller', 'true');
                
                // Verify token was saved
                const savedToken = localStorage.getItem('token');
                console.log('Token saved:', savedToken ? 'Yes' : 'No');
                console.log('Token value:', savedToken);
                
                toast.success('Login successful!');
                
                // Update context
                setIsSeller(true);
                
                // Redirect to product list
                setTimeout(() => {
                    navigate('/seller/product-list');
                }, 100);
            } else {
                toast.error(response.data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(()=>{
        if(isSeller){
            navigate("/seller/product-list")
        }
    },[isSeller])

  return !isSeller && (
    <form onSubmit={handleSubmit} className='min-h-screen flex items-center text-sm text-gray-600'>

        <div className='flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200'>
            <p className='text-2xl font-medium m-auto'><span className="text-primary">Seller</span> Login</p>
            
            {/* Debug Info */}
            <div className="w-full bg-blue-50 p-2 rounded text-xs">
                <p>📍 Current URL: {window.location.href}</p>
                <p>🔑 Token: {localStorage.getItem('token') ? 'Present' : 'Missing'}</p>
            </div>

            <div className="w-full ">
                <p>Email</p>
                <input 
                    onChange={(e)=>setEmail(e.target.value)} 
                    value={email}
                    type="email" 
                    placeholder="enter you email" 
                    className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" 
                    required
                    disabled={loading}
                />
            </div>
            <div className="w-full ">
                <p>Password</p>
                <input 
                    onChange={(e)=>setPassword(e.target.value)} 
                    value={password}
                    type="password" 
                    placeholder="enter your password"
                    className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" 
                    required
                    disabled={loading}
                />
            </div>
            <button 
                type="submit"
                disabled={loading}
                className="bg-primary text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Logging in...' : 'Login'}
            </button>
        </div>

    </form>
  )
}

export default SellerLogin
