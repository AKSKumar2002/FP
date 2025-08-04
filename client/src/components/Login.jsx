import React from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {

    const {setShowUserLogin, setUser, axios, navigate} = useAppContext()

    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [mobile, setMobile] = React.useState(""); // Added state for mobile number
    const [otpSent, setOtpSent] = React.useState(false);

    const sendOtpHandler = async () => {
      try {
        const { data } = await axios.post(
          'https://fp-mocha.vercel.app/api/user/send-otp',
          { email, mobile }, // Include mobile number in the request
          { withCredentials: true }
        );

        if (data.success) {
          toast.success('OTP sent successfully to your mobile number!');
          setOtpSent(true);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          toast.error('The OTP service is currently unavailable. Please try again later.');
        } else {
          toast.error(error.message);
        }
      }
    };

    const onSubmitHandler = async (event) => {
      try {
        event.preventDefault();

        const { data } = await axios.post(`/api/user/${state}`, {
          name, email, password
        }, {
          withCredentials: true
        });

        if (data.success) {
          navigate('/');
          setUser(data.user);
          setShowUserLogin(false);
        } else {
          toast.error(data.message);
        }

      } catch (error) {
        toast.error(error.message);
      }
    };

  return (
    <div onClick={()=> setShowUserLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50'>

      <form onSubmit={onSubmitHandler} onClick={(e)=>e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
            <p className="text-2xl font-medium m-auto">
                <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
            </p>
            {state === "register" && (
                <div className="w-full">
                    <p>Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                </div>
            )}
            <div className="w-full">
                <p>Email</p>
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    placeholder="type here"
                    className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                    type="email"
                    required
                />
                {state === "register" && (
                    <button
                        type="button"
                        onClick={sendOtpHandler}
                        className="mt-2 bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer"
                    >
                        {otpSent ? "Resend OTP" : "Send OTP"}
                    </button>
                )}
            </div>
            {state === "register" && (
                <div className="w-full">
                    <p>Mobile Number</p>
                    <input
                        onChange={(e) => setMobile(e.target.value)}
                        value={mobile}
                        placeholder="type here"
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                        type="tel"
                        pattern="[0-9]{10}" // Ensure only valid 10-digit numbers
                        required
                    />
                </div>
            )}
            <div className="w-full ">
                <p>Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
            </div>
            {state === "register" ? (
                <p>
                    Already have account? <span onClick={() => setState("login")} className="text-primary cursor-pointer">click here</span>
                </p>
            ) : (
                <p>
                    Create an account? <span onClick={() => setState("register")} className="text-primary cursor-pointer">click here</span>
                </p>
            )}
            <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                {state === "register" ? "Create Account" : "Login"}
            </button>
        </form>
    </div>
  )
}

export default Login
