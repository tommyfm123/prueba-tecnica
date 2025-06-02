import { useState, useEffect } from "react"
import { mockApi } from "../services/fakeApi"
import "../styles/StudiesManager.css"
import { Plus } from "lucide-react"
import Button from "../components/ui/Button"

export default function StudiesManager({ userId, isAdmin }) {
    const [studies, setStudies] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState({
        title: "",
        institution: "",
        year: new Date().getFullYear(),
    })

    useEffect(() => {
        loadStudies()
    }, [userId])

    const loadStudies = async () => {
        try {
            const studiesData = await mockApi.getStudies(userId)
            setStudies(studiesData)
        } catch (error) {
            console.error("Error cargando estudios:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingId) {
                const updated = await mockApi.updateStudy(editingId, formData)
                setStudies(studies.map((s) => (s.id === editingId ? updated : s)))
                setEditingId(null)
                setShowForm(false)  // <--- Agregar aquí para ocultar el formulario
            } else {
                const newStudy = await mockApi.createStudy({ ...formData, userId })
                setStudies([...studies, newStudy])
                setShowForm(false)
            }
            setFormData({ title: "", institution: "", year: new Date().getFullYear() })
        } catch (error) {
            console.error("Error guardando estudio:", error)
        }
    }

    const handleEdit = (study) => {
        setFormData({
            title: study.title,
            institution: study.institution,
            year: study.year,
        })
        setEditingId(study.id)
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (confirm("¿Eliminar este estudio?")) {
            try {
                await mockApi.deleteStudy(id)
                setStudies(studies.filter((s) => s.id !== id))
            } catch (error) {
                console.error("Error eliminando estudio:", error)
            }
        }
    }

    const cancelEdit = () => {
        setEditingId(null)
        setFormData({ title: "", institution: "", year: new Date().getFullYear() })
        setShowForm(false)
    }

    if (loading) return <p>Cargando estudios...</p>

    return (
        <div className="studies-manager">
            <div className="header">
                <h3>Estudios</h3>
                <Button variant="primary" icon={Plus} onClick={() => setShowForm(true)}>
                    Agregar Estudio
                </Button>
            </div>

            {(showForm || editingId) && (
                <form onSubmit={handleSubmit} className="study-form">
                    <h4>{editingId ? "Editar Estudio" : "Agregar Estudio"}</h4>

                    <input
                        type="text"
                        placeholder="Título"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Institución"
                        value={formData.institution}
                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Año"
                        value={formData.year}
                        pattern="[0-9]*"
                        inputMode="numeric"
                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                        min="1950"
                        max="2030"
                        required
                    />
                    <div className="form-actions">
                        <Button type="submit" variant="primary" >
                            {editingId ? "Actualizar" : "Guardar"}
                        </Button>
                        <Button type="button" variant="secondary" onClick={cancelEdit}>
                            Cancelar
                        </Button>
                    </div>
                </form>
            )}

            <div className="study-list">
                {studies.length === 0 ? (
                    <p>{isAdmin ? "Este usuario no tiene estudios registrados." : "No tenés estudios registrados."}</p>
                ) : (
                    studies.map((study) => (
                        <div key={study.id} className="study-card user-dashboard">
                            <div>
                                <h4>{study.title}</h4>
                                <p>
                                    {study.institution} - {study.year}
                                </p>
                            </div>
                            <div className="actions">
                                <Button variant="primary" onClick={() => handleEdit(study)}>
                                    Editar
                                </Button>
                                <Button variant="secondary" onClick={() => handleDelete(study.id)}>
                                    Eliminar
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
