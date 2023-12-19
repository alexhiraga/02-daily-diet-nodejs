import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";

import { api } from './lib/axios'
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";

export interface User {
    email: string
    userName: string
}

export function Router() {
    // create a validation for the user cookie
    const navigate = useNavigate()

    const [user, setUser] = useState<User>({ email: '', userName: '' })

    useEffect(() => {
        validateToken()        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function validateToken() {
        // Validate user and get the user info
        try {
            const res = await api.get('/validateToken')
            setUser(res.data.user)
        } catch (error) {
            console.error(error)
            navigate("/daily-diet/login")
        }
    }

    function setInfo(user?: User) {
        if(!user) {
            setUser({ email: '', userName: '' })
            return
        }
        const { email, userName } = user
        setUser({ email, userName })
    }

    return (
        <>
            <Navbar user={user} setInfo={setInfo} />
            <Routes>
                <Route path="/daily-diet" element={ <Home user={user} /> } />
                <Route path="/daily-diet/login" element={ <Auth setInfo={setInfo} /> } />
            </Routes>
        </>
    )
}