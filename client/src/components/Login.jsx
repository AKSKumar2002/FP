import React from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import emailjs from 'emailjs-com'; // Import EmailJS
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

const Login = () => {
    const { setShowUserLogin, setUser, axios, navigate } = useAppContext();

    const [isSignUp, setIsSignUp] = React.useState(true); // Toggle between Sign Up and Login
    const [step, setStep] = React.useState(1); // Step state to control transitions
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [mobile, setMobile] = React.useState("");
    const [otp, setOtp] = React.useState(""); // State for OTP
    const [generatedOtp, setGeneratedOtp] = React.useState(""); // Store generated OTP
    const [otpVerified, setOtpVerified] = React.useState(false); // State for OTP verification
    const [password, setPassword] = React.useState("");
    const [passwordVisible, setPasswordVisible] = React.useState(false); // State for toggling password visibility

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const sendOtpHandler = async () => {
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
        setGeneratedOtp(generatedOtp);

        const templateParams = {
            to_name: name,
            to_email: email,
            otp: generatedOtp,
        };

        try {
            await emailjs.send(
                'service_qdgynna', // Replace with your EmailJS service ID
                'template_80gwir6', // Replace with your EmailJS template ID
                templateParams,
                'mTgVI_IpSn6ZFfCbC' // Replace with your EmailJS user ID
            );
            toast.success('OTP sent successfully to your email!');
            setStep(2); // Move to the next step
        } catch (error) {
            toast.error('Failed to send OTP. Please try again.');
        }
    };

    const verifyOtpHandler = () => {
        if (otp === generatedOtp) {
            toast.success('OTP verified successfully!');
            setOtpVerified(true);
            setStep(3); // Move to the next step
        } else {
            toast.error('Invalid OTP. Please try again.');
        }
    };

    const onSignUpHandler = async (event) => {
        event.preventDefault();

        try {
            const { data } = await axios.post(
                '/api/user/register',
                { name, email, password, mobile },
                { withCredentials: true }
            );

            if (data.success) {
                toast.success('Account created successfully!');
                navigate('/'); // Navigate to the main site
                setUser(data.user);
                setShowUserLogin(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const onLoginHandler = async (event) => {
        event.preventDefault();

        try {
            const { data } = await axios.post(
                '/api/user/login',
                { email, password },
                { withCredentials: true }
            );

            if (data.success) {
                toast.success('Logged in successfully!');
                navigate('/'); // Navigate to the main site
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
            <form onSubmit={isSignUp ? onSignUpHandler : onLoginHandler} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-6 py-8 w-72 sm:w-[320px] rounded-lg shadow-xl border border-gray-200 bg-white">
                <p className="text-2xl font-medium m-auto">
                    <span className="text-primary">{isSignUp ? 'User Sign Up' : 'User Login'}</span>
                </p>
                {isSignUp ? (
                    <>
                        {step === 1 && (
                            <>
                                <div className="w-full">
                                    <p>Name</p>
                                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                                </div>
                                <div className="w-full">
                                    <p>Email</p>
                                    <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
                                </div>
                                <div className="w-full">
                                    <p>Mobile No</p>
                                    <input onChange={(e) => setMobile(e.target.value)} value={mobile} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="tel" pattern="[0-9]{10}" required />
                                </div>
                                <button type="button" onClick={sendOtpHandler} className="mt-2 bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                                    Send OTP
                                </button>
                                <div className="w-full text-center mt-2">
                                    <button type="button" onClick={() => setIsSignUp(false)} className="text-gray-600">
                                        Already have an account? <span className="text-green-500">Login</span>
                                    </button>
                                </div>
                            </>
                        )}
                        {step === 2 && (
                            <>
                                <div className="w-full">
                                    <p>OTP</p>
                                    <input onChange={(e) => setOtp(e.target.value)} value={otp} placeholder="Enter OTP" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                                </div>
                                <button type="button" onClick={verifyOtpHandler} className="mt-2 bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                                    Verify OTP
                                </button>
                            </>
                        )}
                        {step === 3 && (
                            <>
                                <div className="w-full relative">
                                    <p>Password</p>
                                    <input 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        value={password} 
                                        placeholder="type here" 
                                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" 
                                        type={passwordVisible ? "text" : "password"} 
                                        required 
                                    />
                                    <span 
                                        onClick={togglePasswordVisibility} 
                                        className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                                    >
                                        {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                                <button type="submit" className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                                    Submit
                                </button>
                            </>
                        )}
                    </>
                ) : (
                    <>
                        <div className="w-full">
                            <p>Email</p>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
                        </div>
                        <div className="w-full relative">
                            <p>Password</p>
                            <input 
                                onChange={(e) => setPassword(e.target.value)} 
                                value={password} 
                                placeholder="type here" 
                                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" 
                                type={passwordVisible ? "text" : "password"} 
                                required 
                            />
                            <span 
                                onClick={togglePasswordVisibility} 
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                            >
                                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        <button type="submit" className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                            Login
                        </button>
                        <div className="w-full text-center mt-2">
                            <button type="button" onClick={() => setIsSignUp(true)} className="text-gray-600">
                                Don't have an account? <span className="text-green-500">Sign Up</span>
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

export default Login;
