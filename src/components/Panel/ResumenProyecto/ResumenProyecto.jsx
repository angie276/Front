import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import "./ResumenProyecto.css"

const ResumenProyecto = ({
    setPestanaActiva,
    proyecto,
    tareas = [],
    tareasCompletas = [],
    onVolver,
    usuarioActual,
    miembros = []
}) => {
    const { eliminarGrupo, salirDeGrupo, quitarMiembro } = useAuth();

    const title = proyecto ? proyecto.title : "Nombre Proyecto";
    const total = tareas.length;
    const completas = tareasCompletas.length;
    const porcentaje = total > 0 ? Math.round((completas / total) * 100) : 0;
    const alumnosCount = proyecto ? (proyecto.membersCount || 1) : 1;

    const [copiado, setCopiado] = useState(false);
    const [mostrarModal, setMostrarModal] = useState(false);          // modal eliminar/salir
    const [mostrarGestionar, setMostrarGestionar] = useState(false);  // modal gestionar miembros
    const [miembroAQuitar, setMiembroAQuitar] = useState(null);       // confirmación quitar

    // Creador: tiene creadorId que coincide, o si no hay creadorId se trata como miembro
    const esCreador = !!(usuarioActual && String(proyecto?.creadorId) === String(usuarioActual.id));

    const copiarCodigo = () => {
        if (!proyecto?.codigo) return;
        navigator.clipboard.writeText(proyecto.codigo);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
    };

    // Confirmar eliminar/salir del grupo
    const handleConfirmar = async () => {
        if (esCreador) {
            await eliminarGrupo(proyecto.id);
        } else {
            salirDeGrupo(proyecto.id);
        }
        setMostrarModal(false);
        onVolver && onVolver();
    };

    // Confirmar quitar un miembro específico
    const handleConfirmarQuitar = () => {
        if (!miembroAQuitar) return;
        quitarMiembro(proyecto.id, miembroAQuitar.userId);
        setMiembroAQuitar(null);
    };

    // Miembros que el creador puede expulsar (todos menos él mismo)
    const miembrosExpulsables = miembros.filter(m => String(m.userId) !== String(usuarioActual?.id));

    return (
        <>
            <div className="resumen-premium-card">
                {/* Sección Izquierda */}
                <div className="resumen-premium-izquierda">
                    <div className="academia-badge">
                        <span>COLABORACIÓN EN EQUIPO</span>
                    </div>
                    <h3 className="resumen-premium-titulo">{title}</h3>

                    {proyecto && (
                        <div className="resumen-codigo-contenedor">
                            <span className="resumen-codigo-label">CÓDIGO DE GRUPO:</span>
                            <div className="resumen-codigo-badge-wrapper" onClick={copiarCodigo} title="Copiar código al portapapeles">
                                <span className="resumen-codigo-valor">{proyecto.codigo || 'GENERANDO...'}</span>
                                <button className="resumen-codigo-copiar-btn">
                                    {copiado ? (
                                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                                        </svg>
                                    )}
                                </button>
                                {copiado && <span className="resumen-copiado-tooltip">¡Copiado!</span>}
                            </div>
                        </div>
                    )}

                    {/* Botones de acción */}
                    <div className="resumen-acciones-fila">
                        {/* Gestionar miembros (solo creador) */}
                        {esCreador && (
                            <button
                                className="resumen-btn-accion btn-gestionar"
                                onClick={() => setMostrarGestionar(true)}
                                title="Gestionar miembros del grupo"
                            >
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                                </svg>
                                Miembros
                            </button>
                        )}

                        {/* Eliminar grupo (creador) / Salir del grupo (miembro) */}
                        <button
                            className={`resumen-btn-accion ${esCreador ? 'btn-eliminar' : 'btn-salir'}`}
                            onClick={() => setMostrarModal(true)}
                            title={esCreador ? 'Eliminar grupo para todos' : 'Salir del grupo'}
                        >
                            {esCreador ? (
                                <>
                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                    </svg>
                                    Eliminar Grupo
                                </>
                            ) : (
                                <>
                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                                    </svg>
                                    Salir del Grupo
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Sección Derecha */}
                <div className="resumen-premium-derecha">
                    <div className="logros-card">
                        <div className="logros-header">
                            <span>LOGROS DEL WORKSPACE</span>
                            <span className="logros-porcentaje">{porcentaje}%</span>
                        </div>
                        <div className="logros-barra-progreso">
                            <div className="logros-progreso-llenado" style={{ width: `${porcentaje}%` }}></div>
                        </div>

                        <div className="logros-metricas-grid">
                            <div className="logros-metrica-caja">
                                <h4>{completas} / {total}</h4>
                                <p>ACABADAS</p>
                            </div>
                            <div className="logros-metrica-caja">
                                <h4>{alumnosCount}</h4>
                                <p>ALUMNOS</p>
                            </div>
                        </div>

                        <button className="boton-ir-dashboard" onClick={() => setPestanaActiva('dashboard')}>
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginRight: '6px' }}>
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z" />
                            </svg>
                            <span>IR A DASHBOARD</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Modal Eliminar / Salir ── */}
            {mostrarModal && (
                <div className="resumen-modal-overlay" onClick={() => setMostrarModal(false)}>
                    <div className="resumen-modal-contenido" onClick={e => e.stopPropagation()}>
                        <div className={`resumen-modal-icono ${esCreador ? 'icono-eliminar' : 'icono-salir'}`}>
                            {esCreador ? (
                                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                                </svg>
                            )}
                        </div>
                        <h3 className="resumen-modal-titulo">
                            {esCreador ? '¿Eliminar este grupo?' : '¿Salir de este grupo?'}
                        </h3>
                        <p className="resumen-modal-texto">
                            {esCreador
                                ? `El grupo "${title}" y todas sus tareas serán eliminados permanentemente para todos los miembros. Esta acción no se puede deshacer.`
                                : `Dejarás de tener acceso al grupo "${title}". Podrías volver a unirte con el código de invitación.`
                            }
                        </p>
                        <div className="resumen-modal-botones">
                            <button className="resumen-modal-cancelar" onClick={() => setMostrarModal(false)}>
                                Cancelar
                            </button>
                            <button
                                className={`resumen-modal-confirmar ${esCreador ? 'confirmar-eliminar' : 'confirmar-salir'}`}
                                onClick={handleConfirmar}
                            >
                                {esCreador ? 'Sí, eliminar' : 'Sí, salir'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Modal Gestionar Miembros ── */}
            {mostrarGestionar && (
                <div className="resumen-modal-overlay" onClick={() => { setMostrarGestionar(false); setMiembroAQuitar(null); }}>
                    <div className="resumen-modal-contenido resumen-modal-gestionar" onClick={e => e.stopPropagation()}>
                        <div className="resumen-modal-icono icono-gestionar">
                            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                            </svg>
                        </div>

                        <h3 className="resumen-modal-titulo">Gestionar Miembros</h3>
                        <p className="resumen-modal-texto">
                            {miembros.length} {miembros.length === 1 ? 'miembro' : 'miembros'} en este grupo
                        </p>

                        <div className="resumen-lista-miembros">
                            {miembros.map(m => {
                                const esMismoCreadorm = String(m.userId) === String(usuarioActual?.id);
                                const estaEnConfirmacion = miembroAQuitar && String(miembroAQuitar.userId) === String(m.userId);

                                return (
                                    <div key={m.userId || m.id} className="resumen-miembro-fila">
                                        <div className="resumen-miembro-avatar">
                                            {(m.nombre?.[0] || m.email?.[0] || '?').toUpperCase()}
                                        </div>
                                        <div className="resumen-miembro-info">
                                            <span className="resumen-miembro-nombre">
                                                {m.nombre && m.apellido ? `${m.nombre} ${m.apellido}` : m.email}
                                                {esMismoCreadorm && (
                                                    <span className="resumen-badge-creador">Tú (Creador)</span>
                                                )}
                                            </span>
                                            <span className="resumen-miembro-email">{m.email}</span>
                                        </div>

                                        {!esMismoCreadorm && (
                                            estaEnConfirmacion ? (
                                                <div className="resumen-confirmar-quitar">
                                                    <span>¿Quitar?</span>
                                                    <button className="btn-quitar-si" onClick={handleConfirmarQuitar}>Sí</button>
                                                    <button className="btn-quitar-no" onClick={() => setMiembroAQuitar(null)}>No</button>
                                                </div>
                                            ) : (
                                                <button
                                                    className="resumen-btn-quitar-miembro"
                                                    onClick={() => setMiembroAQuitar(m)}
                                                    title={`Quitar a ${m.nombre || m.email}`}
                                                >
                                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                                    </svg>
                                                    Quitar
                                                </button>
                                            )
                                        )}
                                    </div>
                                );
                            })}

                            {miembrosExpulsables.length === 0 && (
                                <p className="resumen-sin-miembros">No hay otros miembros en este grupo aún.</p>
                            )}
                        </div>

                        <button
                            className="resumen-modal-cancelar"
                            style={{ width: '100%', marginTop: '8px' }}
                            onClick={() => { setMostrarGestionar(false); setMiembroAQuitar(null); }}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ResumenProyecto;
