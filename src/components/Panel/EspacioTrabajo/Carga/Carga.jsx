import React from "react";
import "./Carga.css";

const Carga = ({ proyectos = [], onSelectProyecto }) => {
    // ==========================================
    // LÓGICA DE DATOS CONSOLIDADOS (TODAS LAS TAREAS)
    // ==========================================
    const todasLasTareas = [];
    proyectos.forEach(p => {
        const tareasProyecto = p.tareas || [];
        tareasProyecto.forEach(t => {
            todasLasTareas.push({
                ...t,
                proyectoId: p.id,
                proyectoTitle: p.title,
                proyectoTag: p.tag
            });
        });
    });

    const totalTareas = todasLasTareas.length;
    const tareasCompletas = todasLasTareas.filter(t => t.check).length;
    const tareasPendientes = totalTareas - tareasCompletas;
    const avanceGlobal = totalTareas > 0 ? Math.round((tareasCompletas / totalTareas) * 100) : 0;
    const frentesAbiertosCount = proyectos.length;

    return (
        <div className="workspace-tab-content">
            {/* 1. Tarjetas de métricas superiores */}
            <div className="metricas-carga-grid">
                <div className="carga-metrica-card">
                    <span>TAREAS TOTALES</span>
                    <h3>{totalTareas} Hitos</h3>
                    <p>Carga general distribuida</p>
                </div>
                <div className="carga-metrica-card">
                    <span>TAREAS TERMINADAS</span>
                    <h3 className="terminadas-text">{tareasCompletas} completas</h3>
                    <p>{avanceGlobal}% de avance global</p>
                </div>
                <div className="carga-metrica-card">
                    <span>ESPACIOS DE TRABAJO</span>
                    <h3 className="cursos-text">{frentesAbiertosCount} Cursos</h3>
                    <p>Frentes grupales abiertos</p>
                </div>
                <div className="carga-metrica-card">
                    <span>HITOS PENDIENTES</span>
                    <h3 className="pendientes-text">{tareasPendientes} Por hacer</h3>
                    <p>Requieren acción del equipo</p>
                </div>
            </div>

            {/* 2. Rendimiento por Espacios */}
            <div className="rendimiento-espacios-seccion">
                <h4 className="rendimiento-titulo">Rendimiento por Grupos</h4>

                <div className="carga-proyectos-list">
                    {proyectos.length === 0 ? (
                        <div className="gantt-empty-state">No hay espacios de trabajo registrados. Crea un proyecto para medir su rendimiento.</div>
                    ) : (
                        proyectos.map(p => {
                            const tareasProy = p.tareas || [];
                            const totalProy = tareasProy.length;
                            const completadasProy = tareasProy.filter(t => t.check).length;
                            const pendientesProy = totalProy - completadasProy;
                            const porcProy = totalProy > 0 ? Math.round((completadasProy / totalProy) * 100) : 0;

                            // Clasificar tareas del proyecto por estado
                            let atrasadas = 0;
                            let activas = 0;
                            let sinFecha = 0;
                            let completadas = 0;

                            tareasProy.forEach(t => {
                                if (t.check) {
                                    completadas++;
                                } else if (!t.fechaLimite) {
                                    sinFecha++;
                                } else {
                                    const hoy = new Date();
                                    hoy.setHours(0, 0, 0, 0);
                                    const limite = new Date(t.fechaLimite + 'T00:00:00');
                                    if (isNaN(limite.getTime())) {
                                        sinFecha++;
                                    } else if (limite < hoy) {
                                        atrasadas++;
                                    } else {
                                        activas++;
                                    }
                                }
                            });

                            const pctAtrasadas = totalProy > 0 ? (atrasadas / totalProy) * 100 : 0;
                            const pctActivas = totalProy > 0 ? (activas / totalProy) * 100 : 0;
                            const pctSinFecha = totalProy > 0 ? (sinFecha / totalProy) * 100 : 0;
                            const pctCompletadas = totalProy > 0 ? (completadas / totalProy) * 100 : 0;

                            return (
                                <div
                                    key={p.id}
                                    className="carga-proyecto-row"
                                    onClick={() => onSelectProyecto(p)}
                                >
                                    <div className="carga-row-top">
                                        <div className="carga-row-left">
                                            <div className="carga-proy-avatar">{p.title?.charAt(0).toUpperCase()}</div>
                                            <div className="carga-proy-name">
                                                <h4>{p.title}</h4>
                                                <span>Grupo: {p.tag || "GENERAL"}</span>
                                            </div>
                                        </div>
                                        <div className="carga-proy-porcentaje">
                                            <span>{porcProy}%</span>
                                        </div>
                                    </div>

                                    <div className="carga-row-grid">
                                        <div className="carga-grid-box box-hacer">
                                            <p>POR HACER</p>
                                            <h4>{pendientesProy}</h4>
                                        </div>
                                        <div className="carga-grid-box box-completo">
                                            <p>COMPLETADOS</p>
                                            <h4>{completadasProy}</h4>
                                        </div>
                                    </div>

                                    <div className="carga-row-timeline">
                                        <span className="carga-timeline-label">CARGA DE FLUJO ACADÉMICO</span>
                                        <div className="carga-timeline-segmented-bar">
                                            {pctAtrasadas > 0 && <div className="carga-seg seg-atrasada" style={{ width: `${pctAtrasadas}%` }} title={`Atrasadas: ${atrasadas}`} />}
                                            {pctActivas > 0 && <div className="carga-seg seg-activa" style={{ width: `${pctActivas}%` }} title={`Activas: ${activas}`} />}
                                            {pctSinFecha > 0 && <div className="carga-seg seg-sin-fecha" style={{ width: `${pctSinFecha}%` }} title={`Sin fecha: ${sinFecha}`} />}
                                            {pctCompletadas > 0 && <div className="carga-seg seg-completada" style={{ width: `${pctCompletadas}%` }} title={`Completadas: ${completadas}`} />}
                                        </div>
                                        <div className="carga-timeline-legend">
                                            <span><span className="legend-dot dot-atrasada"></span> TODO</span>
                                            <span><span className="legend-dot dot-activa"></span> PROGRESO</span>
                                            <span><span className="legend-dot dot-sin-fecha"></span> REVISAR</span>
                                            <span><span className="legend-dot dot-completada"></span> LISTA</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default Carga;
