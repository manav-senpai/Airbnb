import axios from 'axios'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

export const listingDataContext = createContext()

function ListingContext({children}) {
    let navigate = useNavigate() 
    let { serverUrl } = useContext(authDataContext)

    // Form States
    let [title, setTitle] = useState("")
    let [description, setDescription] = useState("")
    let [backEndImage1, setBackEndImage1] = useState(null)
    let [backEndImage2, setBackEndImage2] = useState(null)
    let [backEndImage3, setBackEndImage3] = useState(null)
    let [rent, setRent] = useState("")
    let [city, setCity] = useState("")
    let [landmark, setLandmark] = useState("")
    let [category, setCategory] = useState("")
    let [guestCount, setGuestCount] = useState(1)
    let [bedroomCount, setBedroomCount] = useState(1)
    let [bathroomCount, setBathroomCount] = useState(1)

    // Status & Data States
    let [adding, setAdding] = useState(false)
    let [listingData, setListingData] = useState([])
    let [newListData, setNewListData] = useState([])
    let [cardDetails, setCardDetails] = useState(null)
    let [searchData, setSearchData] = useState([])

    const handleAddListing = async () => {
        setAdding(true)
        try {
            let formData = new FormData()
            formData.append("title", title)
            formData.append("description", description)
            formData.append("image", backEndImage1) // Matches backend upload.single("image")
            formData.append("rent", rent)
            formData.append("city", city)
            formData.append("landmark", landmark)
            formData.append("category", category)
            formData.append("guestCapacity", guestCount)
            formData.append("bedroomCount", bedroomCount)
            formData.append("bathroomCount", bathroomCount)
        
            await axios.post(`${serverUrl}/api/listing/create`, formData, { withCredentials: true })
            
            setAdding(false)
            toast.success("Listing Added Successfully")
            getListing()
            navigate("/")
        } catch (error) {
            setAdding(false)
            toast.error(error.response?.data?.message || "Failed to add listing")
        }
    }

    const handleViewCard = async (id) => {
        try {
            // FIXED: Matches backend router.get("/get/:id")
            let result = await axios.get(`${serverUrl}/api/listing/get/${id}`, { withCredentials: true })
            setCardDetails(result.data)
            navigate("/viewcard")
        } catch (error) {
            console.error(error)
        }
    }

    const getListing = async () => {
        try {
            // FIXED: Matches backend router.get("/get")
            let result = await axios.get(`${serverUrl}/api/listing/get`, { withCredentials: true })
            setListingData(result.data)
            setNewListData(result.data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getListing()
    }, [])

    let value = {
        title, setTitle, description, setDescription,
        backEndImage1, setBackEndImage1, backEndImage2, setBackEndImage2, backEndImage3, setBackEndImage3,
        rent, setRent, city, setCity, landmark, setLandmark, category, setCategory,
        guestCount, setGuestCount, bedroomCount, setBedroomCount, bathroomCount, setBathroomCount,
        handleAddListing, adding, listingData, setListingData, getListing,
        newListData, setNewListData, handleViewCard, cardDetails, setCardDetails,
        searchData, setSearchData
    }

    return (
        <listingDataContext.Provider value={value}>
            {children}
        </listingDataContext.Provider>
    )
}

export default ListingContext