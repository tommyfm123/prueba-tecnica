import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import StudiesManager from "../components/StudiesManager"
import { mockApi } from "../services/fakeApi"
import AddressesManager from "../components/AddressesManager"
import Button from "../components/ui/Button"
import "../styles/UserDashboard.css"
import { Users, Plus, GraduationCap, MapPinHouse, Edit } from "lucide-react"

export default function UserDashboard() {
    const { user, setUser } = useAuth()
    const [activeTab, setActiveTab] = useState("studies")
    const [editMode, setEditMode] = useState(false)
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        password: "",
    })

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        try {
            const updatedUser = await mockApi.updateUser(user.id, formData)
            // Solo actualizamos el contexto, ¡eso fuerza el re-render en todos los componentes!
            setUser(updatedUser)
            setEditMode(false)
        } catch (error) {
            console.error("Error actualizando perfil:", error)
        }
    }




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
                <Button variant="secondary" onClick={() => setEditMode(!editMode)}>
                    <Edit size={16} /> Editar Perfil
                </Button>
            </div>

            {/* Formulario para editar datos */}
            {editMode && (
                <form onSubmit={handleUpdateProfile} className="form">
                    <h4>Editar Perfil</h4>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nombre"
                        required
                    />
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Email"
                        required
                    />
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Nueva contraseña (opcional)"
                    />
                    <div className="form-buttons">

                        <Button type="submit" variant="secondary">
                            Guardar
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setEditMode(false)}
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            )}


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
