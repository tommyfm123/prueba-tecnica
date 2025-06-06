import { useState, useEffect } from "react";
import { mockApi } from "../services/fakeApi";
import "../styles/StudiesManager.css";
import { Plus } from "lucide-react";
import Button from "../components/ui/Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StudiesManager({ userId, isAdmin }) {
    const [studies, setStudies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false); // nuevo estado de carga para guardado
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        institution: "",
        year: new Date().getFullYear(),
    });

    useEffect(() => {
        loadStudies();
    }, [userId]);

    const loadStudies = async () => {
        try {
            const studiesData = await mockApi.getStudies(userId);
            setStudies(studiesData);
        } catch (error) {
            console.error("Error cargando estudios:", error);
            toast.error("Error al cargar los estudios.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.institution.trim() || !formData.year) {
            toast.error("Por favor completa todos los campos.");
            return;
        }

        if (isNaN(formData.year) || formData.year < 1950 || formData.year > 2030) {
            toast.error("El año debe ser un número entre 1950 y 2030.");
            return;
        }

        setSaving(true); // comienza el guardado

        try {
            if (editingId) {
                const updated = await mockApi.updateStudy(editingId, formData);
                setStudies(studies.map((s) => (s.id === editingId ? updated : s)));
                toast.success("Estudio actualizado con éxito.");
                setEditingId(null);
                setShowForm(false);
            } else {
                const newStudy = await mockApi.createStudy({ ...formData, userId });
                setStudies([...studies, newStudy]);
                toast.success("Estudio agregado con éxito.");
                setShowForm(false);
            }
            setFormData({ title: "", institution: "", year: new Date().getFullYear() });
        } catch (error) {
            console.error("Error guardando estudio:", error);
            toast.error("Error al guardar el estudio.");
        } finally {
            setSaving(false); // termina el guardado
        }
    };

    const handleEdit = (study) => {
        setFormData({
            title: study.title,
            institution: study.institution,
            year: study.year,
        });
        setEditingId(study.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Eliminar este estudio?")) {
            setSaving(true);
            try {
                await mockApi.deleteStudy(id);
                setStudies(studies.filter((s) => s.id !== id));
                toast.success("Elemento eliminado correctamente");
            } catch (error) {
                console.error("Error eliminando estudio:", error);
                toast.error("Error al eliminar el estudio.");
            } finally {
                setSaving(false);
            }
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ title: "", institution: "", year: new Date().getFullYear() });
        setShowForm(false);
    };

    if (loading) return <p>Cargando estudios...</p>;

    return (
        <div className="studies-manager">
            <div className="header">
                <h2>Estudios</h2>
                <Button variant="primary" icon={Plus} onClick={() => setShowForm(true)}>
                    Agregar Estudio
                </Button>
            </div>

            {(showForm || editingId) && (
                <form onSubmit={handleSubmit} className="study-form">
                    <h3>{editingId ? "Editar Estudio" : "Agregar Estudio"}</h3>

                    <input
                        type="text"
                        placeholder="Título"
                        value={formData.title}
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                        disabled={saving}
                    />
                    <input
                        type="text"
                        placeholder="Institución"
                        value={formData.institution}
                        onChange={(e) =>
                            setFormData({ ...formData, institution: e.target.value })
                        }
                        disabled={saving}
                    />
                    <input
                        type="number"
                        placeholder="Año"
                        value={formData.year}
                        pattern="[0-9]*"
                        inputMode="numeric"
                        onChange={(e) =>
                            setFormData({ ...formData, year: parseInt(e.target.value) })
                        }
                        min="1950"
                        max="2030"
                        disabled={saving}
                    />
                    <div className="form-actions">
                        <Button type="submit" variant="primary" disabled={saving}>
                            {saving ? "Guardando..." : editingId ? "Actualizar" : "Guardar"}
                        </Button>
                        <Button type="button" variant="secondary" onClick={cancelEdit} disabled={saving}>
                            Cancelar
                        </Button>
                    </div>
                </form>
            )}

            <div className="study-list">
                {studies.length === 0 ? (
                    <p>
                        {isAdmin
                            ? "Este usuario no tiene estudios registrados."
                            : "No tenés estudios registrados."}
                    </p>
                ) : (
                    studies.map((study) => (
                        <div key={study.id} className="study-card">
                            <div>
                                <h3>{study.title}</h3>
                                <p>
                                    {study.institution} - {study.year}
                                </p>
                            </div>
                            <div className="actions">
                                <Button variant="primary" onClick={() => handleEdit(study)} disabled={saving}>
                                    Editar
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => handleDelete(study.id)}
                                    disabled={saving}
                                >
                                    Eliminar
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
