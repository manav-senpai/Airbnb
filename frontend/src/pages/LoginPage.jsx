import React, { useContext, useState } from 'react';
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { FaLongArrowAltLeft } from "react-icons/fa";
import { authDataContext } from '../Context/AuthContext';
import { userDataContext } from '../Context/UserContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();

  // Pulling logic from Context
  const { serverUrl, loading, setLoading } = useContext(authDataContext);
  const { setUserData } = useContext(userDataContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await axios.post(`${serverUrl}/api/auth/login`, {
        email,
        password
      }, { withCredentials: true });
      
      setUserData(result.data);
      setLoading(false);
      
      // Trigger the toast and immediately move to Home
      toast.success("Login Successfully");
      navigate("/"); 

      console.log("Login Result:", result);
    } catch (error) {
      setLoading(false);
      console.error("Login Error:", error);
      // Use optional chaining to avoid crashing if error.response is undefined
      toast.error(error.response?.data?.message || "Invalid Credentials");
    }
  };

  return (
    <div className='w-screen h-screen flex items-center justify-center bg-white relative'>
      {/* Back Button to Home */}
      <div 
        className='w-[50px] h-[50px] bg-red-600 cursor-pointer absolute top-[10%] left-[20px] rounded-full flex items-center justify-center hover:bg-red-700 transition-all shadow-md' 
        onClick={() => navigate("/")}
      >
        <FaLongArrowAltLeft className='w-[25px] h-[25px] text-white' />
      </div>

      <form 
        className='max-w-[900px] w-[90%] flex items-center justify-center flex-col md:items-start gap-[15px]'
        onSubmit={handleLogin}
      >
        <h1 className='text-[35px] font-bold text-black mb-4'>Welcome to Airbnb</h1>
        
        {/* Email Input */}
        <div className='w-full flex flex-col gap-2'>
          <label htmlFor="email" className='text-lg font-medium'>Email</label>
          <input 
            type="email" 
            id='email' 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className='w-full h-[45px] border-2 border-gray-400 rounded-lg px-3 focus:border-red-500 outline-none transition-colors'
          />
        </div>

        {/* Password Input */}
        <div className='w-full flex flex-col gap-2 relative'>
          <label htmlFor="password" className='text-lg font-medium'>Password</label>
          <input 
            type={show ? "text" : "password"} 
            id='password' 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className='w-full h-[45px] border-2 border-gray-400 rounded-lg px-3 focus:border-red-500 outline-none transition-colors'
          />
          {/* Eye Toggler */}
          <div 
            className='absolute right-4 bottom-3 cursor-pointer text-gray-600 hover:text-black transition-colors' 
            onClick={() => setShow(!show)}
          >
            {show ? <FaEyeSlash size={22} /> : <IoEyeSharp size={22} />}
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className='w-full md:w-auto px-12 py-3 bg-red-600 text-white text-lg font-semibold rounded-lg mt-4 hover:bg-red-700 transition-colors shadow-sm disabled:bg-gray-400'
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className='text-gray-600 mt-2 cursor-pointer' onClick={() => navigate("/signup")}>
          New to Airbnb? <span className='text-red-600 font-bold hover:underline'>Create an account</span>
        </p>
      </form>
    </div>
  );
}

export default Login;