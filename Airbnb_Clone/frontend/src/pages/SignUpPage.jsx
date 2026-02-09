import React, { useState, useContext } from 'react'; // <--- FIXED: Added useContext
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { FaLongArrowAltLeft } from "react-icons/fa";
import axios from 'axios';
import { authDataContext } from '../Context/AuthContext';
import { userDataContext } from '../Context/UserContext';
import { toast } from 'react-toastify';
import { FaHatWizard } from 'react-icons/fa6';

function SignUp() {
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const navigate = useNavigate();
    
    // Using the context that was causing the crash
    const { serverUrl, loading, setLoading } = useContext(authDataContext);
    const { setUserData } = useContext(userDataContext);

    const handleSignUP = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const result = await axios.post(`${serverUrl}/api/auth/signup`, {
                name,
                email,
                password
            }, { withCredentials: true });
            
            setLoading(false);
            setUserData(result.data);
            toast.success("Signup Successfully");
            navigate("/");
        } catch (error) {
            setLoading(false);
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className='w-screen h-screen flex items-center justify-center bg-white relative'>
            <div 
                className='w-[50px] h-[50px] bg-red-600 cursor-pointer absolute top-[10%] left-[20px] rounded-full flex items-center justify-center hover:bg-red-700 transition-all shadow-md' 
                onClick={() => navigate("/")}
            >
                <FaLongArrowAltLeft className='w-[25px] h-[25px] text-white' />
            </div>

            <form className='max-w-[900px] w-[90%] flex flex-col items-center md:items-start gap-4' onSubmit={handleSignUP}>
                <h1 className='text-[35px] font-bold text-black'>Welcome to Airbnb</h1>
                
                <div className='w-full flex flex-col gap-1 mt-4'>
                    <label className='text-lg font-medium'>UserName</label>
                    <input 
                        type="text" 
                        className='w-full h-[45px] border-2 border-gray-400 rounded-lg px-4 focus:border-red-500 outline-none' 
                        required 
                        onChange={(e) => setName(e.target.value)} 
                        value={name}
                    />
                </div> 

                <div className='w-full flex flex-col gap-1'>
                    <label className='text-lg font-medium'>Email</label>
                    <input 
                        type="email" 
                        className='w-full h-[45px] border-2 border-gray-400 rounded-lg px-4 focus:border-red-500 outline-none' 
                        required 
                        onChange={(e) => setEmail(e.target.value)} 
                        value={email}
                    />
                </div> 

                <div className='w-full flex flex-col gap-1 relative'>
                    <label className='text-lg font-medium'>Password</label>
                    <input 
                        type={show ? "text" : "password"} 
                        className='w-full h-[45px] border-2 border-gray-400 rounded-lg px-4 focus:border-red-500 outline-none' 
                        required 
                        onChange={(e) => setPassword(e.target.value)} 
                        value={password} 
                    />
                    <div className='absolute right-4 bottom-3 cursor-pointer text-gray-600' onClick={() => setShow(!show)}>
                        {show ? <IoMdEyeOff size={22} /> : <IoMdEye size={22} />}
                    </div>
                </div>

                <button 
                    className='w-full md:w-auto px-12 py-3 bg-red-600 text-white text-lg font-semibold rounded-lg mt-4 disabled:bg-gray-400 shadow-sm' 
                    disabled={loading}
                >
                    {loading ? "Creating Account..." : "Sign Up"}
                </button>

                <p className='text-gray-600 mt-2'>
                    Already have an account? <span className='text-red-600 font-bold cursor-pointer hover:underline' onClick={() => navigate("/login")}>Login</span>
                </p>
            </form>
        </div>
    );
}

export default SignUp;