import { useState, useEffect } from "react";
import ItemTarea from "./ItemTarea";
import AgregarTarea from "./AgregarTarea";
import ModalTarea from "./ModalTarea";
import CronogramaTareas from "../CronogramaTareas/CronogramaTareas";
import { ListIcon, ChartIcon } from "../EspacioTrabajo/Icons/Icons";
import {
    getTareasByProyecto,
    crearTarea,
    actualizarTarea as actualizarTareaApi,
    cambiarEstadoTarea,
    eliminarTarea as eliminarTareaApi
} from "../../../services/tarea.service.js";

import "./TablaTareas.css";

const TablaTareas = ({ proyecto, miembros = [] }) => {
    const [tareas, setTareas] = useState([]);
    const [vistaTareas, setVistaTareas] = useState("lista"); // "lista" | "cronograma"
    const [tareaSeleccionada, setTareaSeleccionada] = useState(null);

    // Filtros
    const [filtroMiembro, setFiltroMiembro] = useState("Todos");
    const [filtroEstado, setFiltroEstado] = useState("Todos");
    const [filtroPrioridad, setFiltroPrioridad] = useState("Todos");

    // PostgreSQL is the source of truth. Reload when the selected project changes.
    useEffect(() => {
        let activo = true;

        const cargarTareas = async () => {
            if (!proyecto?.id) {
                setTareas([]);
                return;
            }

            try {
                const respuesta = await getTareasByProyecto(proyecto.id);
                if (activo) setTareas(respuesta.tareas || []);
                console.log('[TAREAS] Tareas cargadas:', respuesta.tareas || []);
            } catch (error) {
                console.error('[TAREAS] Error al cargar tareas:', error);
                if (activo) setTareas([]);
            }
        };

        cargarTareas();
        return () => { activo = false; };
    }, [proyecto?.id]);

    const agregarTarea = async (nuevaTarea) => {
        try {
            console.log('[TAREAS] Creando tarea:', nuevaTarea);
            const respuesta = await crearTarea({ ...nuevaTarea, proyectoId: proyecto.id });
            setTareas(prev => [...prev, respuesta.tarea]);
            console.log('[TAREAS] Tarea creada:', respuesta.tarea);
        } catch (error) {
            console.error('[TAREAS] Error al crear tarea:', error);
            alert(error.response?.data?.mensaje || error.message || 'No se pudo crear la tarea.');
        }
    };

    /* const checkTareaLocal = (id) => {
        const tareasActualizadas = tareas.map(tarea => {
            if (tarea.id === id) {
                const nuevoEstado = (tarea.estado === "ENVIADO" || tarea.estado === "REVISADO") ? "PENDIENTE" : "ENVIADO";
                const isCompletada = nuevoEstado === "ENVIADO" || nuevoEstado === "REVISADO";
                return { ...tarea, estado: nuevoEstado, check: isCompletada, estaTerminada: isCompletada };
            }
            return tarea;
        });
        setTareas(tareasActualizadas);
        const recursosActuales = usuarioActual?.proyectos?.find(p => p.id === proyecto.id)?.recursos || [];
        actualizarContenidoProyecto(proyecto.id, tareasActualizadas, recursosActuales);

        // Si la tarea que se checkea está abierta en el modal, actualizarla allí también
        if (tareaSeleccionada && tareaSeleccionada.id === id) {
            setTareaSeleccionada(prev => {
                if (!prev) return null;
                const nuevoEstado = (prev.estado === "ENVIADO" || prev.estado === "REVISADO") ? "PENDIENTE" : "ENVIADO";
                const isCompletada = nuevoEstado === "ENVIADO" || nuevoEstado === "REVISADO";
                return { ...prev, estado: nuevoEstado, check: isCompletada, estaTerminada: isCompletada };
            });
        }
    };

    };
    */

    const checkTarea = async (id) => {
        try {
            const respuesta = await cambiarEstadoTarea(id);
            const tareaActualizada = respuesta.tarea;
            setTareas(prev => prev.map(t => t.id === id ? tareaActualizada : t));
            setTareaSeleccionada(prev => prev?.id === id ? tareaActualizada : prev);
            console.log('[TAREAS] Estado actualizado:', tareaActualizada);
        } catch (error) {
            console.error('[TAREAS] Error al actualizar estado:', error);
            alert(error.response?.data?.mensaje || error.message || 'No se pudo actualizar la tarea.');
        }
    };

    const actualizarTarea = async (tareaActualizada) => {
        try {
            const respuesta = await actualizarTareaApi(tareaActualizada.id, tareaActualizada);
            setTareas(prev => prev.map(t => t.id === tareaActualizada.id ? respuesta.tarea : t));
            console.log('[TAREAS] Tarea editada:', respuesta.tarea);
        } catch (error) {
            console.error('[TAREAS] Error al editar tarea:', error);
            alert(error.response?.data?.mensaje || error.message || 'No se pudo guardar la tarea.');
            throw error;
        }
    };

    const eliminarTarea = async (idTarea) => {
        try {
            await eliminarTareaApi(idTarea);
            setTareas(prev => prev.filter(t => t.id !== idTarea));
            console.log('[TAREAS] Tarea eliminada:', idTarea);
        } catch (error) {
            console.error('[TAREAS] Error al eliminar tarea:', error);
            alert(error.response?.data?.mensaje || error.message || 'No se pudo eliminar la tarea.');
            throw error;
        }
    };

    // Helper para determinar estado calculado
    const obtenerEstadoCalculado = (tarea) => {
        const est = tarea.estado || "PENDIENTE";
        if (est === "ENVIADO") return "ENVIADO";
        if (est === "REVISADO") return "REVISADO";
        if (tarea.fechaLimite) {
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            const limite = new Date(tarea.fechaLimite + 'T00:00:00');
            if (!isNaN(limite.getTime()) && limite < hoy) {
                return "ATRASADA";
            }
        }
        return "PENDIENTE";
    };

    // Tareas Filtradas
    const tareasFiltradas = tareas.filter(tarea => {
        const matchesMiembro = filtroMiembro === "Todos" || tarea.asignado === filtroMiembro;
        const estadoCalculado = obtenerEstadoCalculado(tarea);
        const matchesEstado = filtroEstado === "Todos" || estadoCalculado === filtroEstado;
        const matchesPrioridad = filtroPrioridad === "Todos" || tarea.prioridad === filtroPrioridad;
        return matchesMiembro && matchesEstado && matchesPrioridad;
    });

    const completasCount = tareas.filter(t => t.estado === "ENVIADO" || t.estado === "REVISADO").length;

    // Estadísticas para reporte individual
    const totalTareasMiembro = tareas.filter(t => t.asignado === filtroMiembro);
    const completadasMiembro = totalTareasMiembro.filter(t => t.estado === "ENVIADO" || t.estado === "REVISADO");
    const pesoTotalMiembro = totalTareasMiembro.reduce((acc, t) => acc + (t.peso || 0), 0);
    const pesoCompletadoMiembro = completadasMiembro.reduce((acc, t) => acc + (t.peso || 0), 0);
    const progresoPonderado = pesoTotalMiembro > 0 ? Math.round((pesoCompletadoMiembro / pesoTotalMiembro) * 100) : 0;

    const getInitials = (name) => {
        if (!name) return "?";
        if (name.toLowerCase() === "todos") return "TD";
        const clean = name.split('@')[0];
        return clean.slice(0, 2).toUpperCase();
    };

    return (
        <div className="tabla-tareas">
            <div className="tabla-titulo">
                <div>
                    <h2>Tareas del Proyecto</h2>
                    <div className="pendientes">
                        {tareas.length - completasCount} pendientes
                    </div>
                </div>

                {/* Alternador de Vistas */}
                <div className="vista-switcher">
                    <button
                        className={`switcher-btn ${vistaTareas === 'lista' ? 'activo' : ''}`}
                        onClick={() => setVistaTareas('lista')}
                    >
                        <ListIcon />
                        <span>Lista</span>
                    </button>
                    <button
                        className={`switcher-btn ${vistaTareas === 'cronograma' ? 'activo' : ''}`}
                        onClick={() => setVistaTareas('cronograma')}
                    >
                        <ChartIcon />
                        <span>Cronograma</span>
                    </button>
                </div>
            </div>

            {/* Barra de Filtros */}
            <div className="barra-filtros-tareas">
                <div className="filtro-grupo">
                    <label>Responsable</label>
                    <select className="selector" value={filtroMiembro} onChange={(e) => setFiltroMiembro(e.target.value)}>
                        <option value="Todos">Todos los miembros</option>
                        {miembros.map((miembro) => (
                            <option key={miembro.id} value={miembro.email}>
                                {miembro.email}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filtro-grupo">
                    <label>Estado</label>
                    <select className="selector" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                        <option value="Todos">Todos los estados</option>
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="ENVIADO">ENVIADO</option>
                        <option value="REVISADO">REVISADO</option>
                        <option value="ATRASADA">ATRASADA</option>
                    </select>
                </div>

                <div className="filtro-grupo">
                    <label>Prioridad</label>
                    <select className="selector" value={filtroPrioridad} onChange={(e) => setFiltroPrioridad(e.target.value)}>
                        <option value="Todos">Todas las prioridades</option>
                        <option value="Baja">Baja</option>
                        <option value="Media">Media</option>
                        <option value="Alta">Alta</option>
                    </select>
                </div>
            </div>

            {/* Reporte de Avance Individual */}
            {filtroMiembro !== "Todos" && (
                <div className="reporte-individual-card">
                    <div className="reporte-col-usuario">
                        <div className="reporte-avatar">{getInitials(filtroMiembro)}</div>
                        <div className="reporte-info">
                            <span className="reporte-lbl">REPORTE INDIVIDUAL</span>
                            <span className="reporte-val-email">{filtroMiembro}</span>
                        </div>
                    </div>

                    <div className="reporte-col">
                        <span className="reporte-lbl">TAREAS COMPLETAS</span>
                        <span className="reporte-val">{completadasMiembro.length} / {totalTareasMiembro.length}</span>
                    </div>

                    <div className="reporte-col">
                        <span className="reporte-lbl">VALOR PONDERADO</span>
                        <span className="reporte-val">{pesoCompletadoMiembro}% / {pesoTotalMiembro}%</span>
                    </div>

                    <div className="reporte-col progreso-col">
                        <div className="progreso-header">
                            <span className="reporte-lbl">PROGRESO PONDERADO</span>
                            <span className="progreso-pct">{progresoPonderado}%</span>
                        </div>
                        <div className="barra-progreso-bg">
                            <div className="barra-progreso-fill" style={{ width: `${progresoPonderado}%` }}></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Contenedor principal de visualización */}
            <div className="vistas-tareas-contenedor">
                {vistaTareas === 'lista' && (
                    <div className="lista-tareas">
                        {tareasFiltradas.length === 0 ? (
                            <div className="mensaje-vacio">Sin tareas creadas todavía o no coinciden con los filtros.</div>
                        ) : (
                            tareasFiltradas.map((tarea) => (
                                <ItemTarea
                                    key={tarea.id}
                                    tarea={tarea}
                                    onCheck={() => checkTarea(tarea.id)}
                                    onClick={() => setTareaSeleccionada(tarea)}
                                    onDelete={() => eliminarTarea(tarea.id)}
                                />
                            ))
                        )}
                    </div>
                )}

                {vistaTareas === 'cronograma' && (
                    <CronogramaTareas
                        tareas={tareasFiltradas}
                        onSelectTarea={setTareaSeleccionada}
                    />
                )}
            </div>

            {/* Agregar tarea visible en la parte inferior */}
            <AgregarTarea onAgregar={agregarTarea} miembros={miembros} />

            {/* Modal de Detalle de Tarea */}
            {tareaSeleccionada && (
                <ModalTarea
                    tarea={tareaSeleccionada}
                    onClose={() => setTareaSeleccionada(null)}
                    onSave={async (updated) => {
                        await actualizarTarea(updated);
                        setTareaSeleccionada(null);
                    }}
                    onDelete={async (id) => {
                        await eliminarTarea(id);
                        setTareaSeleccionada(null);
                    }}
                    miembros={miembros}
                />
            )}
        </div>
    );
};

export default TablaTareas;
