import { useState, useEffect } from "react";
import { mockApi } from "../services/fakeApi";
import { useAuth } from "../context/AuthContext";
import StudiesManager from "../components/StudiesManager";
import AddressesManager from "../components/AddressesManager";
import { Users, UserX, GraduationCap, MapPinHouse, Edit } from "lucide-react";
import "../styles/AdminDashboard.css";
import Button from "../components/ui/Button";
import RoleChip from "../components/ui/RoleChip";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminDashboard() {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState("studies");
    const [editingUser, setEditingUser] = useState(false);
    const [formLoading, setFormLoading] = useState(false); // nuevo estado para mostrar carga en el form

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await mockApi.getUsers();
            setUsers(response);
        } catch (error) {
            console.error("Error cargando usuarios:", error);
            toast.error("Error cargando usuarios.");
        } finally {
            setLoading(false);
        }
    };

    // Cuando seleccionás un usuario, cerramos el formulario de edición para evitar confusiones
    useEffect(() => {
        setEditingUser(false);
        setFormData({ name: "", email: "", password: "" });
    }, [selectedUser]);

    const handleEditUser = (user) => {
        setFormData({
            name: user.name,
            email: user.email,
            password: "",
        });
        setEditingUser(true);
    };

    const handleUpdateUser = async () => {
        const dataToUpdate = { ...formData };
        if (!dataToUpdate.password.trim()) {
            delete dataToUpdate.password;
        }

        if (!dataToUpdate.name.trim() || !dataToUpdate.email.trim()) {
            toast.error("Por favor completa el nombre y el email.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(dataToUpdate.email)) {
            toast.error("Por favor ingresa un email válido.");
            return;
        }

        setFormLoading(true); // empieza la carga
        try {
            await mockApi.updateUser(selectedUser.id, dataToUpdate);
            toast.success("Usuario actualizado correctamente.");
            setEditingUser(false);
            setFormData({ name: "", email: "", password: "" });
            loadUsers();
        } catch (error) {
            console.error("Error actualizando usuario:", error);
            toast.error("Error al actualizar el usuario.");
        } finally {
            setFormLoading(false); // termina la carga
        }
    };

    const handleDeleteUser = async () => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
            setFormLoading(true); // usa el mismo loading para evitar nuevo estado
            try {
                await mockApi.deleteUser(selectedUser.id);
                toast.success("Usuario eliminado correctamente.");
                setSelectedUser(null);
                loadUsers();
            } catch (error) {
                console.error("Error eliminando usuario:", error);
                toast.error("Error al eliminar el usuario.");
            } finally {
                setFormLoading(false);
            }
        }
    };

    if (loading) {
        return <div className="admin-loading">Cargando usuarios...</div>;
    }

    return (
        <div className="admin-dashboard">
            <h1>Dashboard Admin</h1>
            <p>
                Bienvenido, <strong>{user?.name}</strong> (<em>{user?.role}</em>)
            </p>

            <div className="stats">
                <div className="stat-box">
                    <h3>Total</h3>
                    <p>{users.length}</p>
                </div>
                <div className="stat-box">
                    <h3>Admins</h3>
                    <p>{users.filter((u) => u.role === "admin").length}</p>
                </div>
                <div className="stat-box">
                    <h3>Usuarios</h3>
                    <p>{users.filter((u) => u.role === "user").length}</p>
                </div>
            </div>

            <div className="main-section">
                <div className="user-list">
                    <div className="user-list-header">
                        <div className="containerUser">
                            <h2>
                                <Users /> Usuarios
                            </h2>
                        </div>
                        <p>Gestiona todos los usuarios del sistema</p>
                    </div>

                    <div className="user-items">
                        {users.map((u) => (
                            <div
                                key={u.id}
                                className={`user-item ${selectedUser?.id === u.id ? "active" : ""}`}
                                onClick={() => setSelectedUser(u)}
                            >
                                <p className="nombre">
                                    <strong>{u.name}</strong>
                                </p>
                                <p className="email">{u.email}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="user-detail">
                    {selectedUser ? (
                        <>
                            <div className="user-information">
                                <h2>Datos de {selectedUser.name}</h2>
                                <RoleChip role={selectedUser.role} />
                                <p>{selectedUser.email}</p>

                                <div className="tabs" style={{ display: "flex", gap: "10px" }}>
                                    <Button variant="primary" onClick={() => handleEditUser(selectedUser)}>
                                        <Edit size={16} /> Editar Perfil
                                    </Button>
                                    <Button variant="danger" onClick={handleDeleteUser}>
                                        <UserX size={16} /> Eliminar Usuario
                                    </Button>
                                </div>

                                <hr style={{ margin: "15px 0", borderTop: "1px solid #ccc" }} />
                            </div>

                            {/* Formulario para editar perfil */}
                            {editingUser && (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleUpdateUser();
                                    }}
                                    className="user-form"
                                >
                                    <input
                                        type="text"
                                        placeholder="Nombre"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Nueva contraseña (opcional)"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <div className="containerBtn" style={{ display: "flex", gap: "10px" }}>
                                        <Button variant="primary" type="submit" disabled={formLoading}>
                                            {formLoading ? "Guardando..." : "Guardar"}
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            type="button"
                                            onClick={() => setEditingUser(false)}
                                            disabled={formLoading}
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                </form>
                            )}

                            <div className="tabs">
                                <Button
                                    variant="secondary"
                                    active={selectedTab === "studies"}
                                    onClick={() => setSelectedTab("studies")}
                                >
                                    <GraduationCap /> Estudios
                                </Button>
                                <Button
                                    variant="secondary"
                                    active={selectedTab === "addresses"}
                                    onClick={() => setSelectedTab("addresses")}
                                >
                                    <MapPinHouse /> Direcciones
                                </Button>
                            </div>

                            <div className="tab-content">
                                {selectedTab === "studies" && (
                                    <StudiesManager userId={selectedUser.id} isAdmin={true} />
                                )}
                                {selectedTab === "addresses" && (
                                    <AddressesManager userId={selectedUser.id} isAdmin={true} />
                                )}
                            </div>
                        </>
                    ) : (
                        <p className="SelectData">Seleccioná un usuario para ver los datos</p>
                    )}
                </div>
            </div>
        </div>
    );
}
