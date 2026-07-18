import React, { useEffect, useState } from "react";
import "./NotificationModal.css";
import { useAuth } from "../../../../context/AuthContext";
import { obtenerNotificacionesProyecto } from "./notificacionHelper";

const NotificationModal = ({ usuarioActual, onClose }) => {
    const { obtenerUsuarios } = useAuth();
    const [alumnos, setAlumnos] = useState([]);
    const [notificaciones, setNotificaciones] = useState([]);

    useEffect(() => {
        obtenerUsuarios().then(res => setAlumnos(res || []));
    }, []);

    useEffect(() => {
        if (!usuarioActual) return;
        const result = obtenerNotificacionesProyecto(usuarioActual, alumnos);
        setNotificaciones(result.slice(0, 15));
    }, [usuarioActual, alumnos]);

    const formatHora = (date) => {
        try {
            return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        } catch {
            return '';
        }
    };

    return (
        <div className="notification-overlay" onClick={onClose}>
            <div className="notification-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <header className="notification-header">
                    <div className="notification-header-title">
                        <div className="notification-bell-badge">
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                            </svg>
                        </div>
                        <div className="notification-title-text">
                            <h3>Centro de Notificaciones</h3>
                            <span>NOTIFICACIONES DE EQUIPO EN VIVO</span>
                        </div>
                    </div>
                    <button className="notification-close-x" onClick={onClose}>&times;</button>
                </header>

                {/* Body */}
                <div className="notification-body">
                    <h5 className="notification-body-title">ALERTAS RECIENTES</h5>
                    {notificaciones.length === 0 ? (
                        <div className="notification-empty-state">
                            <p>No tienes ninguna notificación pendiente.</p>
                        </div>
                    ) : (
                        <div className="notification-list">
                            {notificaciones.map((notif) => (
                                <div key={notif.id} className={`notification-item ${notif.tipo}`}>
                                    <span className="notif-icono">{notif.icono}</span>
                                    <div className="notif-contenido">
                                        <p className="notif-mensaje">{notif.mensaje}</p>
                                        <span className="notif-tiempo">{formatHora(notif.fecha)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <footer className="notification-footer">
                    <button className="notification-close-btn" onClick={onClose}>
                        Cerrar Centro
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default NotificationModal;
