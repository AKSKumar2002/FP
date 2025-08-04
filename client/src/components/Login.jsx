import React from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import emailjs from 'emailjs-com'; // Import EmailJS

const Login = () => {
    const { setShowUserLogin, setUser, axios, navigate } = useAppContext();

    const [state, setState] = React.useState("register"); // "register" for Sign Up, "login" for Login
    const [step, setStep] = React.useState(1); // Step state for Sign Up transitions
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState(""); // Updated for login
    const [mobile, setMobile] = React.useState("");
    const [otp, setOtp] = React.useState(""); // State for OTP
    const [generatedOtp, setGeneratedOtp] = React.useState(""); // Store generated OTP
    const [otpVerified, setOtpVerified] = React.useState(false); // State for OTP verification
    const [password, setPassword] = React.useState("");

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

    const onSignUpSubmitHandler = async (event) => {
        event.preventDefault();

        if (!mobile || mobile.trim() === "") {
            toast.error('Mobile number is required.');
            return;
        }

        try {
            const { data } = await axios.post(
                '/api/user/register',
                { name, email, password, mobile }, // Ensure mobile is included
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

    const onLoginSubmitHandler = async (event) => {
        event.preventDefault();

        if (!email || !password) {
            toast.error('Email and password are required.');
            return;
        }

        try {
            const { data } = await axios.post(
                '/api/user/login',
                { email, password }, // Use only email and password
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
            <form
                onSubmit={state === "register" ? onSignUpSubmitHandler : onLoginSubmitHandler}
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
            >
                <p className="text-2xl font-medium m-auto">
                    <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
                </p>
                {state === "register" && step === 1 && (
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
                            <p>Mobile Number</p>
                            <input onChange={(e) => setMobile(e.target.value)} value={mobile} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="tel" pattern="[0-9]{10}" required />
                        </div>
                        <button type="button" onClick={sendOtpHandler} className="mt-2 bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                            Send OTP
                        </button>
                    </>
                )}
                {state === "register" && step === 2 && (
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
                {state === "register" && step === 3 && (
                    <>
                        <div className="w-full">
                            <p>Password</p>
                            <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
                        </div>
                        <button type="submit" className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                            Submit
                        </button>
                    </>
                )}
                {state === "login" && (
                    <>
                        <div className="w-full">
                            <p>Email</p>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                placeholder="Enter email"
                                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                                type="email"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <p>Password</p>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                placeholder="Enter password"
                                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                                type="password"
                                required
                            />
                        </div>
                        <button type="submit" className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                            Login
                        </button>
                    </>
                )}
                <p className="text-center w-full">
                    {state === "register" ? (
                        <>
                            Already have an account?{" "}
                            <span onClick={() => { setState("login"); setStep(1); }} className="text-primary cursor-pointer">
                                Login here
                            </span>
                        </>
                    ) : (
                        <>
                            Don't have an account?{" "}
                            <span onClick={() => setState("register")} className="text-primary cursor-pointer">
                                Sign Up here
                            </span>
                        </>
                    )}
                </p>
            </form>
        </div>
    );
};

export default Login;
