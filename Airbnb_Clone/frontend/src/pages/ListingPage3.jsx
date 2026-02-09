import React, { useContext } from 'react';
import { FaLongArrowAltLeft, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { listingDataContext } from '../Context/ListingContext';

function ListingPage3() {
    let navigate = useNavigate();
    let {
        title,
        description,
        frontEndImage1,
        frontEndImage2,
        frontEndImage3,
        rent,
        city,
        landmark,
        category,
        handleAddListing,
        adding,
        // New values for review
        guestCount,
        bedroomCount,
        bathroomCount
    } = useContext(listingDataContext);

    return (
        <div className='w-full min-h-screen bg-white flex flex-col items-center py-10 px-4 relative pb-24'>
            
            {/* Header */}
            <div className="w-full max-w-[1000px] flex items-center justify-between mb-8">
                <div 
                    className='w-12 h-12 bg-red-600 cursor-pointer rounded-full flex items-center justify-center hover:bg-red-700 transition-all shadow-md' 
                    onClick={() => navigate("/listingpage2")}
                >
                    <FaLongArrowAltLeft className='w-6 h-6 text-white' />
                </div>
                <div className='bg-black text-white px-6 py-2 rounded-full text-sm font-semibold shadow-sm'>
                    Final Step: Review Your Listing
                </div>
            </div>

            <div className='max-w-[1000px] w-full flex flex-col gap-8'>
                
                {/* 1. Image Gallery Section */}
                <div className='flex flex-col gap-4'>
                    <div className='w-full h-[300px] md:h-[450px] rounded-3xl overflow-hidden shadow-md border-2 border-gray-100'>
                        <img src={frontEndImage1} alt="Main" className='w-full h-full object-cover' />
                    </div>
                    <div className='grid grid-cols-2 gap-4 h-[150px] md:h-[250px]'>
                        <div className='rounded-3xl overflow-hidden shadow-sm border-2 border-gray-100'>
                            <img src={frontEndImage2} alt="Detail 1" className='w-full h-full object-cover' />
                        </div>
                        <div className='rounded-3xl overflow-hidden shadow-sm border-2 border-gray-100'>
                            <img src={frontEndImage3} alt="Detail 2" className='w-full h-full object-cover' />
                        </div>
                    </div>
                </div>

                {/* 2. Review Details Section */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-10 mt-4'>
                    <div className='md:col-span-2 flex flex-col gap-6'>
                        <div>
                            <h1 className='text-4xl font-extrabold text-gray-900 capitalize'>{title}</h1>
                            {/* UPDATED SUBTITLE */}
                            <p className='text-xl text-gray-500 font-medium mt-1'>
                                {landmark}, {city} 
                            </p>
                            <p className='text-gray-600 mt-2 flex items-center gap-2'>
                                <span className='font-bold text-black'>{category}</span> • 
                                {guestCount} guests • {bedroomCount} bedrooms • {bathroomCount} bathrooms
                            </p>
                        </div>

                        <div className='p-6 bg-gray-50 rounded-3xl border border-gray-100'>
                            <h3 className='text-xl font-bold text-gray-800 mb-3'>Description</h3>
                            <p className='text-gray-600 leading-relaxed whitespace-pre-line'>
                                {description}
                            </p>
                        </div>

                        {/* Submission Summary List */}
                        <div className='flex flex-col gap-3'>
                            <h3 className='text-lg font-bold text-gray-800'>Listing Summary</h3>
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='flex items-center gap-2 text-gray-600'><FaCheckCircle className='text-green-500'/> Location Verified</div>
                                <div className='flex items-center gap-2 text-gray-600'><FaCheckCircle className='text-green-500'/> {category} Category</div>
                                <div className='flex items-center gap-2 text-gray-600'><FaCheckCircle className='text-green-500'/> 3 Images Uploaded</div>
                                <div className='flex items-center gap-2 text-gray-600'><FaCheckCircle className='text-green-500'/> Price Set</div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Action Card */}
                    <div className='md:col-span-1'>
                        <div className='border rounded-[2rem] p-8 shadow-2xl sticky top-24 bg-white'>
                            <div className='flex flex-col gap-1 mb-6'>
                                <span className='text-gray-500 text-sm font-bold uppercase tracking-wider'>Total Rent</span>
                                <div className='flex items-baseline gap-1'>
                                    <span className='text-4xl font-black text-gray-900'>₹{rent}</span>
                                    <span className='text-gray-500 font-medium'>/ night</span>
                                </div>
                            </div>
                            
                            <div className='w-full h-[1px] bg-gray-100 mb-6'></div>
                            
                            <button 
                                className='w-full bg-red-600 text-white py-5 rounded-2xl text-xl font-black hover:bg-red-700 active:scale-95 transition-all shadow-xl shadow-red-100 disabled:bg-gray-300 disabled:shadow-none'
                                onClick={handleAddListing}
                                disabled={adding}
                            >
                                {adding ? "Publishing..." : "Confirm & Publish"}
                            </button>
                            <p className='text-center text-xs text-gray-400 mt-4 px-4'>
                                By publishing, you agree to show this listing to all guests in {city}.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ListingPage3;