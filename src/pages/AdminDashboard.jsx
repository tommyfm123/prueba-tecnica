import { useState, useEffect } from "react"
import { mockApi } from "../services/fakeApi"
import { useAuth } from "../context/AuthContext"
import StudiesManager from "../components/StudiesManager"
import AddressesManager from "../components/AddressesManager"
import { Users, Plus, GraduationCap, MapPinHouse } from "lucide-react"
import "../styles/AdminDashboard.css"
import Button from "../components/ui/Button"

export default function AdminDashboard() {
    const { user } = useAuth() // traemos los datos del usuario logueado desde el contexto de autenticación
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [selectedTab, setSelectedTab] = useState("studies")
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        role: "user"
    })

    // Esto carga a los usuarios al montar el componente
    useEffect(() => {
        loadUsers()
    }, [])

    // Función para obtener usuarios desde la API simulada
    const loadUsers = async () => {
        try {
            const usersData = await mockApi.getUsers()
            setUsers(usersData)
        } catch (error) {
            console.error("Error cargando usuarios:", error)
        } finally {
            setLoading(false)
        }
    }

    // Crea un nuevo usuario desde el formulario

    const handleCreateUser = async (e) => {
        e.preventDefault()
        try {
            const created = await mockApi.createUser(newUser)
            setUsers([...users, created])
            setNewUser({ name: "", email: "", password: "", role: "user" })
            setShowForm(false)
        } catch (error) {
            console.error("Error creando usuario:", error)
        }
    }

    if (loading) {
        return <div className="admin-loading">Cargando usuarios...</div>
    }

    return (
        <div className="admin-dashboard">
            <h1>Dashboard</h1>
            <p>Bienvenido, <strong>{user?.name}</strong> (<em>{user?.role}</em>)</p>
            <div className="stats">
                <div className="stat-box">
                    <h3>Total</h3>
                    <p>{users.length}</p>
                </div>

                <div className="stat-box">
                    <h3>Admins</h3>
                    <p>{users.filter(u => u.role === "admin").length}</p>
                </div>

                <div className="stat-box">
                    <h3>Usuarios</h3>
                    <p>{users.filter(u => u.role === "user").length}</p>
                </div>
            </div>

            <div className="main-section">
                <div className="user-list">
                    <div className="user-list-header">
                        <div className="containerUser">
                            <h2><Users /> Usuarios</h2>
                            <Button variant="primary" icon={Plus} onClick={() => setShowForm(true)}>Nuevo</Button>
                        </div>
                        <p>Gestiona todos los usuarios del sistema</p>
                    </div>

                    {showForm && (
                        <form onSubmit={handleCreateUser} className="user-form">
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                required
                            />
                            <select
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            >
                                <option value="user">Usuario</option>
                                <option value="admin">Administrador</option>
                            </select>
                            <div className="containerBtn" style={{ display: 'flex', gap: '10px' }}>
                                <Button variant="primary" type="submit">Crear Usuario</Button>
                                <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>Cancelar</Button>
                            </div>
                        </form>
                    )}

                    <div className="user-items">
                        {users.map(u => (
                            <div
                                key={u.id}
                                className={`user-item ${selectedUser?.id === u.id ? "active" : ""}`}
                                onClick={() => setSelectedUser(u)}
                            >
                                <p className="nombre"><strong>{u.name}</strong></p>
                                <p className="email">{u.email}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="user-detail">
                    {selectedUser ? (
                        <>
                            <h2>Datos de {selectedUser.name}</h2>
                            <span className="tag">{selectedUser.role}</span>
                            <p>{selectedUser.email}</p>

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
                                {selectedTab === "studies" && <StudiesManager userId={selectedUser.id} isAdmin={true} />}
                                {selectedTab === "addresses" && <AddressesManager userId={selectedUser.id} isAdmin={true} />}
                            </div>
                        </>
                    ) : (
                        <p className="SelectData">Seleccioná un usuario para ver los datos</p>
                    )}
                </div>
            </div>
        </div>
    )
}