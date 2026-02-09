import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import AuthContext from './Context/AuthContext' 
import UserContext from './Context/UserContext'
import ListingContext from './Context/ListingContext'
import BookingContext from './Context/BookingContext'
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter> 
    <AuthContext>
      <UserContext>
        <ListingContext> 
          <BookingContext>
             <App />
          </BookingContext>
        </ListingContext>
      </UserContext>
    </AuthContext>
  </BrowserRouter>
)