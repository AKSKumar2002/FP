import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

/**
 * FLOW STEPS:
 * 1. INPUT_MOBILE: User inputs mobile number.
 * 2. VERIFY_OTP: User verifies OTP sent to mobile.
 * 3. CHECK_USER_EXISTENCE (Internal): After OTP, check if user exists.
 *    - If EXISTS: Show LOGIN_OPTIONS (Password or Auto-Login).
 *    - If NEW: Go to SIGNUP_FORM.
 * 4. SIGNUP_FORM: Fill Name, Email, DOB, New Password.
 * 5. SUCCESS: Logged in.
 */

const Login = () => {
    const { setShowUserLogin, setUser, axios, navigate } = useAppContext();

    // Flow State
    const [step, setStep] = React.useState('INPUT_MOBILE'); // INPUT_MOBILE, VERIFY_OTP, SIGNUP_FORM, LOGIN_PASSWORD
    const [isLoading, setIsLoading] = React.useState(false);

    // Data State
    const [mobile, setMobile] = React.useState("");
    const [otp, setOtp] = React.useState("");
    const [generatedOtp, setGeneratedOtp] = React.useState("");

    // Cleanup Form Data
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [dob, setDob] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [passwordVisible, setPasswordVisible] = React.useState(false);

    // Reset everything when opening
    useEffect(() => {
        setStep('INPUT_MOBILE');
        setMobile('');
        setOtp('');
        setName('');
        setEmail('');
        setDob('');
        setPassword('');
    }, []);

    // 1. Send OTP Handler
    const handleSendOtp = async (e) => {
        if (e) e.preventDefault();

        if (!mobile || mobile.length < 10) {
            toast.error("Please enter a valid mobile number");
            return;
        }

        setIsLoading(true);
        try {
            // Initialize Recaptcha (only once)
            if (!window.recaptchaVerifier) {
                window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                    'size': 'invisible',
                    'callback': (response) => {
                        // reCAPTCHA solved, allow signInWithPhoneNumber.
                    }
                });
            }

            const appVerifier = window.recaptchaVerifier;
            const formatMobile = "+91" + mobile; // Ensure country code

            const confirmationResult = await signInWithPhoneNumber(auth, formatMobile, appVerifier);

            // Save confirmationResult to window or state to verify later
            window.confirmationResult = confirmationResult;

            toast.success(`OTP Sent to ${formatMobile}`);
            setStep('VERIFY_OTP');

        } catch (error) {
            console.error(error);
            toast.error("Failed to send SMS: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // 2. Verify OTP Handler
    const handleVerifyOtp = async (e) => {
        if (e) e.preventDefault();

        if (otp.length !== 6) { // Firebase OTPs are usually 6 digits
            toast.error("Please enter 6-digit OTP");
            return;
        }

        setIsLoading(true);
        try {
            // Verify via Firebase
            const confirmationResult = window.confirmationResult;
            const result = await confirmationResult.confirm(otp);
            const user = result.user; // Firebase User

            console.log("Firebase Verified:", user);

            // Now check valid user in OUR backend using just the mobile number
            // In production, send user.accessToken to backend to verify identity.

            // Check if user exists in our DB
            const { data } = await axios.post('/api/user/check-mobile', { mobile });

            if (data.exists) {
                handleLoginWithOtp();
            } else {
                setStep('SIGNUP_FORM');
            }

        } catch (error) {
            console.error(error);
            toast.error("Invalid OTP or Verification Failed");
        } finally {
            setIsLoading(false);
        }
    };

    // 3. Login directly with OTP
    const handleLoginWithOtp = async () => {
        try {
            const { data } = await axios.post('/api/user/login-mobile', { mobile }, { withCredentials: true });
            if (data.success) {
                toast.success('Logged in successfully!');
                setUser(data.user);
                setShowUserLogin(false);
                navigate('/');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // 4. Final Signup Submission
    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data } = await axios.post('/api/user/register', {
                name, email, mobile, password, dob, otp // Send OTP again to verify ownership before creating
            }, { withCredentials: true });

            if (data.success) {
                toast.success('Account created & Logged in!');
                setUser(data.user);
                setShowUserLogin(false);
                navigate('/');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    // Alternate: Login with Password (from first screen link)
    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Note: Login API now supports mobile as 'email' field
            const { data } = await axios.post('/api/user/login', {
                email: mobile, // Sending mobile as identifier
                password
            }, { withCredentials: true });

            if (data.success) {
                toast.success('Logged in!');
                setUser(data.user);
                setShowUserLogin(false);
                navigate('/');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div
            onClick={() => setShowUserLogin(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center text-sm text-gray-600 bg-black/50 overflow-y-auto px-4"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]"
            >
                {/* Header Image / Branding */}
                <div className="bg-green-50 p-6 text-center border-b border-green-100">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {step === 'SIGNUP_FORM' ? 'Complete Profile' : 'Welcome to FarmPick'}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {step === 'INPUT_MOBILE' && 'Enter your mobile number to get started'}
                        {step === 'VERIFY_OTP' && `Enter OTP sent to +91 ${mobile}`}
                        {step === 'SIGNUP_FORM' && 'Just a few more details to set up your account'}
                        {step === 'LOGIN_PASSWORD' && 'Enter your password to login'}
                    </p>
                </div>

                {/* Close Button */}
                <button
                    onClick={() => setShowUserLogin(false)}
                    className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white rounded-full transition-colors z-10"
                >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>

                <div className="p-6 overflow-y-auto">

                    {/* STEP 1: INPUT MOBILE */}
                    {step === 'INPUT_MOBILE' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Mobile Number</label>
                                <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-500 transition-all">
                                    <span className="bg-gray-100 px-3 py-3 text-gray-500 font-medium flex items-center border-r">+91</span>
                                    <input
                                        type="tel"
                                        className="flex-1 px-4 py-3 outline-none text-gray-800 font-medium"
                                        placeholder="98765 43210"
                                        value={mobile}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            if (val.length <= 10) setMobile(val);
                                        }}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSendOtp}
                                disabled={mobile.length !== 10 || isLoading}
                                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:translate-y-0.5"
                            >
                                {isLoading ? 'Sending...' : 'Continue'}
                            </button>

                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">Or login with</span></div>
                            </div>

                            <button
                                onClick={() => mobile.length === 10 ? setStep('LOGIN_PASSWORD') : toast.error("Enter mobile number first")}
                                className="w-full border-2 border-gray-200 hover:border-green-500 hover:text-green-600 text-gray-600 font-semibold py-3 rounded-xl transition-all"
                            >
                                Password
                            </button>
                        </div>
                    )}

                    {/* STEP 2: VERIFY OTP */}
                    {step === 'VERIFY_OTP' && (
                        <div className="space-y-6">
                            <div className="flex justify-center gap-2 my-4">
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    className="w-40 text-center text-3xl font-bold tracking-[0.5em] py-2 border-b-2 border-green-500 outline-none focus:border-green-700 transition-colors bg-transparent"
                                    placeholder="••••••"
                                    autoFocus
                                />
                            </div>

                            <div id="recaptcha-container"></div>

                            <button
                                onClick={handleVerifyOtp}
                                disabled={otp.length !== 6 || isLoading}
                                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold py-3.5 rounded-xl transition-all shadow-md"
                            >
                                {isLoading ? 'Verifying...' : 'Verify & Continue'}
                            </button>

                            <div className="flex justify-between text-sm">
                                <button onClick={() => setStep('INPUT_MOBILE')} className="text-gray-500 hover:text-gray-700">Change Number</button>
                                <button onClick={handleSendOtp} className="text-green-600 font-semibold hover:underline">Resend OTP</button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: LOGIN WITH PASSWORD */}
                    {step === 'LOGIN_PASSWORD' && (
                        <form onSubmit={handlePasswordLogin} className="space-y-4">
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                                <span className="font-medium text-gray-700">+91 {mobile}</span>
                                <button type="button" onClick={() => setStep('INPUT_MOBILE')} className="text-xs text-primary font-semibold uppercase">Change</button>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={passwordVisible ? "text" : "password"}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                <div className="text-right mt-1">
                                    <button type="button" className="text-xs text-gray-500 hover:text-green-600 transition-colors">Forgot Password?</button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold py-3.5 rounded-xl transition-all shadow-md"
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>

                            <button
                                type="button"
                                onClick={() => handleSendOtp()}
                                className="w-full text-green-600 font-semibold py-2 hover:bg-green-50 rounded-lg transition-colors"
                            >
                                Login via OTP instead
                            </button>
                        </form>
                    )}

                    {/* STEP 4: SIGNUP FORM (Only for new users) */}
                    {step === 'SIGNUP_FORM' && (
                        <form onSubmit={handleSignupSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date of Birth</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-600"
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Set Password</label>
                                    <div className="relative">
                                        <input
                                            type={passwordVisible ? "text" : "password"}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setPasswordVisible(!passwordVisible)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        >
                                            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold py-3.5 rounded-xl transition-all shadow-md mt-2"
                            >
                                {isLoading ? 'Creating Account...' : 'Complete Sign Up'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
