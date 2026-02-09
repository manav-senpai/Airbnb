import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { userDataContext } from '../Context/UserContext';
import Card from '../Component/Card';
import Nav from '../Component/Nav';
import Footer from '../Component/Footer';

function MyBooking() {
    let navigate = useNavigate()
    let { userData } = useContext(userDataContext)

    return (
        <div className='w-full min-h-screen bg-gray-50 flex flex-col'>
            <Nav />
            
            <div className='flex-grow w-full max-w-[1400px] mx-auto pt-[180px] px-6 pb-20'>
                {/* Header */}
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold text-gray-800'>My Trips</h1>
                    <p className='text-gray-500 mt-2'>Manage your upcoming stays and cancellations.</p>
                </div>

                <div className='flex items-start justify-start gap-6 flex-wrap'>
                    {userData?.booking && userData.booking.length > 0 ? (
                        userData.booking.map((bookingItem) => {
                            // Safety check: sometimes listing might be null if it was deleted
                            if (!bookingItem.listing) return null; 

                            return (
                                <Card 
                                    // FIX: Use the unique BOOKING ID for the key
                                    key={bookingItem._id} 
                                    
                                    // Pass Listing Details
                                    id={bookingItem.listing._id} 
                                    title={bookingItem.listing.title} 
                                    landMark={bookingItem.listing.landmark} 
                                    city={bookingItem.listing.city} 
                                    image1={bookingItem.listing.image1} 
                                    image2={bookingItem.listing.image2} 
                                    image3={bookingItem.listing.image3} 
                                    rent={bookingItem.listing.rent} 
                                    ratings={bookingItem.listing.averageRating || 0} 
                                    
                                    // Pass Booking Info
                                    isBooked={true}
                                    host={bookingItem.listing.host}
                                    guest={userData._id} // We are the guest
                                />
                            )
                        })
                    ) : (
                        // Empty State Design
                        <div className="w-full flex flex-col items-center justify-center mt-20 text-center space-y-6 opacity-80">
                            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-4xl">✈️</div>
                            <div className='space-y-2'>
                                <h2 className="text-2xl font-bold text-gray-800">No trips booked... yet!</h2>
                                <p className="text-gray-500 max-w-md">Time to dust off your bags and start planning your next adventure.</p>
                            </div>
                            <button 
                                onClick={() => navigate("/")}
                                className='bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-transform hover:scale-105 shadow-lg'
                            >
                                Start Searching
                            </button>
                        </div>
                    )}
                </div>
            </div>

            
        </div>
    )
}

export default MyBooking