import React, { useContext } from 'react';
import { FaLongArrowAltLeft, FaMinus, FaPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { MdWhatshot, MdBedroomParent, MdOutlinePool } from "react-icons/md";
import { GiFamilyHouse, GiWoodCabin } from "react-icons/gi";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { IoBedOutline } from "react-icons/io5";
import { FaTreeCity } from "react-icons/fa6";
import { BiBuildingHouse } from "react-icons/bi";
import { listingDataContext } from '../Context/ListingContext';

function ListingPage2() {
    const navigate = useNavigate();
    const { 
        category, setCategory,
        guestCount, setGuestCount,
        bedroomCount, setBedroomCount,
        bathroomCount, setBathroomCount
    } = useContext(listingDataContext);

    const categories = [
        { id: "trending", label: "Trending", icon: <MdWhatshot size={28} /> },
        { id: "villa", label: "Villa", icon: <GiFamilyHouse size={28} /> },
        { id: "farmHouse", label: "Farm House", icon: <FaTreeCity size={28} /> },
        { id: "poolHouse", label: "Pool House", icon: <MdOutlinePool size={28} /> },
        { id: "rooms", label: "Rooms", icon: <MdBedroomParent size={28} /> },
        { id: "flat", label: "Flat", icon: <BiBuildingHouse size={28} /> },
        { id: "pg", label: "PG", icon: <IoBedOutline size={28} /> },
        { id: "cabin", label: "Cabin", icon: <GiWoodCabin size={28} /> },
        { id: "shops", label: "Shops", icon: <SiHomeassistantcommunitystore size={28} /> },
    ];

    // Helper for counters
    const Counter = ({ label, value, setValue }) => (
        <div className='flex items-center justify-between w-full border-b py-4 last:border-b-0'>
            <span className='text-lg font-medium text-gray-700'>{label}</span>
            <div className='flex items-center gap-4'>
                <button 
                    onClick={() => setValue(value > 1 ? value - 1 : 1)}
                    className='w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black transition-colors'
                >
                    <FaMinus size={10} />
                </button>
                <span className='text-lg font-semibold w-4 text-center'>{value}</span>
                <button 
                    onClick={() => setValue(value + 1)}
                    className='w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black transition-colors'
                >
                    <FaPlus size={10} />
                </button>
            </div>
        </div>
    );

    return (
        <div className='w-full min-h-screen bg-white flex flex-col items-center py-10 px-4 relative pb-28'>
            
            {/* Header Section */}
            <div className="w-full max-w-[900px] flex items-center justify-between mb-8">
                <div 
                    className='w-12 h-12 bg-red-600 cursor-pointer rounded-full flex items-center justify-center hover:bg-red-700 transition-all shadow-md' 
                    onClick={() => navigate("/listingpage1")}
                >
                    <FaLongArrowAltLeft className='w-6 h-6 text-white' />
                </div>
                <div className='bg-black text-white px-6 py-2 rounded-full text-sm font-semibold shadow-sm'>
                    Step 2 of 2: Details
                </div>
            </div>

            <div className='max-w-[800px] w-full flex flex-col items-center md:items-start'>
                
                {/* 1. Category Section */}
                <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-2'>Which best describes your place?</h1>
                <p className='text-gray-500 mb-6'>Pick a category so guests know what to expect.</p>

                <div className='grid grid-cols-2 md:grid-cols-3 gap-4 w-full mb-12'>
                    {categories.map((item) => (
                        <div 
                            key={item.id}
                            onClick={() => setCategory(item.id)}
                            className={`flex flex-col items-center justify-center p-6 border-2 rounded-2xl cursor-pointer transition-all hover:border-black active:scale-95 ${
                                category === item.id 
                                ? 'border-black bg-gray-50 shadow-inner' 
                                : 'border-gray-100'
                            }`}
                        >
                            <div className={`mb-2 ${category === item.id ? 'text-red-600' : 'text-gray-700'}`}>
                                {item.icon}
                            </div>
                            <span className={`font-semibold text-sm ${category === item.id ? 'text-black' : 'text-gray-600'}`}>
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* 2. Basics Section (Guests, Rooms, etc) */}
                <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-2'>Share some basics</h1>
                <p className='text-gray-500 mb-6'>You'll add more details later, like bed types.</p>
                
                <div className='w-full max-w-lg mb-12'>
                    <Counter label="Guests" value={guestCount} setValue={setGuestCount} />
                    <Counter label="Bedrooms" value={bedroomCount} setValue={setBedroomCount} />
                    <Counter label="Bathrooms" value={bathroomCount} setValue={setBathroomCount} />
                </div>

                {/* Navigation Button */}
                <div className='fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 flex justify-center z-50'>
                    <button 
                        className='max-w-[800px] w-full bg-red-600 text-white py-4 rounded-xl text-xl font-bold hover:bg-red-700 transition-all shadow-lg disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed'
                        onClick={() => navigate("/listingpage3")}
                        disabled={!category}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ListingPage2;