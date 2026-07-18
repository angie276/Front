import React from "react";
import { Link } from "react-router-dom";
import "./SideBar.css";
import {
    IconHome,
    IconCalendar,
    IconBell,
    IconFolder,
    IconChevronLeft,
    IconChevronRight,
    IconLogout,
    IconStack,
    IconTimeline,
    IconCarga,
} from "./IconsSideBar";


const Sidebar = ({
    colapsado,
    setColapsado,
    usuarioActual,
    proyectos = [],
    onSelectProyecto,
    onNavigateToProyectos,
    onNavigateToCalendario,
    onNavigateToLineaTiempo,
    onNavigateToCarga,
    onOpenNotifications,
    onLogout,
    proyectoSeleccionado,
    vista,
    tabActivo,
    countNotificaciones = 0
}) => {

    // Obtener inicial del usuario
    const inicialesUsuario = usuarioActual
        ? `${usuarioActual.nombre?.[0] ?? ''}${usuarioActual.apellido?.[0] ?? ''}`.toUpperCase()
        : 'U';

    const getProgresoProyecto = (proyecto) => {
        const tareas = proyecto.tareas || [];
        if (tareas.length === 0) return 0;
        const completadas = tareas.filter(t => t.check).length;
        return Math.round((completadas / tareas.length) * 100);
    };

    return (
        <aside className={`app-sidebar ${colapsado ? "colapsado" : "expandido"}`}>
            {/* Header del Sidebar */}
            <div className="sidebar-header">
                <div className="logo-section">
                    <div className="logo-box">
                        <IconFolder />
                    </div>
                    {!colapsado && (
                        <div className="logo-text">
                            <h3>TeamSync</h3>
                        </div>
                    )}
                </div>
                <button
                    className="toggle-sidebar-btn"
                    onClick={() => setColapsado(!colapsado)}
                    title={colapsado ? "Expandir Sidebar" : "Colapsar Sidebar"}
                >
                    {colapsado ? <IconChevronRight /> : <IconChevronLeft />}
                </button>
            </div>

            {/* Contenedor de Scroll de Items */}
            <div className="sidebar-scroll-content">
                {/* Sección de Navegación */}
                <div className="sidebar-section">
                    {!colapsado && <h5 className="section-title">Navegación</h5>}
                    <ul className="nav-list">
                        <li
                            onClick={onNavigateToProyectos}
                            className={`nav-item ${vista === 'proyectos' && tabActivo === 'proyectos' ? "activo" : ""}`}
                            title="Inicio & Proyectos"
                        >
                            <IconHome />
                            {!colapsado && <span>Inicio & Proyectos</span>}
                        </li>
                        <li
                            onClick={onNavigateToCalendario}
                            className={`nav-item ${vista === 'proyectos' && tabActivo === 'calendario' ? "activo" : ""}`}
                            title="Calendario General"
                        >
                            <IconCalendar />
                            {!colapsado && <span>Calendario General</span>}
                        </li>
                        <li
                            onClick={onNavigateToLineaTiempo}
                            className={`nav-item ${vista === 'proyectos' && tabActivo === 'linea_tiempo' ? "activo" : ""}`}
                            title="Línea del Tiempo"
                        >
                            <IconTimeline />
                            {!colapsado && <span>Línea del Tiempo</span>}
                        </li>
                        <li
                            onClick={onNavigateToCarga}
                            className={`nav-item ${vista === 'proyectos' && tabActivo === 'carga' ? "activo" : ""}`}
                            title="Carga / Workload"
                        >
                            <IconCarga />
                            {!colapsado && <span>Carga / Workload</span>}
                        </li>
                        <li
                            onClick={onOpenNotifications}
                            className="nav-item sidebar-notifications-item"
                            title="Notificaciones"
                            style={{ position: 'relative' }}
                        >
                            <IconBell />
                            {!colapsado && <span>Notificaciones</span>}
                            {countNotificaciones > 0 && (
                                <span className="notification-badge-sidebar">
                                    {countNotificaciones}
                                </span>
                            )}
                        </li>
                    </ul>
                </div>

                {/* Sección de Espacios / Proyectos */}
                <div className="sidebar-section">
                    {!colapsado ? (
                        <div className="section-title-container">
                            <h5 className="section-title">Múltiples Espacios ({proyectos.length})</h5>
                            <span className="section-badge">COURSES</span>
                        </div>
                    ) : (
                        <div className="sidebar-separator">
                            <IconStack />
                        </div>
                    )}

                    <div className="projects-list-sidebar">
                        {proyectos.map((p) => {
                            const seleccionado = proyectoSeleccionado && proyectoSeleccionado.id === p.id;
                            const inicial = p.title ? p.title.charAt(0).toUpperCase() : "P";
                            const progreso = getProgresoProyecto(p);

                            return (
                                <div
                                    key={p.id}
                                    className={`sidebar-project-card ${seleccionado ? "seleccionado" : ""}`}
                                    onClick={() => onSelectProyecto(p)}
                                    title={`${p.title} (${progreso}% completado)`}
                                >
                                    <div className="project-avatar-sidebar">
                                        {inicial}
                                    </div>
                                    {!colapsado && (
                                        <div className="project-info-sidebar">
                                            <div className="project-name-row">
                                                <h4>{p.title}</h4>
                                            </div>
                                            <p>{p.description || "Proyecto Libre"}</p>

                                            {/* Barra de progreso miniatura */}
                                            <div className="sidebar-progress-container">
                                                <div className="sidebar-progress-bar">
                                                    <div
                                                        className="sidebar-progress-fill"
                                                        style={{ width: `${progreso}%` }}
                                                    ></div>
                                                </div>
                                                <span className="sidebar-progress-text">{progreso}%</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Footer / Perfil */}
            <div className="sidebar-footer">
                {usuarioActual && (
                    <Link
                        to="/perfil"
                        className="user-profile-sidebar"
                        id="ir-perfil-sidebar"
                        title="Ver mi perfil"
                        style={{ textDecoration: "none" }}
                    >
                        <div className="user-avatar-circle">
                            {inicialesUsuario}
                        </div>
                        {!colapsado && (
                            <div className="user-info-text">
                                <h4>{usuarioActual?.nombre + " " + usuarioActual?.apellido}</h4>
                                <span>Estudiante</span>
                            </div>
                        )}
                    </Link>
                )}

                <button
                    onClick={onLogout}
                    className={`logout-sidebar-btn ${colapsado ? "btn-colapsado" : "btn-expandido"}`}
                    title="Cerrar Sesión"
                >
                    <IconLogout />
                    {!colapsado && <span>CERRAR SESIÓN</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
