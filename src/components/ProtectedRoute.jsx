import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) return <p>Cargando...</p>;

    if (!isAuthenticated) return <Navigate to="/" replace />;

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // esto redirige al dashboard específico según el rol
        if (user.role === "admin") {
            return <Navigate to="/dashboard-admin" replace />;
        } else if (user.role === "user") {
            return <Navigate to="/dashboard-user" replace />;
        } else {
            return <Navigate to="/403" replace />;
        }
    }

    return children;
}
