import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import "../styles/LoginForm.css"

export default function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()

    const navigate = useNavigate()

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        const success = await login(email, password)

        if (!success) {
            setError("Credenciales inválidas. Intenta de nuevo.")
        } else {
            navigate("/dashboard") // Con esto se redirige al usuario al dashboard después de iniciar sesión
        }

    }

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
                        required
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
                            required
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

                {error && <div className="login-error">{error}</div>}

                <button type="submit" className="login-button" disabled={loading}>
                    {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </button>
            </form>

            <div className="demo-credentials">
                <p>Credenciales de prueba:</p>
                <table className="demo-table">
                    <thead>
                        <tr>
                            <th>Rol</th>
                            <th>Mail</th>
                            <th>Contraseña</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Admin</strong></td>
                            <td>admin@test.com</td>
                            <td>admin123</td>
                        </tr>
                        <tr>
                            <td><strong>Usuario</strong></td>
                            <td>tomas@user.com</td>
                            <td>user123</td>
                        </tr>
                        <tr>
                            <td><strong>Usuario</strong></td>
                            <td>maria@user.com</td>
                            <td>user123</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
