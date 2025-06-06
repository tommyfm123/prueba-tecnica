import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import StudiesManager from "../components/StudiesManager";
import { mockApi } from "../services/fakeApi";
import AddressesManager from "../components/AddressesManager";
import Button from "../components/ui/Button";
import "../styles/UserDashboard.css";
import { GraduationCap, MapPinHouse, Edit } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserDashboard() {
    const { user, setUser } = useAuth();
    const [activeTab, setActiveTab] = useState("studies");
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false); // 🔥 Nuevo estado de carga
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        password: "",
    });

    const validateForm = () => {
        if (!formData.name.trim() || !formData.email.trim()) {
            toast.error("Por favor completa nombre y email.");
            return false;
        }

        // Validación básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Por favor ingresa un email válido.");
            return false;
        }

        return true;
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true); // 🔥 Empieza carga
        try {
            const updatedUser = await mockApi.updateUser(user.id, formData);
            setUser(updatedUser);
            setEditMode(false);
            toast.success("Perfil actualizado correctamente.");
        } catch (error) {
            console.error("Error actualizando perfil:", error);
            toast.error("Error al actualizar el perfil.");
        } finally {
            setLoading(false); // 🔥 Fin carga
        }
    };

    if (!user) return null;

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
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Nombre"
                    />
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="Email"
                    />
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                        }
                        placeholder="Nueva contraseña (opcional)"
                    />
                    <div className="form-buttons">
                        <Button type="submit" variant="secondary" disabled={loading}>
                            {loading ? "Guardando..." : "Guardar"}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setEditMode(false)}
                            disabled={loading}
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
    );
}
