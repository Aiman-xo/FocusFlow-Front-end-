import React, { createContext } from 'react'
import { useContext } from 'react'
import { useEffect,useState } from 'react'
// import {axios} from 'axios'

const userContext = createContext()

function Auth({children}) {
    
    const [user,setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (e) {
            return null; // Fallback if string is corrupted
        }
    });
    const [token,setToken] = useState(() => localStorage.getItem('token') || null);
    // useEffect(()=>{
    //     const user1 = localStorage.getItem('user')
    //     const token1 = localStorage.getItem('token')

    //     if (user1 && token1){
    //         setUser(JSON.parse(user1))
    //         setToken(token1)
    //     }

    // },[]);

    const login =(token,userData)=>{
        localStorage.setItem('token',token);
        localStorage.setItem('user',JSON.stringify(userData));

        setUser(userData)
        setToken(token)

    }

    const logout = ()=>{
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        
        setToken(null);
        setUser(null);
    }
  return (
    <div>
        
        <userContext.Provider value={{
            login,
            logout,
            user,
            token,
            isAuthenticated: !!token
        }}>
            {children}
        </userContext.Provider>
    </div>
  )
}

export default Auth
export const useAuth = ()=> useContext(userContext)