import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './GestionUsuarios.css';

/* Modal local para cambiar contraseña */
const ModalCambiarContrasena = ({ usuario, onCerrar, onGuardar }) => {
    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [confirmar, setConfirmar] = useState('');
    const [errorModal, setErrorModal] = useState('');
    const [procesando, setProcesando] = useState(false);

    const handleGuardar = async () => {
        if (!nuevaContrasena || !confirmar) {
            setErrorModal('Completa ambos campos.');
            return;
        }
        if (nuevaContrasena.length < 6) {
            setErrorModal('La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        if (nuevaContrasena !== confirmar) {
            setErrorModal('Las contraseñas no coinciden.');
            return;
        }
        
        setProcesando(true);
        await new Promise(r => setTimeout(r, 200));
        onGuardar(usuario.id, nuevaContrasena);
        setProcesando(false);
        onCerrar();
    };

    return (
        <div className="modal-overlay" onClick={onCerrar}>
            <div className="modal-contenido" onClick={e => e.stopPropagation()}>
                <h2 className="modal-titulo">Cambiar Contraseña</h2>
                <p className="modal-subtitulo">
                    Usuario: <strong style={{ color: '#ffffff' }}>{usuario.nombre} {usuario.apellido}</strong>
                </p>

                {errorModal && <div className="modal-mensaje-error">{errorModal}</div>}

                <div className="modal-campo">
                    <label htmlFor="nueva-contrasena-admin">Nueva contraseña</label>
                    <input
                        id="nueva-contrasena-admin"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={nuevaContrasena}
                        onChange={e => { setNuevaContrasena(e.target.value); setErrorModal(''); }}
                    />
                </div>

                <div className="modal-campo">
                    <label htmlFor="confirmar-nueva-contrasena-admin">Confirmar contraseña</label>
                    <input
                        id="confirmar-nueva-contrasena-admin"
                        type="password"
                        placeholder="Repite la nueva contraseña"
                        value={confirmar}
                        onChange={e => { setConfirmar(e.target.value); setErrorModal(''); }}
                    />
                </div>

                <div className="modal-acciones">
                    <button className="boton-cancelar-modal" onClick={onCerrar} id="boton-cancelar-modal-pass" disabled={procesando}>
                        Cancelar
                    </button>
                    <button className="boton-guardar-modal" onClick={handleGuardar} id="boton-guardar-nueva-pass" disabled={procesando}>
                        {procesando ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* Componente principal */
const GestionUsuarios = () => {
    const { adminActual, cerrarSesionAdmin, obtenerUsuarios, toggleEstadoUsuario, cambiarContrasenaUsuario } = useAuth();
    const navegar = useNavigate();

    const [contador, setContador] = useState(0);
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    useEffect(() => {
        obtenerUsuarios().then(lista => setUsuarios(lista || []));
    }, [contador]);

    const handleCerrarSesion = () => {
        cerrarSesionAdmin();
        navegar('/admin/login');
    };

    const handleToggleEstado = async (idUsuario) => {
        await toggleEstadoUsuario(idUsuario);
        setContador(c => c + 1);
    };

    const handleCambiarContrasena = async (idUsuario, nuevaContrasena) => {
        await cambiarContrasenaUsuario(idUsuario, nuevaContrasena);
        setContador(c => c + 1);
    };

    const totalUsuarios = usuarios.length;
    const usuariosActivos = usuarios.filter(u => u.activo).length;
    const usuariosInactivos = totalUsuarios - usuariosActivos;

    return (
        <div className="gestion-pagina">
            <div className="gestion-header">
                <div className="gestion-header-texto">
                    <h1>Gestión de Usuarios</h1>
                    <p>Administra los usuarios registrados en TeamSync (Modo Local)</p>
                </div>
                <div className="gestion-acciones-header">
                    <div className="badge-admin">
                        <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', fill: 'none', stroke: 'currentColor', strokeWidth: '2' }}>
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        {adminActual?.nombre || 'Administrador'}
                    </div>
                    <button
                        id="boton-cerrar-sesion-admin"
                        className="boton-cerrar-sesion-admin"
                        onClick={handleCerrarSesion}
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>

            <hr className="gestion-divider" />

            <div className="gestion-stats">
                <div className="stat-card">
                    <div className="stat-valor">{totalUsuarios}</div>
                    <div className="stat-etiqueta">Usuarios registrados</div>
                </div>
                <div className="stat-card stat-activos">
                    <div className="stat-valor">{usuariosActivos}</div>
                    <div className="stat-etiqueta">Usuarios activos</div>
                </div>
                <div className="stat-card stat-inactivos">
                    <div className="stat-valor">{usuariosInactivos}</div>
                    <div className="stat-etiqueta">Usuarios inactivos</div>
                </div>
            </div>

            <div className="tabla-contenedor">
                <div className="tabla-header-barra">
                    <h2>Lista de usuarios</h2>
                </div>

                {usuarios.length === 0 ? (
                    <div className="tabla-vacia">
                        <p>No hay usuarios registrados aún.</p>
                    </div>
                ) : (
                    <table className="tabla-usuarios">
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Fecha de registro</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map(usuario => {
                                const iniciales = `${usuario.nombre?.[0] ?? ''}${usuario.apellido?.[0] ?? ''}`.toUpperCase();
                                return (
                                    <tr key={usuario.id}>
                                        <td>
                                            <div className="usuario-nombre-celda">
                                                <div className="mini-avatar">{iniciales}</div>
                                                <div>
                                                    <div className="nombre-completo">
                                                        {usuario.nombre} {usuario.apellido}
                                                    </div>
                                                    <div className="email-usuario">{usuario.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{usuario.fechaRegistro || 'N/A'}</td>
                                        <td>
                                            <span className={`badge-estado ${usuario.activo ? 'badge-activo' : 'badge-inactivo'}`}>
                                                {usuario.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="celda-acciones">
                                                <button
                                                    id={`boton-toggle-estado-${usuario.id}`}
                                                    className={`boton-accion ${usuario.activo ? 'boton-desactivar' : 'boton-activar'}`}
                                                    onClick={() => handleToggleEstado(usuario.id)}
                                                >
                                                    {usuario.activo ? 'Desactivar' : 'Activar'}
                                                </button>
                                                <button
                                                    id={`boton-cambiar-pass-${usuario.id}`}
                                                    className="boton-accion boton-cambiar-pass"
                                                    onClick={() => setUsuarioSeleccionado(usuario)}
                                                >
                                                    Cambiar contraseña
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {usuarioSeleccionado && (
                <ModalCambiarContrasena
                    usuario={usuarioSeleccionado}
                    onCerrar={() => setUsuarioSeleccionado(null)}
                    onGuardar={handleCambiarContrasena}
                />
            )}
        </div>
    );
};

export default GestionUsuarios;