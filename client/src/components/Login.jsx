
import React from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {


    const { setShowUserLogin, setUser, axios, navigate } = useAppContext();

    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [mobile, setMobile] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [otpSent, setOtpSent] = React.useState(false);
    const [otp, setOtp] = React.useState("");
    const [isVerifyingOtp, setIsVerifyingOtp] = React.useState(false);


  // Registration flow: Step 1 - Send OTP
  const onNextHandler = async (event) => {
    event.preventDefault();
    try {
      if (!name || !email || !mobile) {
        toast.error("Please fill all fields");
        return;
      }
      // Call backend to send OTP
      const { data } = await axios.post("/api/user/send-otp", { name, email, mobile });
      if (data.success) {
        setOtpSent(true);
        toast.success("OTP sent to your mobile number");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Registration flow: Step 2 - Verify OTP and set password
  const onOtpSubmitHandler = async (event) => {
    event.preventDefault();
    setIsVerifyingOtp(true);
    try {
      if (!otp || !password) {
        toast.error("Enter OTP and password");
        setIsVerifyingOtp(false);
        return;
      }
      const { data } = await axios.post("/api/user/register", { name, email, mobile, otp, password });
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
    setIsVerifyingOtp(false);
  };

  // Login flow (unchanged)
  const onLoginHandler = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(`/api/user/login`, { email, password }, { withCredentials: true });
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
    <div onClick={() => setShowUserLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50'>
      <form
        onSubmit={state === "login" ? onLoginHandler : (otpSent ? onOtpSubmitHandler : onNextHandler)}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
        </p>

        {state === "register" && !otpSent && (
          <>
            <div className="w-full">
              <p>Name</p>
              <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
            </div>
            <div className="w-full">
              <p>Mobile No</p>
              <input onChange={(e) => setMobile(e.target.value)} value={mobile} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="tel" pattern="[0-9]{10}" maxLength={10} required />
            </div>
            <div className="w-full">
              <p>Email</p>
              <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
            </div>
          </>
        )}

        {state === "register" && otpSent && (
          <>
            <div className="w-full">
              <p>OTP</p>
              <input onChange={(e) => setOtp(e.target.value)} value={otp} placeholder="Enter OTP" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" maxLength={6} required />
            </div>
            <div className="w-full">
              <p>Set Password</p>
              <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
            </div>
          </>
        )}

        {state === "login" && (
          <>
            <div className="w-full">
              <p>Email</p>
              <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
            </div>
            <div className="w-full">
              <p>Password</p>
              <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
            </div>
          </>
        )}

        {state === "register" ? (
          <p>
            Already have account? <span onClick={() => { setState("login"); setOtpSent(false); }} className="text-primary cursor-pointer">click here</span>
          </p>
        ) : (
          <p>
            Create an account? <span onClick={() => { setState("register"); setOtpSent(false); }} className="text-primary cursor-pointer">click here</span>
          </p>
        )}

        <button
          className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer"
          type="submit"
          disabled={isVerifyingOtp}
        >
          {state === "register"
            ? otpSent
              ? isVerifyingOtp ? "Verifying..." : "Set Password"
              : "Next"
            : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login
