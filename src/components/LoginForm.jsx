import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { mockApi } from "../services/fakeApi";
import "react-toastify/dist/ReactToastify.css";
import "../styles/LoginForm.css";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);

    // Obtener usuarios con contraseñas
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await mockApi.getUsersWithPasswords();
                setUsers(usersData);
            } catch (error) {
                console.error("Error cargando usuarios:", error);
                toast.error("Error al cargar usuarios.");
            }
        };

        fetchUsers();
    }, []);

    const validateForm = () => {
        if (!email.trim() || !password.trim()) {
            toast.error("Por favor, completa todos los campos.");
            return false;
        }
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            toast.error("Email inválido");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        const success = await login(email, password);

        if (!success) {
            toast.error("Credenciales inválidas. Intenta de nuevo.");
        } else {
            toast.success("Sesión iniciada correctamente!");

            const storedUser = JSON.parse(sessionStorage.getItem("user"));
            if (storedUser.role === "admin") {
                navigate("/dashboard-admin");
            } else if (storedUser.role === "user") {
                navigate("/dashboard-user");
            } else {
                toast.error("Rol no reconocido. Contacta al administrador.");
            }
        }

        setLoading(false);
    };

    return (
        <div className="login-card">
            <div className="login-header">
                <h2>Iniciar Sesión</h2>
                <p>Ingresa tus credenciales para acceder</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Ingresa tu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <div className="password-wrapper">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Ingresa tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                </div>

                <button type="submit" className="login-button" disabled={loading}>
                    {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </button>
            </form>

            <div className="demo-credentials">
                <p>Usuarios registrados (email y contraseña):</p>
                <table className="demo-table">
                    <thead>
                        <tr>
                            <th>Rol</th>
                            <th>Email</th>
                            <th>Contraseña</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td><strong>{u.role === "admin" ? "Admin" : "Usuario"}</strong></td>
                                <td>{u.email}</td>
                                <td>{u.password}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
