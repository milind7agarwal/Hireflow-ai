import { useState, useEffect } from "react";
import { getMe } from "./services/auth.api";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                setUser(data?.user ?? null)
            } catch (err) {
                console.error('Failed to fetch current user:', err)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        getAndSetUser()

    }, [])


    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            { children }
        </AuthContext.Provider>
    )
}

export { AuthProvider }