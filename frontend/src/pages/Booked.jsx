import React, { useContext, useState } from 'react'
import { GiConfirmed } from "react-icons/gi";
import { bookingDataContext } from '../Context/BookingContext';
import { useNavigate } from 'react-router-dom';
import Star from '../Component/Star';
import { userDataContext } from '../Context/UserContext';
import { authDataContext } from '../Context/AuthContext';
import { listingDataContext } from '../Context/ListingContext';
import axios from 'axios';

function Booked() {
    let { bookingData } = useContext(bookingDataContext)
    let [star, setStar] = useState(0)
    let { serverUrl } = useContext(authDataContext) 
    let { getCurrentUser } = useContext(userDataContext)
    let { getListing, cardDetails } = useContext(listingDataContext)
    let navigate = useNavigate()

    // Safety: If no booking data, redirect home
    if (!bookingData) {
        return (
            <div className='w-full h-screen flex items-center justify-center'>
                <button onClick={() => navigate("/")} className='bg-red-500 text-white px-6 py-2 rounded'>Go Home</button>
            </div>
        )
    }

    const handleRating = async (id) => {
        try {
            await axios.post(`${serverUrl}/api/listing/ratings/${id}`, {
                ratings: star
            }, { withCredentials: true })
            await getListing()
            await getCurrentUser()
            navigate("/")
        } catch (error) {
            console.error(error)
            navigate("/") // Go home even if rating fails
        }
    }

    return (
        <div className='w-[100vw] min-h-[100vh] flex items-center justify-center gap-[10px] bg-slate-200 flex-col py-10'>
            <div className='w-[95%] max-w-[500px] h-auto bg-[white] flex items-center justify-center border-[1px] border-[#b5b5b5] flex-col gap-[20px] p-[20px] rounded-lg shadow-sm'>
                <div className='text-[20px] flex items-center justify-center flex-col gap-[10px] font-semibold'>
                    <GiConfirmed className='w-[80px] h-[80px] text-[green]' />
                    Booking Confirmed
                </div>
                <div className='w-[100%] flex flex-col gap-2 border-t pt-4'>
                    <div className='flex justify-between'><span>Booking Id:</span> <span className='font-mono text-sm'>{bookingData._id}</span></div>
                    <div className='flex justify-between'><span>Host Email:</span> <span>{bookingData.host?.email}</span></div>
                    <div className='flex justify-between font-bold'><span>Total Paid:</span> <span>₹{bookingData.totalRent}</span></div>
                </div>
            </div>

            <div className='w-[95%] max-w-[500px] bg-[white] flex items-center justify-center border-[1px] border-[#b5b5b5] flex-col gap-[20px] p-[20px] rounded-lg shadow-sm'>
                <h1 className='text-[18px] font-medium'>How was your stay?</h1>
                <Star onRate={(val) => setStar(val)} />
                <button 
                    className='w-full py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all' 
                    onClick={() => handleRating(bookingData.listing)}
                >
                    Submit Rating & Finish
                </button>
            </div>
        </div>
    )
}

export default Booked