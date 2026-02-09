import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaTrash } from "react-icons/fa"; // Install: npm install react-icons
import { userDataContext } from '../Context/UserContext';
import { listingDataContext } from '../Context/ListingContext';
import Card from '../Component/Card';
import Nav from '../Component/Nav';

function MyListing() {
    let navigate = useNavigate();
    // We need userData to know WHO we are
    let { userData } = useContext(userDataContext);
    // We need listing data and the delete function from Context
    let { listingData = [], handleDeleteListing } = useContext(listingDataContext);

    // Filter: Show only listings where the 'host' matches the logged-in user's ID
    const myListings = listingData.filter((list) => {
        // Handle cases where host is populated (object) or just an ID (string)
        const hostId = list.host?._id || list.host;
        return hostId === userData?._id;
    });

    return (
        <div className='w-full min-h-screen bg-gray-50'>
            {/* 1. Reuse your Navbar for consistency */}
            <Nav />

            <div className='w-full max-w-[1400px] mx-auto pt-[200px] px-6 pb-20'>
                
                {/* 2. Header Section */}
                <div className='flex items-center justify-between mb-8'>
                    <h1 className='text-3xl font-bold text-gray-800'>My Hosted Listings</h1>
                    <button 
                        onClick={() => navigate("/listingpage1")}
                        className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all'
                    >
                        + Add New
                    </button>
                </div>

                {/* 3. Listings Grid */}
                <div className='flex items-start justify-center gap-6 flex-wrap'>
                    {myListings.length > 0 ? (
                        myListings.map((list) => (
                            <div key={list._id} className='relative group'>
                                {/* The Card Component */}
                                <Card 
                                    title={list.title} 
                                    landMark={list.landmark} // Note: check if your DB uses 'landmark' or 'landMark'
                                    city={list.city} 
                                    image1={list.image1} 
                                    rent={list.rent} 
                                    id={list._id} 
                                    ratings={list.averageRating || 0}
                                />

                                {/* DELETE BUTTON (Overlay) */}
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation(); // Stop click from opening the card details
                                        if(window.confirm("Delete this listing permanently?")) {
                                            handleDeleteListing(list._id);
                                        }
                                    }}
                                    className='absolute top-3 right-3 bg-white text-red-500 p-2 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-10'
                                    title="Delete Listing"
                                >
                                    <FaTrash size={14} />
                                </button>
                            </div>
                        ))
                    ) : (
                        // Empty State
                        <div className="flex flex-col items-center justify-center mt-20 text-center space-y-4 opacity-60">
                            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-3xl">📂</div>
                            <h2 className="text-xl font-bold text-gray-700">No Listings Yet</h2>
                            <p className="text-gray-500">You haven't posted any flats yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MyListing;