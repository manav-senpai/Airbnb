import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { FaStar, FaMapMarkerAlt, FaRegHeart, FaShare } from "react-icons/fa";
import { toast } from 'react-toastify';
import axios from 'axios';

import { listingDataContext } from '../Context/ListingContext';
import { userDataContext } from '../Context/UserContext';
import { authDataContext } from '../Context/AuthContext';
import { bookingDataContext } from '../Context/BookingContext';
import Nav from '../Component/Nav'; 

function ViewCard() {
    const navigate = useNavigate();
    const { cardDetails, setUpdating, updating, setDeleting, deleting } = useContext(listingDataContext);
    const { userData } = useContext(userDataContext);
    const { serverUrl } = useContext(authDataContext);
    
    // Booking Context
    const { 
        checkIn, setCheckIn, 
        checkOut, setCheckOut, 
        total, setTotal, 
        night, setNight, 
        handleBooking, booking 
    } = useContext(bookingDataContext);

    // Local State
    const [updatePopUp, setUpdatePopUp] = useState(false);
    const [bookingPopUp, setBookingPopUp] = useState(false);
    const [minDate, setMinDate] = useState("");
    
    // Form States (for Update Modal)
    const [title, setTitle] = useState(cardDetails?.title || "");
    const [description, setDescription] = useState(cardDetails?.description || "");
    const [rent, setRent] = useState(cardDetails?.rent || "");
    const [city, setCity] = useState(cardDetails?.city || "");
    const [landmark, setLandmark] = useState(cardDetails?.landMark || ""); 
    const [backEndImage1, setBackEndImage1] = useState(null);
    const [backEndImage2, setBackEndImage2] = useState(null);
    const [backEndImage3, setBackEndImage3] = useState(null);

    // CRITICAL: Prevent crash if page is refreshed
    useEffect(() => {
        if (!cardDetails) {
            navigate("/"); 
        }
        const today = new Date().toISOString().split('T')[0];
        setMinDate(today);
    }, [cardDetails, navigate]);

    // Booking Calculation Logic
    useEffect(() => {
        if (checkIn && checkOut && cardDetails) {
            const inDate = new Date(checkIn);
            const outDate = new Date(checkOut);
            const timeDiff = outDate - inDate;
            const days = timeDiff / (1000 * 3600 * 24);

            setNight(days);

            if (days > 0) {
                const basePrice = cardDetails.rent * days;
                const taxes = basePrice * 0.14; 
                setTotal(Math.round(basePrice + taxes));
            } else {
                setTotal(0);
            }
        }
    }, [checkIn, checkOut, cardDetails, setNight, setTotal]);

    // Update Handler
    const handleUpdateListing = async () => {
        setUpdating(true);
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("rent", rent);
            formData.append("city", city);
            formData.append("landmark", landmark); 
            if (backEndImage1) formData.append("image1", backEndImage1);
            if (backEndImage2) formData.append("image2", backEndImage2);
            if (backEndImage3) formData.append("image3", backEndImage3);

            // Using the /update/:id route from your backend
            await axios.put(`${serverUrl}/api/listing/update/${cardDetails._id}`, formData, { withCredentials: true });
            
            toast.success("Listing Updated Successfully");
            setUpdatePopUp(false);
            navigate("/"); 
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Update Failed");
        } finally {
            setUpdating(false);
        }
    };

    // Delete Handler
    const handleDeleteListing = async () => {
        if(!window.confirm("Are you sure you want to delete this listing?")) return;
        
        setDeleting(true);
        try {
            await axios.delete(`${serverUrl}/api/listing/delete/${cardDetails._id}`, { withCredentials: true });
            toast.success("Listing Deleted");
            navigate("/");
        } catch (error) {
            console.error(error);
            toast.error("Delete Failed");
        } finally {
            setDeleting(false);
        }
    };

    if (!cardDetails) return null; 

    // Syncing with your new Backend's camelCase 'isBooked' or populated host object
    const isHost = cardDetails.host === userData?._id || cardDetails.host?._id === userData?._id;

    return (
        <div className='w-full min-h-screen bg-white'>
            <Nav />
            
            <div className='max-w-[1200px] mx-auto px-4 pt-[170px] pb-20'>
                
                {/* Back Button */}
                <div className='mb-4'>
                    <button 
                        onClick={() => navigate(-1)} 
                        className='flex items-center gap-2 text-gray-600 hover:text-black hover:bg-gray-100 px-3 py-2 rounded-lg transition-all'
                    >
                        <FaArrowLeftLong size={20} />
                        <span className='font-medium'>Back</span>
                    </button>
                </div>

                {/* Header Section */}
                <div className='mb-6'>
                    <h1 className='text-2xl md:text-3xl font-bold text-gray-900 mb-2 capitalize'>{cardDetails.title}</h1>
                    <div className='flex items-center justify-between text-sm text-gray-600 underline'>
                        <div className='flex items-center gap-2'>
                            <FaStar className='text-rose-500' />
                            <span className='font-semibold'>{cardDetails.averageRating || "4.8"}</span>
                            <span>•</span>
                            <span className='font-semibold capitalize'>{cardDetails.city}, {cardDetails.landmark || cardDetails.landMark}</span>
                        </div>
                        <div className='flex gap-4'>
                            <button className='flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded'><FaShare /> Share</button>
                            <button className='flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded'><FaRegHeart /> Save</button>
                        </div>
                    </div>
                </div>

                {/* IMAGE GRID: Fixed Gap logic */}
                <div className='grid grid-cols-1 md:grid-cols-4 grid-rows-none md:grid-rows-2 gap-2 h-auto md:h-[400px] rounded-2xl overflow-hidden mb-8'>
                    {/* Main Image */}
                    <div className='md:col-span-2 md:row-span-2 relative group cursor-pointer h-[250px] md:h-full'>
                        <img src={cardDetails.image1} alt="Main" className='w-full h-full object-cover hover:opacity-95 transition' />
                    </div>
                    {/* Secondary Images: Visible on all screens now but resized */}
                    <div className='md:col-span-2 md:row-span-1 relative group cursor-pointer h-[150px] md:h-full'>
                        <img src={cardDetails.image2 || cardDetails.image1} alt="Second" className='w-full h-full object-cover hover:opacity-95 transition' />
                    </div>
                    <div className='md:col-span-2 md:row-span-1 relative group cursor-pointer h-[150px] md:h-full'>
                        <img src={cardDetails.image3 || cardDetails.image1} alt="Third" className='w-full h-full object-cover hover:opacity-95 transition' />
                    </div>
                </div>

                {/* Main Content Split */}
                <div className='flex flex-col md:flex-row gap-12'>
                    
                    {/* LEFT COLUMN: Details */}
                    <div className='w-full md:w-[65%]'>
                        <div className='border-b pb-6 mb-6'>
                            <h2 className='text-xl font-semibold mb-1'>Entire home hosted by {cardDetails.host?.name || "Host"}</h2>
                            <p className='text-gray-500'>
                                {cardDetails.guestCapacity || 6} guests • {cardDetails.bedroomCount || 3} bedrooms • {cardDetails.bathroomCount || 2} bathrooms
                            </p>
                        </div>
                        <div className='mb-6'>
                            <h3 className='text-xl font-semibold mb-4'>About this place</h3>
                            <p className='text-gray-700 leading-relaxed whitespace-pre-wrap'>{cardDetails.description}</p>
                        </div>
                        
                        {/* Host Controls */}
                        {isHost && (
                            <div className='p-4 bg-gray-50 rounded-xl border border-gray-200 mt-8'>
                                <h3 className='font-bold mb-3 text-black'>Host Controls</h3>
                                <div className='flex gap-4'>
                                    <button onClick={() => setUpdatePopUp(true)} className='bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-80'>
                                        Edit Listing
                                    </button>
                                    <button onClick={handleDeleteListing} disabled={deleting} className='text-red-600 underline text-sm font-semibold'>
                                        {deleting ? "Deleting..." : "Delete Listing"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Sticky Booking Card */}
                    <div className='w-full md:w-[35%]'>
                        <div className='sticky top-28 border border-gray-200 shadow-xl rounded-2xl p-6'>
                            <div className='flex justify-between items-baseline mb-6'>
                                <div className='flex items-baseline gap-1'>
                                    <span className='text-2xl font-bold'>₹{cardDetails.rent.toLocaleString()}</span>
                                    <span className='text-gray-500'>/ night</span>
                                </div>
                                <div className='flex items-center gap-1 text-sm font-semibold'>
                                    <FaStar className='text-rose-500' /> {cardDetails.averageRating || "New"}
                                </div>
                            </div>

                            {!isHost ? (
                                <button 
                                    onClick={() => setBookingPopUp(true)}
                                    className='w-full bg-rose-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-rose-700 transition active:scale-95 shadow-md'
                                >
                                    Reserve
                                </button>
                            ) : (
                                <div className='text-center p-4 bg-green-50 text-green-700 rounded-lg font-medium border border-green-200'>
                                    You are the host of this property
                                </div>
                            )}

                            <div className='mt-4 text-center text-gray-400 text-sm'>
                                You won't be charged yet
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODALS --- */}

            {/* UPDATE POPUP */}
            {updatePopUp && (
                <div className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm'>
                    <div className='bg-white w-full max-w-lg rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl'>
                        <button onClick={() => setUpdatePopUp(false)} className='absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full'><RxCross2 size={20}/></button>
                        <h2 className='text-2xl font-bold mb-6'>Edit Listing</h2>
                        
                        <div className='space-y-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Title</label>
                                <input value={title} onChange={e => setTitle(e.target.value)} className='w-full p-3 border rounded-lg focus:border-black outline-none' />
                            </div>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Price</label>
                                    <input type="number" value={rent} onChange={e => setRent(e.target.value)} className='w-full p-3 border rounded-lg focus:border-black outline-none' />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>City</label>
                                    <input value={city} onChange={e => setCity(e.target.value)} className='w-full p-3 border rounded-lg focus:border-black outline-none' />
                                </div>
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className='w-full p-3 border rounded-lg focus:border-black outline-none' />
                            </div>
                            <button onClick={handleUpdateListing} disabled={updating} className='w-full bg-black text-white py-3 rounded-lg font-bold mt-4 hover:bg-gray-800 transition'>
                                {updating ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* BOOKING POPUP */}
            {bookingPopUp && (
                <div className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm'>
                    <div className='bg-white w-full max-w-md rounded-2xl p-6 relative shadow-2xl'>
                        <button onClick={() => setBookingPopUp(false)} className='absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full'><RxCross2 size={20}/></button>
                        <h2 className='text-2xl font-bold mb-6 border-b pb-4'>{booking ? "Booking..." : "Confirm Booking" }</h2>
                        
                        <div className='space-y-4 mb-6'>
                            <div className='grid grid-cols-2 gap-2'>
                                <div className='border rounded-lg p-3 focus-within:border-black transition-all'>
                                    <div className='text-xs font-bold uppercase text-gray-500'>Check-In</div>
                                    <input type="date" min={minDate} value={checkIn} onChange={e => setCheckIn(e.target.value)} className='w-full outline-none text-sm cursor-pointer' />
                                </div>
                                <div className='border rounded-lg p-3 focus-within:border-black transition-all'>
                                    <div className='text-xs font-bold uppercase text-gray-500'>Check-Out</div>
                                    <input type="date" min={checkIn || minDate} value={checkOut} onChange={e => setCheckOut(e.target.value)} className='w-full outline-none text-sm cursor-pointer' />
                                </div>
                            </div>
                        </div>

                        {night > 0 && (
                            <div className='bg-gray-50 p-4 rounded-lg space-y-2 mb-6 border border-gray-100'>
                                <div className='flex justify-between text-gray-600'>
                                    <span className='underline font-medium'>₹{cardDetails.rent} x {night} nights</span>
                                    <span>₹{cardDetails.rent * night}</span>
                                </div>
                                <div className='flex justify-between text-gray-600'>
                                    <span className='underline font-medium'>Service Fee (14%)</span>
                                    <span>₹{Math.round((cardDetails.rent * night) * 0.14)}</span>
                                </div>
                                <div className='flex justify-between font-bold pt-2 border-t border-gray-200 mt-2 text-black'>
                                    <span>Total</span>
                                    <span>₹{total.toLocaleString()}</span>
                                </div>
                            </div>
                        )}

                      

<button 
    onClick={() => handleBooking(cardDetails._id)} 
    disabled={booking || night <= 0}
    className={`w-full py-3 rounded-lg font-bold text-white transition-all shadow-md ${
        booking || night <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700 active:scale-95'
    }`}
>
    {booking ? "Processing..." : "Confirm Booking"} 
</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewCard;