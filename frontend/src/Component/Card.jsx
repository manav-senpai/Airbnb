import React, { useContext, useState, useEffect, useRef } from 'react';
import { FaStar, FaRegStar, FaRegCheckCircle } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import { listingDataContext } from '../Context/ListingContext';
import { userDataContext } from '../Context/UserContext';
import { bookingDataContext } from '../Context/BookingContext';

function Card({ title, landMark, city, image1, image2, image3, rent, id, ratings, isBooked, host, guest }) {
    const { handleViewCard } = useContext(listingDataContext);
    const { userData } = useContext(userDataContext);
    const { cancelBooking } = useContext(bookingDataContext);
    const [popUp, setPopUp] = useState(false);
    
    // --- NEW: Image Slider State ---
    const [currentImgIndex, setCurrentImgIndex] = useState(0);
    const imageRef = useRef(null); // Ref to trap the scroll event
    
    // Filter out invalid or "pending" images to create a clean gallery array
    const images = [image1, image2, image3].filter(img => img && img !== "pending");

    const navigate = useNavigate();

    // --- NEW: Scroll Handler ---
    useEffect(() => {
        const element = imageRef.current;
        if (!element) return;

        const handleWheel = (e) => {
            // Only slide if we have multiple images
            if (images.length > 1) {
                e.preventDefault(); // STOP the page from scrolling
                e.stopPropagation();

                if (e.deltaY > 0) {
                    // Scroll Down -> Next Image
                    setCurrentImgIndex((prev) => (prev + 1) % images.length);
                } else {
                    // Scroll Up -> Previous Image
                    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
                }
            }
        };

        // { passive: false } is REQUIRED to allow e.preventDefault()
        element.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            element.removeEventListener('wheel', handleWheel);
        };
    }, [images.length]); // Re-run if image count changes

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

            {/* Cancel Button - Only shows if YOU are the guest */}
            {isBooked && userData && guest && String(userData._id) === String(guest) && (
                <div 
                    className='text-red-600 bg-white rounded-lg absolute flex items-center justify-center right-2 top-12 gap-1 p-2 z-10 shadow-md border border-red-100 hover:bg-red-50 transition-all hover:scale-105' 
                    onClick={(e) => {
                        e.stopPropagation();
                        setPopUp(true);
                    }}
                >
                    <FcCancel className='w-4 h-4' /> 
                    <span className='text-xs font-bold'>Cancel</span>
                </div>
            )}

            {/* Cancellation Modal */}
            {popUp && (
                <div className='absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center p-4 rounded-2xl text-center backdrop-blur-sm'>
                    <p className='text-gray-800 font-bold mb-4'>Cancel this booking?</p>
                    <div className='flex gap-4'>
                        <button 
                            className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 shadow-md transition-all active:scale-95" 
                            onClick={(e) => {
                                e.stopPropagation();
                                cancelBooking(id); 
                                setPopUp(false);
                            }}
                        >
                            Yes
                        </button>
                        <button 
                            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300 shadow-md transition-all active:scale-95" 
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

            {/* --- NEW: Image Slider Section --- */}
            <div 
                ref={imageRef} // Attach the Scroll Trap here
                className='w-full h-[60%] overflow-hidden relative rounded-xl bg-gray-200'
            >
                <img 
                    src={images[currentImgIndex]} 
                    alt={title} 
                    className='w-full h-full object-cover transition-transform duration-500' // Removed scale on hover to keep focus on sliding
                    onError={(e) => { 
                        e.target.src = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80";
                    }} 
                />
                
                {/* Image Dots Indicator (Only shows if > 1 image) */}
                {images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {images.map((_, idx) => (
                            <div 
                                key={idx} 
                                className={`w-1.5 h-1.5 rounded-full shadow-sm transition-all ${
                                    idx === currentImgIndex ? 'bg-white scale-125' : 'bg-white/60'
                                }`}
                            />
                        ))}
                    </div>
                )}
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