import { useAuth } from "../context/AuthContext"
import { useState } from "react"
import { LogOut } from "lucide-react"
import "../styles/Layout.css"

export default function Layout({ children }) {
    const { user, logout } = useAuth()
    const [menuOpen, setMenuOpen] = useState(false)

    const role = user?.role || "usuario"
    const isAdmin = role.toLowerCase() === "admin"

    return (
        <div className="layout">
            <header className="header">
                <div className="container">
                    <h1 className="title">Mi Aplicación</h1>

                    <div className="desktop-nav">
                        <span className="username">{user?.name}</span>
                        <span className={`role-chip ${isAdmin ? "admin" : "user"}`}>
                            {isAdmin ? "Admin" : "Usuario"}
                        </span>
                        <button className="logout" onClick={logout}>
                            <LogOut size={16} /> Cerrar sesión
                        </button>
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
                    <button className="logout" onClick={logout}>
                        <LogOut size={16} /> Cerrar sesión
                    </button>
                </div>
            </header>

            <main className="main">{children}</main>
        </div>
    )
}
