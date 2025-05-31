import React, { useState, useEffect } from "react"
import { mockApi } from "../services/fakeApi"
import "../styles/AddressesManager.css"
import { Plus } from "lucide-react"

export default function AddressesManager({ userId, isAdmin }) {
    const [addresses, setAddresses] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState({
        street: "",
        city: "",
        country: "",
        type: "Casa",
    })

    useEffect(() => {
        loadAddresses()
    }, [userId])

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

    const handleEdit = (address) => {
        setFormData({
            street: address.street,
            city: address.city,
            country: address.country,
            type: address.type,
        })
        setEditingId(address.id)
    }

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
                <h3>Direcciones</h3>
                <button className="btn-add" onClick={() => setShowForm(true)}><Plus /> Agregar Dirección</button>
            </div>

            {(showForm || editingId) && (
                <form onSubmit={handleSubmit} className="form">
                    <h4>{editingId ? "Editar Dirección" : "Agregar Dirección"}</h4>
                    <label>
                        Dirección:
                        <input
                            value={formData.street}
                            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Ciudad:
                        <input
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            required
                        />
                    </label>
                    <label>
                        País:
                        <input
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Tipo:
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
                        <button type="submit">{editingId ? "Actualizar" : "Guardar"}</button>
                        <button type="button" onClick={() => { setShowForm(false); resetForm() }}>Cancelar</button>
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
                                <strong>{address.street}</strong>
                                <p>{address.city}, {address.country}</p>
                                <span className="tag">{address.type}</span>
                            </div>
                            <div className="actions">
                                <button onClick={() => handleEdit(address)}>Editar</button>
                                <button onClick={() => handleDelete(address.id)} className="delete">Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
