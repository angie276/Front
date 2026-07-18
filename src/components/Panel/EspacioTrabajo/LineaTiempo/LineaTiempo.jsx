import React from "react";
import "./LineaTiempo.css";

const LineaTiempo = ({ proyectos = [], onSelectProyecto }) => {
    // ==========================================
    // DATOS CONSOLIDADOS (TODAS LAS TAREAS)
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

    const formatFecha = (dateStr) => {
        if (!dateStr) return "";
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
        return `${date.getDate()} ${months[date.getMonth()]}`;
    };

    // Generar los próximos 14 días desde hoy
    const dias = [];
    const nombresDias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    for (let i = 0; i < 14; i++) {
        const d = new Date(hoy);
        d.setDate(hoy.getDate() + i);
        dias.push({
            diaSemana: nombresDias[d.getDay()],
            diaNumero: d.getDate(),
            mes: meses[d.getMonth()],
            isoString: d.toISOString().split('T')[0]
        });
    }

    const obtenerColumnaGantt = (fechaLimiteStr) => {
        if (!fechaLimiteStr) return null;
        const limite = new Date(fechaLimiteStr + 'T00:00:00');
        if (isNaN(limite.getTime())) return null;
        const diffDays = Math.floor((limite.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return { start: 2, span: 1, tipo: "atrasada" };
        if (diffDays >= 14) return { start: 2, span: 14, tipo: "fuera-rango" };
        return { start: 2, span: diffDays + 1, tipo: "activa" };
    };

    const tareasConFecha = todasLasTareas.filter(t => t.fechaLimite);

    return (
        <div className="workspace-tab-content">
            <div className="workspace-section-header">
                <h3>Línea del Tiempo Integrada</h3>
                <p>Cronograma general de 14 días con los hitos programados en todos tus espacios.</p>
            </div>
            
            <div className="cronograma-gantt-scroll">
                <div className="cronograma-gantt-grid">
                    <div className="gantt-row header-row">
                        <div className="gantt-col-titulo">Hito / Curso</div>
                        {dias.map((dia, idx) => (
                            <div key={idx} className={`gantt-col-dia ${idx === 0 ? 'dia-hoy' : ''}`}>
                                <span className="dia-semana">{dia.diaSemana}</span>
                                <span className="dia-numero">{dia.diaNumero}</span>
                                <span className="dia-mes">{dia.mes}</span>
                            </div>
                        ))}
                    </div>

                    {tareasConFecha.length === 0 ? (
                        <div className="gantt-empty-state">No hay tareas programadas con fecha límite en los próximos 14 días.</div>
                    ) : (
                        tareasConFecha.map(tarea => {
                            const rango = obtenerColumnaGantt(tarea.fechaLimite);
                            const prioridad = tarea.prioridad || "Media";
                            const proyecto = proyectos.find(p => p.id === tarea.proyectoId);
                            
                            return (
                                <div 
                                    key={tarea.id} 
                                    className="gantt-row body-row"
                                    onClick={() => proyecto && onSelectProyecto(proyecto)}
                                >
                                    <div className="gantt-col-titulo flex-titulo">
                                        <span className="gantt-task-name" title={tarea.titulo}>{tarea.titulo}</span>
                                        <span className="gantt-task-assignee">{tarea.proyectoTag} • {tarea.asignado}</span>
                                    </div>
                                    {dias.map((_, idx) => (
                                        <div key={idx} className="gantt-cell-bg"></div>
                                    ))}
                                    {rango && (
                                        <div 
                                            className={`gantt-bar barra-${tarea.check ? 'completada' : rango.tipo} prioridad-gantt-${prioridad.toLowerCase()}`}
                                            style={{
                                                gridColumnStart: rango.start,
                                                gridColumnEnd: rango.start + rango.span
                                            }}
                                            title={`${tarea.titulo} - Vence: ${formatFecha(tarea.fechaLimite)} (${prioridad})`}
                                        >
                                            <span className="barra-texto">
                                                {tarea.check ? "✓ " : ""}
                                                {tarea.titulo}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default LineaTiempo;
