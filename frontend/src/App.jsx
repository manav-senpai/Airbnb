import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ListingPage1 from './pages/ListingPage1'
import ListingPage2 from './pages/ListingPage2'
import ListingPage3 from './pages/ListingPage3'
import MyListing from './pages/MyListing'
import ViewCard from './pages/ViewCard'
import MyBooking from './pages/MyBooking'
import Booked from './pages/Booked' 
import { userDataContext } from './Context/UserContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
// FIX: Import the Footer
import Footer from './Component/Footer';

function App() {
  const { userData } = useContext(userDataContext)

  return (
    // We add 'flex-col' to ensuring footer stays at bottom if content is short
    <div className="flex flex-col min-h-screen">
        <ToastContainer 
            position="top-center" 
            autoClose={3000} 
            hideProgressBar={false} 
            newestOnTop={false} 
            closeOnClick 
            rtl={false} 
            pauseOnFocusLoss 
            draggable 
            pauseOnHover 
            theme="light"
            limit={1}
        />
        
        {/* Routes Content */}
        <div className="flex-grow">
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            <Route
                path="/listingpage1"
                element={userData != null ? <ListingPage1 /> : <Navigate to="/" />}
                />

            <Route
                path="/listingpage2"
                element={userData != null ? <ListingPage2 /> : <Navigate to="/" />}
                />

            <Route
                path="/listingpage3"
                element={userData != null ? <ListingPage3 /> : <Navigate to="/" />}
                />

            <Route
                path="/mylisting"
                element={userData != null ? <MyListing /> : <Navigate to="/" />}
                />

            <Route
                path="/viewcard"
                element={userData != null ? <ViewCard /> : <Navigate to="/" />}
            />

            <Route
                path="/mybooking"
                element={userData != null ? <MyBooking /> : <Navigate to="/" />}
                />
                
            <Route
                path="/booked"
                element={userData != null ? <Booked /> : <Navigate to="/" />}
                />
            </Routes>
        </div>

        {/* FIX: Add Footer Here */}
        <Footer />
    </div>
  )
}

export default App