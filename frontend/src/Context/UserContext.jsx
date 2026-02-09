import React, { createContext, useEffect, useState, useContext } from 'react'
import { authDataContext } from './AuthContext' 
import axios from 'axios'

export const userDataContext = createContext()

function UserContext({children}) {
    // We add a default value here just in case AuthContext isn't ready
    const authData = useContext(authDataContext)
    const serverUrl = authData ? authData.serverUrl : "http://localhost:8000"
    
    let [userData, setUserData] = useState(null)

    const getCurrentUser = async () => {
        try {
            let result = await axios.get(`${serverUrl}/api/user/currentuser`, { withCredentials: true })
            setUserData(result.data)
        } catch (error) {
            setUserData(null)
        }
    }

    useEffect(() =>{
    },[])

    let value = {
        userData,
        setUserData,
        getCurrentUser
    }

    return (
        <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider>
    )
}

export default UserContext