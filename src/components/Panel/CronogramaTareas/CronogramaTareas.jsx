import React from "react";
import "./CronogramaTareas.css";

const CronogramaTareas = ({ tareas = [], onSelectTarea }) => {
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
            date: d,
            diaSemana: nombresDias[d.getDay()],
            diaNumero: d.getDate(),
            mes: meses[d.getMonth()],
            isoString: d.toISOString().split('T')[0]
        });
    }

    // Calcular la posición y span en la cuadrícula CSS Grid
    const obtenerColumnaRango = (fechaLimiteStr, check) => {
        if (!fechaLimiteStr) return null;
        
        const limite = new Date(fechaLimiteStr + 'T00:00:00');
        if (isNaN(limite.getTime())) return null;
        
        const hoyMs = hoy.getTime();
        const limiteMs = limite.getTime();
        
        // Calcular la diferencia exacta en días
        const diffTime = limiteMs - hoyMs;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (check) {
            // Completadas
            if (diffDays < 0) return { start: 2, span: 1, tipo: "completada-atrasada" };
            const span = Math.min(diffDays + 1, 14);
            return { start: 2, span, tipo: "completada" };
        }

        if (diffDays < 0) {
            // Atrasada (vencida)
            return { start: 2, span: 1, tipo: "atrasada" };
        } else if (diffDays >= 14) {
            // Fuera de rango hacia adelante
            return { start: 2, span: 14, tipo: "fuera-rango" };
        } else {
            // Activa en el cronograma
            return { start: 2, span: diffDays + 1, tipo: "activa" };
        }
    };

    // Separar tareas con fecha y sin fecha
    const tareasConFecha = tareas.filter(t => t.fechaLimite);
    const tareasSinFecha = tareas.filter(t => !t.fechaLimite);

    const formatFecha = (dateStr) => {
        if (!dateStr) return "";
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        return `${date.getDate()} ${meses[date.getMonth()]}`;
    };

    return (
        <div className="cronograma-contenedor">
            <div className="cronograma-gantt-scroll">
                <div className="cronograma-gantt-grid">
                    {/* Fila del Encabezado */}
                    <div className="gantt-row header-row">
                        <div className="gantt-col-titulo">Tareas Planificadas</div>
                        {dias.map((dia, idx) => (
                            <div 
                                key={dia.isoString} 
                                className={`gantt-col-dia ${idx === 0 ? 'dia-hoy' : ''}`}
                            >
                                <span className="dia-semana">{dia.diaSemana}</span>
                                <span className="dia-numero">{dia.diaNumero}</span>
                                <span className="dia-mes">{dia.mes}</span>
                            </div>
                        ))}
                    </div>

                    {/* Líneas de fondo del grid de calendario */}
                    {tareasConFecha.length === 0 ? (
                        <div className="gantt-empty-state">
                            No hay tareas con fecha programada. Asigna una fecha límite para visualizarlas aquí.
                        </div>
                    ) : (
                        tareasConFecha.map(tarea => {
                            const rango = obtenerColumnaRango(tarea.fechaLimite, tarea.check);
                            const prioridad = tarea.prioridad || "Media";
                            
                            return (
                                <div key={tarea.id} className="gantt-row body-row" onClick={() => onSelectTarea(tarea)}>
                                    <div className="gantt-col-titulo flex-titulo">
                                        <span className="gantt-task-name" title={tarea.titulo}>{tarea.titulo}</span>
                                        <span className="gantt-task-assignee">{tarea.asignado || "Todos"}</span>
                                    </div>
                                    
                                    {/* Fondo de celdas */}
                                    {dias.map((_, idx) => (
                                        <div key={idx} className="gantt-cell-bg"></div>
                                    ))}

                                    {/* Barra del Cronograma */}
                                    {rango && (
                                        <div 
                                            className={`gantt-bar barra-${rango.tipo} prioridad-gantt-${prioridad.toLowerCase()}`}
                                            style={{
                                                gridColumnStart: rango.start,
                                                gridColumnEnd: rango.start + rango.span
                                            }}
                                            title={`${tarea.titulo} - Vence: ${formatFecha(tarea.fechaLimite)} (${prioridad})`}
                                        >
                                            <span className="barra-texto">
                                                {tarea.check ? "✓ " : ""}
                                                {tarea.titulo}
                                                {rango.tipo === "atrasada" ? " (Atrasada)" : ""}
                                                {rango.tipo === "fuera-rango" ? " →" : ""}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Listado de tareas sin fecha */}
            <div className="cronograma-sin-fecha-seccion">
                <h3>Tareas sin fecha definida</h3>
                {tareasSinFecha.length === 0 ? (
                    <p className="sin-tareas-mensaje">Todas las tareas tienen fecha de entrega asignada.</p>
                ) : (
                    <div className="cronograma-sin-fecha-lista">
                        {tareasSinFecha.map(tarea => (
                            <div 
                                key={tarea.id} 
                                className="cronograma-sin-fecha-item"
                                onClick={() => onSelectTarea(tarea)}
                            >
                                <div className="sin-fecha-info">
                                    <span className={`sin-fecha-prioridad prioridad-${(tarea.prioridad || "Media").toLowerCase()}`}>
                                        {tarea.prioridad || "Media"}
                                    </span>
                                    <span className="sin-fecha-titulo">{tarea.titulo}</span>
                                </div>
                                <span className="sin-fecha-responsable">{tarea.asignado || "Todos"}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CronogramaTareas;
