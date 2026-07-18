import { useState, useEffect } from "react";
import ItemTarea from "./ItemTarea";
import AgregarTarea from "./AgregarTarea";
import ModalTarea from "./ModalTarea";
import CronogramaTareas from "../CronogramaTareas/CronogramaTareas";
import { useAuth } from "../../../context/AuthContext";
import { ListIcon, ChartIcon } from "../EspacioTrabajo/Icons/Icons";

import "./TablaTareas.css";

const TablaTareas = ({ proyecto, miembros = [] }) => {
    const { usuarioActual, actualizarContenidoProyecto } = useAuth();
    const [tareas, setTareas] = useState(proyecto?.tareas || []);
    const [vistaTareas, setVistaTareas] = useState("lista"); // "lista" | "cronograma"
    const [tareaSeleccionada, setTareaSeleccionada] = useState(null);

    // Filtros
    const [filtroMiembro, setFiltroMiembro] = useState("Todos");
    const [filtroEstado, setFiltroEstado] = useState("Todos");
    const [filtroPrioridad, setFiltroPrioridad] = useState("Todos");

    // Sincronizar el estado de tareas cuando el proyecto cambia (ej. recargas)
    useEffect(() => {
        setTareas(proyecto?.tareas || []);
    }, [proyecto]);

    const agregarTarea = async (nuevaTarea) => {
        const tareasActualizadas = [...tareas, nuevaTarea];
        setTareas(tareasActualizadas);
        const recursosActuales = usuarioActual?.proyectos?.find(p => p.id === proyecto.id)?.recursos || [];
        await actualizarContenidoProyecto(proyecto.id, tareasActualizadas, recursosActuales);
    };

    const checkTarea = async (id) => {
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
        await actualizarContenidoProyecto(proyecto.id, tareasActualizadas, recursosActuales);

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

    const actualizarTarea = async (tareaActualizada) => {
        const tareasActualizadas = tareas.map(t => t.id === tareaActualizada.id ? tareaActualizada : t);
        setTareas(tareasActualizadas);
        const recursosActuales = usuarioActual?.proyectos?.find(p => p.id === proyecto.id)?.recursos || [];
        await actualizarContenidoProyecto(proyecto.id, tareasActualizadas, recursosActuales);
    };

    const eliminarTarea = async (idTarea) => {
        const tareasActualizadas = tareas.filter(t => t.id !== idTarea);
        setTareas(tareasActualizadas);
        const recursosActuales = usuarioActual?.proyectos?.find(p => p.id === proyecto.id)?.recursos || [];
        await actualizarContenidoProyecto(proyecto.id, tareasActualizadas, recursosActuales);
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
                    onSave={(updated) => {
                        actualizarTarea(updated);
                        setTareaSeleccionada(null);
                    }}
                    onDelete={(id) => {
                        eliminarTarea(id);
                        setTareaSeleccionada(null);
                    }}
                    miembros={miembros}
                />
            )}
        </div>
    );
};

export default TablaTareas;
