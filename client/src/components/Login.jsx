import React from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {
    const { setShowUserLogin, setUser, axios, navigate } = useAppContext();

    const [state, setState] = React.useState("register"); // Default to "register"
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [mobile, setMobile] = React.useState("");
    const [otp, setOtp] = React.useState(""); // State for OTP
    const [otpSent, setOtpSent] = React.useState(false);
    const [otpVerified, setOtpVerified] = React.useState(false); // State for OTP verification

    const sendOtpHandler = async () => {
        try {
            const { data } = await axios.post(
                'https://fp-mocha.vercel.app/api/user/send-otp',
                { email, mobile },
                { withCredentials: true }
            );

            if (data.success) {
                toast.success('OTP sent successfully to your mobile number!');
                setOtpSent(true);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            if (error.response?.status === 404) {
                toast.error('The OTP service is currently unavailable. Please try again later.');
            } else {
                toast.error(error.response?.data?.message || error.message);
            }
        }
    };

    const verifyOtpHandler = async () => {
        try {
            const { data } = await axios.post(
                'https://fp-mocha.vercel.app/api/user/verify-otp',
                { email, otp },
                { withCredentials: true }
            );

            if (data.success) {
                toast.success('OTP verified successfully!');
                setOtpVerified(true);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!otpSent) {
            sendOtpHandler(); // Trigger OTP if not sent
            return;
        }

        if (!otpVerified) {
            toast.error('Please verify the OTP before proceeding.');
            return;
        }

        try {
            const { data } = await axios.post(
                '/api/user/register',
                { name, email, password, mobile },
                { withCredentials: true }
            );

            if (data.success) {
                navigate('/');
                setUser(data.user);
                setShowUserLogin(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <div onClick={() => setShowUserLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50'>
            <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
                <p className="text-2xl font-medium m-auto">
                    <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
                </p>
                <div className="w-full">
                    <p>Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                </div>
                <div className="w-full">
                    <p>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
                </div>
                <div className="w-full">
                    <p>Mobile Number</p>
                    <input onChange={(e) => setMobile(e.target.value)} value={mobile} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="tel" pattern="[0-9]{10}" required />
                </div>
                {otpSent && (
                    <div className="w-full">
                        <p>OTP</p>
                        <input onChange={(e) => setOtp(e.target.value)} value={otp} placeholder="Enter OTP" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                        <button type="button" onClick={verifyOtpHandler} className="mt-2 bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                            Verify OTP
                        </button>
                    </div>
                )}
                {otpVerified && (
                    <div className="w-full">
                        <p>Password</p>
                        <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
                    </div>
                )}
                <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                    {otpSent ? "Submit" : "Send OTP"}
                </button>
            </form>
        </div>
    );
};

export default Login;
