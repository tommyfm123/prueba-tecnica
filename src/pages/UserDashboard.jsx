import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import StudiesManager from "../components/StudiesManager"
import AddressesManager from "../components/AddressesManager"
import Button from "../components/ui/Button" // botón reutilizable
import "../styles/UserDashboard.css"
import { Users, Plus, GraduationCap, MapPinHouse } from "lucide-react"


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

            <div className="tab-content">
                <div className="tabs">
                    <div className="User-data">
                        <h2>Mis Datos</h2>
                        <p>Gestiona tu información personal</p>
                    </div>
                    <Button
                        variant="secondary"
                        active={activeTab === "studies"}
                        onClick={() => setActiveTab("studies")}
                    >
                        <GraduationCap /> Mis Estudios
                    </Button>
                    <Button
                        variant="secondary"
                        active={activeTab === "addresses"}
                        onClick={() => setActiveTab("addresses")}
                    >
                        <MapPinHouse /> Mis Direcciones
                    </Button>
                </div>
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
