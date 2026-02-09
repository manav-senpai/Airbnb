import React, { useContext } from 'react';
import { FaLongArrowAltLeft, FaTimes } from "react-icons/fa"; 
import { useNavigate } from 'react-router-dom';
import { listingDataContext } from '../Context/ListingContext';

function ListingPage1() {
    let navigate = useNavigate();
    let {
        title, setTitle,
        description, setDescription,
        setFrontEndImage1, setFrontEndImage2, setFrontEndImage3,
        backEndImage1, setBackEndImage1, 
        backEndImage2, setBackEndImage2, 
        backEndImage3, setBackEndImage3,
        rent, setRent,
        city, setCity,
        landmark, setLandmark,
        frontEndImage1, frontEndImage2, frontEndImage3 // Needed to check for required files
    } = useContext(listingDataContext);

    const handleImageChange = (e, setBack, setFront) => {
        const file = e.target.files[0];
        if (file) {
            setBack(file);
            setFront(URL.createObjectURL(file));
        }
    };

    const removeImage = (e, setBack, setFront) => {
        e.stopPropagation();
        setBack(null);
        setFront(null);
    };

    const imageSlots = [
        { id: 1, back: backEndImage1, front: frontEndImage1, setBack: setBackEndImage1, setFront: setFrontEndImage1 },
        { id: 2, back: backEndImage2, front: frontEndImage2, setBack: setBackEndImage2, setFront: setFrontEndImage2 },
        { id: 3, back: backEndImage3, front: frontEndImage3, setBack: setBackEndImage3, setFront: setFrontEndImage3 },
    ];

    return (
        <div className='w-full min-h-screen bg-white flex flex-col items-center py-10 px-4 relative'>
            <div className="w-full max-w-[900px] flex items-center justify-between mb-8">
                <div 
                    className='w-12 h-12 bg-red-600 cursor-pointer rounded-full flex items-center justify-center hover:bg-red-700 transition-all shadow-md' 
                    onClick={() => navigate("/")}
                >
                    <FaLongArrowAltLeft className='w-6 h-6 text-white' />
                </div>
                <div className='bg-black text-white px-6 py-2 rounded-full text-sm font-semibold shadow-sm'>
                    Step 1 of 2: Basics
                </div>
            </div>

            <form 
                className='max-w-[700px] w-full flex flex-col gap-6' 
                onSubmit={(e) => {
                    e.preventDefault();
                    navigate("/listingpage2");
                }}
            >
                <h1 className='text-3xl font-bold text-gray-800 mb-2'>List your property</h1>
                
                <div className='flex flex-col gap-2'>
                    <label className='text-lg font-semibold text-gray-700'>Property Title</label>
                    <input 
                        type="text" 
                        className='w-full h-12 border-2 border-gray-200 rounded-xl px-4 focus:border-red-500 outline-none transition-all' 
                        required 
                        onChange={(e) => setTitle(e.target.value)} 
                        value={title} 
                        placeholder='e.g., Cozy 2BHK near Beach'
                    />
                </div>

                <div className='flex flex-col gap-2'>
                    <label className='text-lg font-semibold text-gray-700'>Description</label>
                    <textarea 
                        className='w-full h-32 border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-red-500 outline-none transition-all resize-none' 
                        required 
                        onChange={(e) => setDescription(e.target.value)} 
                        value={description}
                        placeholder='Tell guests what makes your place special...'
                    ></textarea>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    {imageSlots.map((slot) => (
                        <div key={slot.id} className='flex flex-col gap-2'>
                            <label className='text-sm font-medium text-gray-600'>Image {slot.id}</label>
                            <div className={`relative w-full h-14 border-2 border-dashed rounded-xl flex items-center justify-center transition-all cursor-pointer
                                ${slot.back ? 'border-red-500 bg-gray-100 shadow-inner' : 'border-gray-300 hover:bg-gray-50'}`}>
                                <input 
                                    type="file" 
                                    className='absolute inset-0 opacity-0 cursor-pointer z-10' 
                                    required={slot.id === 1 && !slot.back} // Only first image is strictly required for preview
                                    onChange={(e) => handleImageChange(e, slot.setBack, slot.setFront)}
                                />
                                {slot.back ? (
                                    <div className='flex items-center justify-between w-full px-3 z-20'>
                                        <span className='text-[10px] text-red-600 truncate font-bold w-[80%]'>
                                            {slot.back.name}
                                        </span>
                                        <button 
                                            type="button"
                                            onClick={(e) => removeImage(e, slot.setBack, slot.setFront)}
                                            className='bg-red-600 text-white rounded-full p-1 hover:bg-red-800 transition-colors'
                                        >
                                            <FaTimes size={10}/>
                                        </button>
                                    </div>
                                ) : (
                                    <span className='text-xs text-gray-400 pointer-events-none font-medium'>Upload Photo</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='flex flex-col gap-2'>
                        <label className='text-lg font-semibold text-gray-700'>Rent per Night</label>
                        <input 
                            type="number" 
                            className='w-full h-12 border-2 border-gray-200 rounded-xl px-4 focus:border-red-500 outline-none transition-all' 
                            required 
                            onChange={(e) => setRent(e.target.value)} 
                            value={rent} 
                            placeholder='₹ Amount'
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label className='text-lg font-semibold text-gray-700'>City</label>
                        <input 
                            type="text" 
                            className='w-full h-12 border-2 border-gray-200 rounded-xl px-4 focus:border-red-500 outline-none transition-all' 
                            required 
                            onChange={(e) => setCity(e.target.value)} 
                            value={city} 
                            placeholder='Nashik, India'
                        />
                    </div>
                </div>

                <div className='flex flex-col gap-2'>
                    <label className='text-lg font-semibold text-gray-700'>Landmark</label>
                    <input 
                        type="text" 
                        className='w-full h-12 border-2 border-gray-200 rounded-xl px-4 focus:border-red-500 outline-none transition-all' 
                        required 
                        onChange={(e) => setLandmark(e.target.value)} 
                        value={landmark}
                        placeholder='e.g., Near Vidya Vikas Circle'
                    />
                </div>

                <button className='w-full bg-red-600 text-white py-4 rounded-xl text-xl font-bold hover:bg-red-700 transition-all shadow-lg mt-4'>
                    Next Step
                </button>
            </form>
        </div>
    );
}

export default ListingPage1;