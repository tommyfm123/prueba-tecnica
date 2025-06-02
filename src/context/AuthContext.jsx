import { createContext, useContext, useState, useEffect } from "react"
import { mockAuth } from "../services/fakeApi"

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const savedToken = sessionStorage.getItem("token")
        const savedUser = sessionStorage.getItem("user")

        if (savedToken && savedUser) {
            setToken(savedToken)
            setUser(JSON.parse(savedUser))
        }
        setLoading(false)
    }, [])

    // ✅ Nuevo useEffect: actualiza sessionStorage cuando cambia user
    useEffect(() => {
        if (user) {
            sessionStorage.setItem("user", JSON.stringify(user))
        }
    }, [user])

    const login = async (email, password) => {
        try {
            const response = await mockAuth.login(email, password)

            if (response.success) {
                setToken(response.token)
                setUser(response.user)

                sessionStorage.setItem("token", response.token)
                sessionStorage.setItem("user", JSON.stringify(response.user))

                return true
            }

            return false
        } catch (error) {
            console.error("Error en login:", error)
            return false
        }
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        sessionStorage.removeItem("token")
        sessionStorage.removeItem("user")
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser, // Asegúrate de exportar setUser para poder actualizar desde otros componentes
                token,
                isAuthenticated: !!token && !!user,
                login,
                logout,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider")
    }
    return context
}
