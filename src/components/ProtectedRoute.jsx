import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth()

    if (loading) return <p>Cargando...</p>

    return isAuthenticated ? children : <Navigate to="/" replace />
}
