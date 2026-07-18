import React from "react";
import "./VencimientoTareas.css";
import { ArrowRightSmallIcon } from "../Icons/Icons";

// Icono de Alerta / Advertencia (Triángulo con signo de exclamación)
const AlertIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

const VencimientoTareas = ({ proyectos = [], onSelectProyecto }) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const en3Dias = new Date(hoy);
    en3Dias.setDate(en3Dias.getDate() + 3);

    // Filtrar tareas que vencen en los próximos 3 días (o que ya vencieron hoy/atrasadas) y no están enviadas o revisadas
    const tareasUrgentes = proyectos.flatMap(p =>
        (p.tareas || []).filter(t => {
            if (!t.fechaLimite) return false;
            if (t.estado === 'ENVIADO' || t.estado === 'REVISADO') return false;
            const limite = new Date(t.fechaLimite + 'T00:00:00');
            return !isNaN(limite.getTime()) && limite >= hoy && limite <= en3Dias;
        }).map(t => ({ ...t, proyectoTitle: p.title, proyectoId: p.id, proyectoObj: p }))
    );

    if (tareasUrgentes.length === 0) return null;

    return (
        <div className="alertas-urgentes-wrapper">
            {tareasUrgentes.map(t => {
                const limite = new Date(t.fechaLimite + 'T00:00:00');
                const diasRestantes = Math.round((limite - hoy) / (1000 * 60 * 60 * 24));
                const etiquetaDias = diasRestantes === 0
                    ? 'HOY'
                    : diasRestantes === 1
                        ? 'MAÑANA'
                        : `EN ${diasRestantes} DÍAS`;
                return (
                    <div key={t.id} className="alerta-urgente-card" onClick={() => onSelectProyecto && onSelectProyecto(t.proyectoObj)}>
                        <div className="alerta-borde-izq" />
                        <div className="alerta-icono">
                            <AlertIcon size={20} />
                        </div>
                        <div className="alerta-cuerpo">
                            <div className="alerta-meta">
                                <span className="alerta-tag">PRÓXIMA ENTREGA ACADÉMICA</span>
                                <span className="alerta-dias-badge">{etiquetaDias}</span>
                            </div>
                            <p className="alerta-titulo">{t.titulo}</p>
                            <div className="alerta-sub">
                                <span className="alerta-proyecto">📁 {t.proyectoTitle}</span>
                                {t.prioridad === 'Alta' && (
                                    <span className="alerta-prioridad-alta">ALTA PRIORIDAD</span>
                                )}
                            </div>
                        </div>
                        <button className="alerta-ir-btn">
                            <span>IR AL ESPACIO</span>
                            <ArrowRightSmallIcon size={14} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default VencimientoTareas;
