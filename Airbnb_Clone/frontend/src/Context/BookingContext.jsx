import axios from 'axios'
import React, { createContext, useContext, useState } from 'react'
import { authDataContext } from './AuthContext'
import { userDataContext } from './UserContext'
import { listingDataContext } from './ListingContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

export const bookingDataContext = createContext()

function BookingContext({ children }) {
    const [checkIn, setCheckIn] = useState("")
    const [checkOut, setCheckOut] = useState("")
    const [total, setTotal] = useState(0)
    const [night, setNight] = useState(0)
    // Changed to null to check for presence on the success page
    const [bookingData, setBookingData] = useState(null)
    const [booking, setBooking] = useState(false)
    
    let navigate = useNavigate()  
    const { serverUrl } = useContext(authDataContext)
    const { getCurrentUser } = useContext(userDataContext)
    const { getListing } = useContext(listingDataContext)

    const handleBooking = async (id) => {
        if (!checkIn || !checkOut) return toast.error("Please select dates");
        
        setBooking(true)
        try {
            const result = await axios.post(`${serverUrl}/api/booking/create/${id}`, {
                checkIn, 
                checkOut, 
                totalRent: total // Synchronized with backend controller
            }, { withCredentials: true })
      
            await getCurrentUser()
            await getListing()
            setBookingData(result.data)
            setBooking(false)
            navigate("/booked") 
            toast.success("Booking Successful")
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || "Booking Failed")
            setBooking(false)
        }
    }

    const value = {
        checkIn, setCheckIn,
        checkOut, setCheckOut,
        total, setTotal,
        night, setNight,
        bookingData, setBookingData,
        handleBooking, booking
    }

    return (
        <bookingDataContext.Provider value={value}>
            {children}
        </bookingDataContext.Provider>
    )
}

export default BookingContext