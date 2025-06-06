import React, { useState, useEffect } from "react";
import { mockApi } from "../services/fakeApi";
import "../styles/AddressesManager.css";
import { Plus } from "lucide-react";
import Button from "../components/ui/Button";
import TypeChip from "../components/ui/TypeChip";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddressesManager({ userId }) {
    const [addresses, setAddresses] = useState([]);
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false); // Estado para el guardado/eliminado
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        street: "",
        city: "",
        country: "",
        type: "Casa",
    });

    const role = user?.role || "usuario";
    const isAdmin = role.toLowerCase() === "admin";

    useEffect(() => {
        loadAddresses();
    }, [userId]);

    // Carga las direcciones del usuario
    const loadAddresses = async () => {
        try {
            const addressesData = await mockApi.getAddresses(userId);
            setAddresses(addressesData);
        } catch (error) {
            console.error("Error cargando direcciones:", error);
            toast.error("Error al cargar las direcciones.");
        } finally {
            setLoading(false);
        }
    };

    // Valida el formulario antes de enviar
    const validateForm = () => {
        if (!formData.street.trim() || !formData.city.trim() || !formData.country.trim()) {
            toast.error("Por favor, completa todos los campos.");
            return false;
        }
        return true;
    };

    // Maneja el envío del formulario para agregar o editar direcciones
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setSaving(true);

        try {
            if (editingId) {
                const updated = await mockApi.updateAddress(editingId, formData);
                setAddresses(addresses.map((a) => (a.id === editingId ? updated : a)));
                toast.success("Dirección actualizada correctamente.");
                setEditingId(null);
                setShowForm(false);
            } else {
                const created = await mockApi.createAddress({ ...formData, userId });
                setAddresses([...addresses, created]);
                toast.success("Dirección agregada correctamente.");
                setShowForm(false);
            }
            resetForm();
        } catch (error) {
            console.error("Error guardando dirección:", error);
            toast.error("Error al guardar la dirección.");
        } finally {
            setSaving(false);
        }
    };

    // Maneja la edición de las direcciones
    const handleEdit = (address) => {
        setFormData({
            street: address.street,
            city: address.city,
            country: address.country,
            type: address.type,
        });
        setEditingId(address.id);
        setShowForm(true);
    };

    // Manejar la eliminación de una dirección
    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar esta dirección?")) {
            setSaving(true);
            try {
                await mockApi.deleteAddress(id);
                setAddresses(addresses.filter((a) => a.id !== id));
                toast.success("Dirección eliminada correctamente.");
            } catch (error) {
                console.error("Error eliminando dirección:", error);
                toast.error("Error al eliminar la dirección.");
            } finally {
                setSaving(false);
            }
        }
    };

    // Resetear el formulario a su estado inicial
    const resetForm = () => {
        setEditingId(null);
        setFormData({ street: "", city: "", country: "", type: "Casa" });
    };

    if (loading) {
        return <div className="addresses-loading">Cargando direcciones...</div>;
    }

    return (
        <div className="addresses-manager">
            <div className="header">
                <h2>Direcciones</h2>
                <Button
                    variant="primary"
                    onClick={() => setShowForm(true)}
                    icon={Plus}
                    disabled={saving}
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
                            placeholder="Dirección"
                            disabled={saving}
                        />
                    </label>
                    <label>
                        <input
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="Ciudad"
                            disabled={saving}
                        />
                    </label>
                    <label>
                        <input
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            placeholder="País"
                            disabled={saving}
                        />
                    </label>
                    <label>
                        Tipo de Dirección
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            disabled={saving}
                        >
                            <option value="Casa">Casa</option>
                            <option value="Trabajo">Trabajo</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </label>
                    <div className="form-buttons">
                        <Button type="submit" variant="primary" disabled={saving}>
                            {saving ? "Guardando..." : editingId ? "Actualizar" : "Guardar"}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                setShowForm(false);
                                resetForm();
                            }}
                            disabled={saving}
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
                                    disabled={saving}
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDelete(address.id)}
                                    disabled={saving}
                                >
                                    Eliminar
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
