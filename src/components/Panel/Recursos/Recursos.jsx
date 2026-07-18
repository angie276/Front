import { useState, useEffect } from "react";
import "./Recursos.css"
import AgregarRecurso from "./AgregarRecurso"
import ItemRecurso from "./ItemRecurso"
import { useAuth } from "../../../context/AuthContext";

const Recursos = ({ proyecto }) => {
    const { usuarioActual, actualizarContenidoProyecto } = useAuth();
    const [recursos, setRecursos] = useState(proyecto?.recursos || []);
    const [filtroActivo, setFiltroActivo] = useState("todos");

    // Sync state with project prop updates
    useEffect(() => {
        setRecursos(proyecto?.recursos || []);
    }, [proyecto]);

    const agregarRecurso = async (nuevoRecurso) => {
        const recursosActualizados = [...recursos, nuevoRecurso];
        setRecursos(recursosActualizados);

        const tareasActuales = usuarioActual?.proyectos?.find(p => p.id === proyecto.id)?.tareas || [];
        await actualizarContenidoProyecto(proyecto.id, tareasActuales, recursosActualizados);
    };

    const eliminarRecurso = async (id) => {
        const recursosActualizados = recursos.filter(r => r.id !== id);
        setRecursos(recursosActualizados);

        const tareasActuales = usuarioActual?.proyectos?.find(p => p.id === proyecto.id)?.tareas || [];
        await actualizarContenidoProyecto(proyecto.id, tareasActuales, recursosActualizados);
    };

    // Filter resources by selected category
    const recursosFiltrados = filtroActivo === "todos"
        ? recursos
        : recursos.filter(r => (r.categoria || 'url').toLowerCase() === filtroActivo.toLowerCase());

    return (
        <div className="recursos-principal">
            <h2>Recursos</h2>
            
            {/* Filter buttons at the top */}
            <div className="filtro-categorias-container">
                {["todos", "pdf", "url", "doc", "csv", "ppt", "otros"].map((cat) => (
                    <button
                        key={cat}
                        type="button"
                        className={`btn-filtro ${filtroActivo === cat ? 'activo' : ''}`}
                        onClick={() => setFiltroActivo(cat)}
                    >
                        {cat === "todos" ? "Todos" : cat.toUpperCase()}
                    </button>
                ))}
            </div>

            <div className="contenedor-recursos">
                <div className="recursos">
                    {recursosFiltrados.length > 0 ? (
                        recursosFiltrados.map((recurso) => (
                            <ItemRecurso
                                key={recurso.id}
                                id={recurso.id}
                                nombre={recurso.nombre}
                                url={recurso.url}
                                categoria={recurso.categoria}
                                esArchivo={recurso.esArchivo}
                                archivoNombre={recurso.archivoNombre}
                                eliminarRecurso={eliminarRecurso}
                            />
                        ))
                    ) : (
                        <p className="no-recursos-msg">No hay recursos en esta categoría.</p>
                    )}
                </div>

                <AgregarRecurso onAgregarRecurso={agregarRecurso} />
            </div>
        </div>
    );
};

export default Recursos;
