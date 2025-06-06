import { useState, useEffect } from "react";
import { mockApi } from "../services/fakeApi";
import { useAuth } from "../context/AuthContext";
import StudiesManager from "../components/StudiesManager";
import AddressesManager from "../components/AddressesManager";
import { Users, UserX, GraduationCap, MapPinHouse, Edit, Plus } from "lucide-react";
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
    const [creatingUser, setCreatingUser] = useState(false);
    const [formLoading, setFormLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    // Esto carga usuarios al montar el componente
    useEffect(() => {
        loadUsers();
    }, []);

    // Función para cargar usuarios desde el mockApi
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


    useEffect(() => {
        setEditingUser(false);
        setCreatingUser(false);
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

    // Función para actualizar un usuario
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

        // Verificar que el email no exista ya
        setFormLoading(true);
        try {
            const updatedUser = await mockApi.updateUser(selectedUser.id, dataToUpdate);
            toast.success("Usuario actualizado correctamente.");

            setUsers((prevUsers) =>
                prevUsers.map((u) => (u.id === selectedUser.id ? { ...u, ...updatedUser } : u))
            );

            setSelectedUser((prev) => ({
                ...prev,
                ...updatedUser,
            }));

            setEditingUser(false);
            setFormData({ name: "", email: "", password: "" });
        } catch (error) {
            console.error("Error actualizando usuario:", error);
            toast.error("Error al actualizar el usuario.");
        } finally {
            setFormLoading(false);
        }
    };

    // Función para eliminar un usuario
    const handleDeleteUser = async () => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
            setFormLoading(true);
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

    // Función para crear un nuevo usuario
    const handleCreateUser = () => {
        setCreatingUser(true);
        setSelectedUser(null);
        setFormData({ name: "", email: "", password: "" });
    };

    // Función para manejar el envío del formulario de creación de usuario
    const handleSubmitNewUser = async () => {
        if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
            toast.error("Completa todos los campos para crear un nuevo usuario.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Por favor ingresa un email válido.");
            return;
        }

        // Verificar que el email no exista ya
        const emailExists = users.some((u) => u.email === formData.email);
        if (emailExists) {
            toast.error("Ese email ya está en uso. Por favor elige otro.");
            return;
        }

        setFormLoading(true);
        try {
            await mockApi.createUser({ ...formData, role: "user" });
            toast.success("Usuario creado correctamente.");
            loadUsers();
            setCreatingUser(false);
            setFormData({ name: "", email: "", password: "" });
        } catch (error) {
            console.error("Error creando usuario:", error);
            toast.error("Error al crear el usuario.");
        } finally {
            setFormLoading(false);
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
                        <Button variant="primary" onClick={handleCreateUser}>
                            <Plus size={16} /> Crear Usuario
                        </Button>
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
                    {creatingUser ? (
                        <div className="user-information">
                            <h2>Crear Nuevo Usuario</h2>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSubmitNewUser();
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
                                    placeholder="Contraseña"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <div className="containerBtn" style={{ display: "flex", gap: "10px" }}>
                                    <Button variant="primary" type="submit" disabled={formLoading}>
                                        {formLoading ? "Guardando..." : "Crear"}
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        onClick={() => setCreatingUser(false)}
                                        disabled={formLoading}
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        </div>
                    ) : selectedUser ? (
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
                        <p className="SelectData">
                            Seleccioná un usuario o crea uno nuevo para ver los datos
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
