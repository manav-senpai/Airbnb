import axios from 'axios'
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react' // Added useCallback
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
    
    // Image States
    let [frontEndImage1, setFrontEndImage1] = useState(null)
    let [frontEndImage2, setFrontEndImage2] = useState(null)
    let [frontEndImage3, setFrontEndImage3] = useState(null)
    
    let [backEndImage1, setBackEndImage1] = useState(null)
    let [backEndImage2, setBackEndImage2] = useState(null)
    let [backEndImage3, setBackEndImage3] = useState(null)
    
    let [rent, setRent] = useState("")
    let [city, setCity] = useState("")
    let [landmark, setLandmark] = useState("")
    let [category, setCategory] = useState("")

    // Counters
    let [guestCount, setGuestCount] = useState(1)
    let [bedroomCount, setBedroomCount] = useState(1)
    let [bathroomCount, setBathroomCount] = useState(1)

    // Status States
    let [adding, setAdding] = useState(false)
    let [updating, setUpdating] = useState(false)
    let [deleting, setDeleting] = useState(false)

    // Data States
    let [listingData, setListingData] = useState([])
    let [newListData, setNewListData] = useState([])
    let [cardDetails, setCardDetails] = useState(null)
    let [searchData, setSearchData] = useState([])

    // FIX 1: Wrap getListing in useCallback to prevent loops
    const getListing = useCallback(async () => {
        try {
            let result = await axios.get(`${serverUrl}/api/listing/get`, { withCredentials: true })
            setListingData(result.data)
            setNewListData(result.data)
        } catch (error) {
            console.error(error)
        }
    }, [serverUrl])

    // FIX 2: Wrap handleSearch in useCallback so Nav.jsx doesn't re-run it infinitely
    const handleSearch = useCallback((data) => {
        if (!data) {
            setSearchData([])
            return
        }
        // Client-side search
        const filtered = listingData.filter(item => 
            item.title.toLowerCase().includes(data.toLowerCase()) || 
            item.city.toLowerCase().includes(data.toLowerCase()) ||
            item.landmark.toLowerCase().includes(data.toLowerCase())
        );
        setSearchData(filtered);
    }, [listingData]) // Only changes when listingData changes

    const handleAddListing = async () => {
        setAdding(true)
        try {
            let formData = new FormData()
            formData.append("title", title)
            
            // Append images
            if(backEndImage1) formData.append("image1", backEndImage1)
            if(backEndImage2) formData.append("image2", backEndImage2)
            if(backEndImage3) formData.append("image3", backEndImage3)
            
            formData.append("description", description)
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
            
            // Reset Form
            setTitle(""); setDescription(""); setRent(""); setCity(""); setLandmark(""); setCategory("");
            setFrontEndImage1(null); setFrontEndImage2(null); setFrontEndImage3(null);
            setBackEndImage1(null); setBackEndImage2(null); setBackEndImage3(null);
            setGuestCount(1); setBedroomCount(1); setBathroomCount(1);
            
            navigate("/")
            getListing() 
        } catch (error) {
            setAdding(false)
            console.error(error)
            toast.error(error.response?.data?.message || "Failed to add listing")
        }
    }

    const handleViewCard = async (id) => {
        try {
            let result = await axios.get(`${serverUrl}/api/listing/get/${id}`, { withCredentials: true })
            setCardDetails(result.data)
            navigate("/viewcard")
        } catch (error) {
            console.error(error)
        }
    }

    const handleDeleteListing = async (id) => {
        setDeleting(true);
        try {
            await axios.delete(`${serverUrl}/api/listing/delete/${id}`, { withCredentials: true });
            toast.success("Listing Deleted Successfully");
            setDeleting(false);
            getListing();
        } catch (error) {
            setDeleting(false);
            console.error(error);
            toast.error("Failed to delete");
        }
    }

    useEffect(() => {
        getListing()
    }, [getListing]) // Added dependency

    let value = {
        title, setTitle,
        description, setDescription,
        frontEndImage1, setFrontEndImage1,
        frontEndImage2, setFrontEndImage2,
        frontEndImage3, setFrontEndImage3,
        backEndImage1, setBackEndImage1,
        backEndImage2, setBackEndImage2,
        backEndImage3, setBackEndImage3,
        rent, setRent,
        city, setCity,
        landmark, setLandmark,
        category, setCategory,
        guestCount, setGuestCount,
        bedroomCount, setBedroomCount,
        bathroomCount, setBathroomCount,
        handleAddListing,
        adding, setAdding,
        listingData, setListingData,
        getListing,
        newListData, setNewListData,
        handleViewCard,
        cardDetails, setCardDetails,
        updating, setUpdating,
        deleting, setDeleting,
        handleSearch, searchData, setSearchData,
        handleDeleteListing
    }

    return (
        <listingDataContext.Provider value={value}>
            {children}
        </listingDataContext.Provider>
    )
}

export default ListingContext