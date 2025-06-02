// components/Navbar.jsx
import { useAuth } from "../context/AuthContext"
import { useState } from "react"
import { LogOut } from "lucide-react"
import "../styles/Navbar.css"
import Button from "../components/ui/Button"
import RoleChip from "../components/ui/RoleChip"

export default function Navbar() {
    const { user, logout } = useAuth()
    const [menuOpen, setMenuOpen] = useState(false)

    const role = user?.role || "usuario"
    const isAdmin = role.toLowerCase() === "admin"

    return (
        <header className="navbar">
            <div className="container">
                <h1>Mi Aplicación</h1>

                <div className="desktop-nav">
                    <span className="username">{user?.name}</span>
                    <RoleChip role={role} />
                    <Button icon={LogOut} onClick={logout}>
                        Cerrar sesión
                    </Button>
                </div>

                <button
                    className={`hamburger ${menuOpen ? "open" : ""}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Abrir menú"
                >
                    <span />
                    <span />
                    <span />
                </button>
            </div>

            <div className={`mobile-menu ${menuOpen ? "visible" : ""}`}>
                <span className="username">{user?.name}</span>
                <span className={`role-chip ${isAdmin ? "admin" : "user"}`}>
                    {isAdmin ? "Admin" : "Usuario"}
                </span>
                <Button icon={LogOut} onClick={logout}>
                    Cerrar sesión
                </Button>
            </div>
        </header>
    )
}
