import React, { useState, useEffect } from "react"
import { mockApi } from "../services/fakeApi"
import "../styles/AddressesManager.css"
import { Plus } from "lucide-react"
import Button from "../components/ui/Button"
// import RoleChip from "../components/ui/RoleChip"
import TypeChip from "../components/ui/TypeChip"
import { useAuth } from "../context/AuthContext"

export default function AddressesManager({ userId }) {
    const [addresses, setAddresses] = useState([])
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState({
        street: "",
        city: "",
        country: "",
        type: "Casa",
    })

    const role = user?.role || "usuario"
    const isAdmin = role.toLowerCase() === "admin"

    // Usamos UseEffect para cargar las direcciones al montar el componente
    useEffect(() => {
        loadAddresses()
    }, [userId])

    // funcion para cargar las direcciones del usuario

    const loadAddresses = async () => {
        try {
            const addressesData = await mockApi.getAddresses(userId)
            setAddresses(addressesData)
        } catch (error) {
            console.error("Error cargando direcciones:", error)
        } finally {
            setLoading(false)
        }
    }

    // funcion para manejar el submit del formulario

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            if (editingId) {
                const updated = await mockApi.updateAddress(editingId, formData)
                setAddresses(addresses.map((a) => (a.id === editingId ? updated : a)))
                setEditingId(null)
            } else {
                const created = await mockApi.createAddress({ ...formData, userId })
                setAddresses([...addresses, created])
                setShowForm(false)
            }
            resetForm()
        } catch (error) {
            console.error("Error guardando dirección:", error)
        }
    }

    // funcion para editar una dirección ya existente

    const handleEdit = (address) => {
        setFormData({
            street: address.street,
            city: address.city,
            country: address.country,
            type: address.type,
        })
        setEditingId(address.id)
    }

    // funcion para eliminar una dirección

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar esta dirección?")) {
            try {
                await mockApi.deleteAddress(id)
                setAddresses(addresses.filter((a) => a.id !== id))
            } catch (error) {
                console.error("Error eliminando dirección:", error)
            }
        }
    }

    // funcion para resetear el formulario

    const resetForm = () => {
        setEditingId(null)
        setFormData({ street: "", city: "", country: "", type: "Casa" })
    }

    if (loading) {
        return <div className="addresses-loading">Cargando direcciones...</div>
    }

    return (
        <div className="addresses-manager">
            <div className="header">
                <h2>Direcciones</h2>
                <Button
                    variant="primary"
                    onClick={() => setShowForm(true)}
                    icon={Plus}
                >
                    Agregar Dirección
                </Button>
            </div>

            {(showForm || editingId) && (
                <form onSubmit={handleSubmit} className="form">
                    <h3>{editingId ? "Editar Dirección" : "Agregar Dirección"}</h3>
                    <label>
                        <input
                            value={formData.street}
                            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                            required
                            placeholder="Dirección"
                        />
                    </label>
                    <label>
                        <input
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            required
                            placeholder="Ciudad"
                        />
                    </label>
                    <label>
                        <input
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            required
                            placeholder="País"
                        />
                    </label>
                    <label>
                        Tipo de Dirección
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="Casa">Casa</option>
                            <option value="Trabajo">Trabajo</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </label>
                    <div className="form-buttons">
                        <Button type="submit" variant="primary">
                            {editingId ? "Actualizar" : "Guardar"}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                setShowForm(false)
                                resetForm()
                            }}
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            )}

            {addresses.length === 0 ? (
                <p className="empty-message">
                    {isAdmin ? "Este usuario no tiene direcciones registradas" : "No tienes direcciones registradas"}
                </p>
            ) : (
                <div className="address-list">
                    {addresses.map((address) => (
                        <div key={address.id} className="address-card">
                            <div className="address-info">
                                <h3>{address.street}</h3>
                                <p>{address.city}, {address.country}</p>
                                <TypeChip type={address.type} />
                            </div>
                            <div className="actions">
                                <Button
                                    variant="primary"
                                    onClick={() => handleEdit(address)}
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDelete(address.id)}
                                >
                                    Eliminar
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
