import React from "react";
import "./GrupoCreado.css";
import { GraduationIcon, BookIcon, ArrowRightIcon, UserIcon, CalendarIcon, CodeIcon, DesignIcon } from "../Icons/Icons";

const GrupoCreado = ({ proyecto, onSelectProyecto }) => {
    const getIcon = (type) => {
        switch (type) {
            case "code":
                return <CodeIcon />;
            case "design":
                return <DesignIcon />;
            case "education":
            default:
                return <GraduationIcon />;
        }
    };

    const totalTareas = proyecto.tareas ? proyecto.tareas.length : (proyecto.tasksTotal || 0);
    const tareasCompletadas = proyecto.tareas ? proyecto.tareas.filter(t => t.check).length : (proyecto.tasksCompleted || 0);
    const progreso = totalTareas > 0 ? Math.round((tareasCompletadas / totalTareas) * 100) : (proyecto.progress || 0);

    return (
        <div className="proyecto-card">
            <div className="proyecto-card-header">
                <div className="proyecto-icon-wrapper">
                    {getIcon(proyecto.iconType)}
                </div>
                <button
                    onClick={() => onSelectProyecto && onSelectProyecto(proyecto)}
                    className="ver-workspace-btn"
                >
                    <span>WORKSPACE</span>
                    <ArrowRightIcon />
                </button>
            </div>

            <h2 className="proyecto-card-titulo">{proyecto.title}</h2>

            <div className="proyecto-tag-badge">
                <BookIcon />
                <span>{proyecto.tag}</span>
            </div>

            <p className="proyecto-card-desc">{proyecto.description}</p>

            <div className="proyecto-logros-seccion">
                <div className="logros-labels">
                    <span className="logros-titulo">Tareas completadas</span>
                    <span className="logros-valor">
                        {progreso}% ({tareasCompletadas}/{totalTareas})
                    </span>
                </div>
                <div className="progreso-barra-track">
                    <div
                        className="progreso-barra-fill"
                        style={{ width: `${progreso}%` }}
                    ></div>
                </div>
            </div>

            <div className="proyecto-card-divider"></div>

            <footer>
                <div className="footer-miembros">
                    <UserIcon />
                    <span>
                        {proyecto.membersCount} {proyecto.membersCount === 1 ? "Miembro" : "Miembros"}
                    </span>
                </div>
                <div className="footer-fechas">
                    <CalendarIcon />
                    <span>
                        {proyecto.startDate} - {proyecto.endDate}
                    </span>
                </div>
            </footer>
        </div>
    );
};

export default GrupoCreado;
