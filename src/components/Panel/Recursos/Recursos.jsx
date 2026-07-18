import { useState, useEffect } from "react";
import "./Recursos.css"
import AgregarRecurso from "./AgregarRecurso"
import ItemRecurso from "./ItemRecurso"
import {
    getRecursosByProyecto,
    crearRecurso,
    eliminarRecurso as eliminarRecursoApi
} from "../../../services/recurso.service.js";

const Recursos = ({ proyecto }) => {
    const [recursos, setRecursos] = useState([]);
    const [filtroActivo, setFiltroActivo] = useState("todos");

    // PostgreSQL is the source of truth. Reload when the selected project changes.
    useEffect(() => {
        let activo = true;

        const cargarRecursos = async () => {
            if (!proyecto?.id) {
                setRecursos([]);
                return;
            }

            try {
                const respuesta = await getRecursosByProyecto(proyecto.id);
                if (activo) setRecursos(respuesta.recursos || []);
                console.log('[RECURSOS] Recursos cargados:', respuesta.recursos || []);
            } catch (error) {
                console.error('[RECURSOS] Error al cargar recursos:', error);
                if (activo) setRecursos([]);
            }
        };

        cargarRecursos();
        return () => { activo = false; };
    }, [proyecto?.id]);

    const agregarRecurso = async (nuevoRecurso) => {
        try {
            console.log('[RECURSOS] Creando recurso:', nuevoRecurso);
            const respuesta = await crearRecurso({ ...nuevoRecurso, proyectoId: proyecto.id });
            setRecursos(prev => [...prev, respuesta.recurso]);
            console.log('[RECURSOS] Recurso creado:', respuesta.recurso);
        } catch (error) {
            console.error('[RECURSOS] Error al crear recurso:', error);
            alert(error.response?.data?.mensaje || error.message || 'No se pudo crear el recurso.');
        }
    };

    const eliminarRecurso = async (id) => {
        try {
            await eliminarRecursoApi(id);
            setRecursos(prev => prev.filter(r => r.id !== id));
            console.log('[RECURSOS] Recurso eliminado:', id);
        } catch (error) {
            console.error('[RECURSOS] Error al eliminar recurso:', error);
            alert(error.response?.data?.mensaje || error.message || 'No se pudo eliminar el recurso.');
        }
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
