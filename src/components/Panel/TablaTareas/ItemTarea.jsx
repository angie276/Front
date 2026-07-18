import "./ItemTarea.css"
import { TrashIcon } from "../EspacioTrabajo/Icons/Icons";


const getInitials = (name) => {
    if (!name) return "?";
    if (name.toLowerCase() === "todos") return "TD";
    const clean = name.split('@')[0];
    return clean.slice(0, 2).toUpperCase();
};

const getCleanName = (name) => {
    if (!name) return "Sin asignar";
    if (name.toLowerCase() === "todos") return "Asignar a todos";
    return name.split('@')[0];
};

const ItemTarea = ({ tarea, onCheck, onClick, onDelete }) => {
    const formatFecha = (dateStr) => {
        if (!dateStr) return "Sin fecha";
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
        return `${date.getDate()} ${months[date.getMonth()]}`;
    };

    const obtenerEstado = () => {
        const est = tarea.estado || "PENDIENTE";
        if (est === "ENVIADO") {
            return { label: "ENVIADO", clase: "estado-enviado" };
        }
        if (est === "REVISADO") {
            return { label: "REVISADO", clase: "estado-revisado" };
        }
        
        if (tarea.fechaLimite) {
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            const limite = new Date(tarea.fechaLimite + 'T00:00:00');
            if (!isNaN(limite.getTime()) && limite < hoy) {
                return { label: "ATRASADA", clase: "estado-atrasada" };
            }
        }
        return { label: "PENDIENTE", clase: "estado-pendiente" };
    };

    const estado = obtenerEstado();
    const prioridad = tarea.prioridad || "Media";

    const getPrioridadLabel = (p) => {
        const clean = (p || "Media").toLowerCase();
        if (clean === "alta") return "HIGH";
        if (clean === "baja") return "LOW";
        return "MEDIUM";
    };

    const isCompletada = tarea.estado === "ENVIADO" || tarea.estado === "REVISADO";

    return (
        <article className={`item ${isCompletada ? 'item-check-completada' : ''}`} onClick={onClick}>
            <button 
                className={`check-circular ${isCompletada ? 'completado' : ''}`} 
                onClick={(e) => {
                    e.stopPropagation();
                    onCheck();
                }}
            />
            <div className="item-principal">
                <p className="item-titulo">{tarea.titulo}</p>
                <div className="item-badges">
                    <span className={`badge-prioridad prioridad-${prioridad.toLowerCase()}`}>
                        {getPrioridadLabel(prioridad)}
                    </span>
                    <span className={`badge-estado ${estado.clase}`}>
                        {estado.label}
                    </span>
                    <span className="badge-peso">
                        {tarea.peso || 0}% PESO
                    </span>
                    {tarea.fechaLimite && (
                        <span className="badge-fecha">
                            📅 {formatFecha(tarea.fechaLimite)}
                        </span>
                    )}
                </div>
            </div>
            <div className="item-todo">
                <div className="asignado-pill" onClick={(e) => e.stopPropagation()}>
                    <div className="asignado-avatar">{getInitials(tarea.asignado)}</div>
                    <span className="asignado-nombre">{getCleanName(tarea.asignado)}</span>
                </div>
                <button 
                    className="btn-eliminar-item" 
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                >
                    <TrashIcon />
                </button>
            </div>
        </article>
    );
};

export default ItemTarea;
