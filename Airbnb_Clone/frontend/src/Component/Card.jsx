import React, { useContext, useState } from 'react';
import { FaStar, FaRegStar, FaRegCheckCircle } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import { useNavigate } from 'react-router-dom'; // FIXED: Added missing import
import { listingDataContext } from '../Context/ListingContext';
import { userDataContext } from '../Context/UserContext';
import { bookingDataContext } from '../Context/BookingContext';

function Card({ title, landMark, city, image1, rent, id, ratings, isBooked, host }) {
    const { handleViewCard } = useContext(listingDataContext);
    const { userData } = useContext(userDataContext);
    const { cancelBooking } = useContext(bookingDataContext);
    const [popUp, setPopUp] = useState(false); // FIXED: Combined broken multi-line useState
    
    const navigate = useNavigate();

    const handleClick = () => {
        if (userData) {
            handleViewCard(id);
        } else {
            navigate("/login");
        }
    };

    return (
        <div 
            className='w-[300px] md:w-[320px] h-[400px] flex flex-col rounded-2xl cursor-pointer hover:shadow-2xl transition-all duration-300 bg-white border border-gray-200 overflow-hidden group p-3 gap-3 relative' 
            onClick={() => !isBooked ? handleClick() : null}
        >
            {/* Booking Status Overlays */}
            {isBooked && (
                <div className='text-[green] bg-white/90 rounded-lg absolute flex items-center justify-center right-2 top-2 gap-1 p-1 z-10 shadow-sm border border-green-100'>
                    <FaRegCheckCircle className='w-4 h-4' />
                    <span className='text-xs font-bold'>Booked</span>
                </div>
            )}

            {isBooked && host === userData?._id && (
                <div 
                    className='text-red-600 bg-white rounded-lg absolute flex items-center justify-center right-2 top-12 gap-1 p-2 z-10 shadow-md border border-red-100 hover:bg-red-50' 
                    onClick={(e) => {
                        e.stopPropagation(); // Prevents card click
                        setPopUp(true);
                    }}
                >
                    <FcCancel className='w-4 h-4' /> 
                    <span className='text-xs font-bold'>Cancel Booking</span>
                </div>
            )}

            {/* Cancellation Modal */}
            {popUp && (
                <div className='absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center p-4 rounded-2xl text-center'>
                    <p className='text-gray-800 font-bold mb-4'>Cancel this booking?</p>
                    <div className='flex gap-4'>
                        <button 
                            className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700" 
                            onClick={(e) => {
                                e.stopPropagation();
                                cancelBooking(id); 
                                setPopUp(false);
                            }}
                        >
                            Yes
                        </button>
                        <button 
                            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300" 
                            onClick={(e) => {
                                e.stopPropagation();
                                setPopUp(false);
                            }}
                        >
                            No
                        </button>
                    </div>
                </div>
            )}

            {/* Image Section */}
            <div className='w-full h-[60%] overflow-hidden relative rounded-xl'>
                <img 
                    src={image1} 
                    alt={title} 
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                    onError={(e) => { 
                        e.target.src = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80";
                    }} 
                />
            </div>

            {/* Content Section */}
            <div className='w-full h-[40%] flex flex-col gap-1 px-1'>
                <div className='flex items-center justify-between'>
                    <h3 className='font-bold text-gray-800 text-lg truncate w-[70%] capitalize'>
                        {city}, {landMark}
                    </h3>
                    <div className='flex items-center gap-1 text-sm'>
                        {ratings > 0 ? (
                            <>
                                <FaStar className='text-yellow-500' /> 
                                <span>{ratings}</span>
                            </>
                        ) : (
                            <>
                                <FaRegStar className='text-gray-400' />
                                <span className='text-gray-400 text-xs'>New</span>
                            </>
                        )}
                    </div>
                </div>
                
                <p className='text-gray-500 text-sm truncate capitalize'>{title}</p>
                
                <div className='mt-auto flex items-baseline gap-1'>
                    <span className='text-lg font-bold text-gray-900'>
                        ₹{rent ? Number(rent).toLocaleString() : 0}
                    </span>
                    <span className='text-gray-500 text-sm'>/ night</span>
                </div>
            </div>
        </div>
    );
}

export default Card;