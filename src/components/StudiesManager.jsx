import { useState, useEffect } from "react"
import { mockApi } from "../services/fakeApi"
import "../styles/StudiesManager.css" // Asegúrate de tener este archivo CSS
import { Plus } from "lucide-react"


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

    // Carga los estudios del usuario al montar el componente
    useEffect(() => {
        loadStudies()
    }, [userId])

    // Función para obtener todos los estudios del usuario desde la API simulada
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
                // En caso de haber ID, se actualiza un estudio existente
                const updated = await mockApi.updateStudy(editingId, formData)
                setStudies(studies.map((s) => (s.id === editingId ? updated : s)))
                setEditingId(null)
            } else {
                // Si no hay id, se crea un nuevo estudio
                const newStudy = await mockApi.createStudy({ ...formData, userId })
                setStudies([...studies, newStudy])
                setShowForm(false)
            }
            // Con esto reiniciamos el formulario
            setFormData({ title: "", institution: "", year: new Date().getFullYear() })
        } catch (error) {
            console.error("Error guardando estudio:", error)
        }
    }

    // Esto carga los datos del estudio a editar en el formulario
    const handleEdit = (study) => {
        setFormData({
            title: study.title,
            institution: study.institution,
            year: study.year,
        })
        setEditingId(study.id)
    }

    // Elimina un estudio y actualiza la lista
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

    // Cancela la edición y resetea el formulario
    const cancelEdit = () => {
        setEditingId(null)
        setFormData({ title: "", institution: "", year: new Date().getFullYear() })
    }

    if (loading) return <p>Cargando estudios...</p>

    return (
        <div className="studies-manager">
            <div className="header">
                <h3>Estudios</h3>
                <button className="btn-Add" onClick={() => setShowForm(true)}><Plus /> Agregar Estudio</button>
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
                        inputmode="numeric"
                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                        min="1950"
                        max="2030"
                        required
                    />
                    <div className="form-actions">
                        <button type="submit">{editingId ? "Actualizar" : "Guardar"}</button>
                        <button type="button" onClick={() => { setShowForm(false); cancelEdit() }}>
                            Cancelar
                        </button>
                    </div>
                </form>
            )}
            <div className="study-list">
                {studies.length === 0 ? (
                    <p>{isAdmin ? "Este usuario no tiene estudios registrados." : "No tenés estudios registrados."}</p>
                ) : (
                    studies.map((study) => (
                        <div key={study.id} className="study-card">
                            <div>
                                <h4>{study.title}</h4>
                                <p>{study.institution} - {study.year}</p>
                            </div>
                            <div className="actions">
                                <button onClick={() => handleEdit(study)}>Editar</button>
                                <button onClick={() => handleDelete(study.id)}>Eliminar</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
