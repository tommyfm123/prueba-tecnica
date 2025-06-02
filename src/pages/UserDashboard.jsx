import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import StudiesManager from "../components/StudiesManager"
import AddressesManager from "../components/AddressesManager"
import Button from "../components/ui/Button" // botón reutilizable
import "../styles/UserDashboard.css"

export default function UserDashboard() {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState("studies")

    if (!user) return null

    return (
        <div className="user-dashboard">
            <h1>Mi Perfil</h1>
            <div className="profile-card">
                <div className="profile-field">
                    <label>Nombre:</label>
                    <p>{user.name}</p>
                </div>
                <div className="profile-field">
                    <label>Email:</label>
                    <p>{user.email}</p>
                </div>
            </div>

            <h2>Mis Datos</h2>
            <p>Gestiona tu información personal</p>

            <div className="tabs">
                <Button
                    className={`tab-btn ${activeTab === "studies" ? "active" : ""}`}
                    onClick={() => setActiveTab("studies")}
                >
                    Mis Estudios
                </Button>
                <Button
                    className={`tab-btn ${activeTab === "addresses" ? "active" : ""}`}
                    onClick={() => setActiveTab("addresses")}
                >
                    Mis Direcciones
                </Button>
            </div>

            <div className="tab-content">
                {activeTab === "studies" && (
                    <StudiesManager userId={user.id} isAdmin={false} />
                )}
                {activeTab === "addresses" && (
                    <AddressesManager userId={user.id} isAdmin={false} />
                )}
            </div>
        </div>
    )
}
