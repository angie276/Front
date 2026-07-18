import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './Perfil.css';

const Perfil = () => {
    const { usuarioActual, cerrarSesion } = useAuth();
    const navegar = useNavigate();

    const handleCerrarSesion = () => {
        cerrarSesion();
        navegar('/login');
    };

    if (!usuarioActual) {
        navegar('/login');
        return null;
    }

    // Generar iniciales para el avatar
    const iniciales = `${usuarioActual.nombre?.[0] ?? ''}${usuarioActual.apellido?.[0] ?? ''}`.toUpperCase();

    return (
        <div className="perfil-pagina">
            <div className="perfil-barra-nav">
                <h2>TeamSync</h2>
                <Link to="/" className="boton-volver" id="boton-ir-proyectos">
                    ← Mis Proyectos
                </Link>
            </div>

            <div className="perfil-contenedor">
                {/* Tarjeta principal con avatar */}
                <div className="perfil-tarjeta-principal">
                    <div className="perfil-avatar" aria-label={`Avatar de ${usuarioActual.nombre}`}>
                        {iniciales}
                    </div>
                    <div className="perfil-nombre-container">
                        <h2>{usuarioActual.nombre} {usuarioActual.apellido}</h2>
                        <p>{usuarioActual.email}</p>
                        <span className="perfil-badge-activo">Cuenta activa</span>
                    </div>
                </div>

                {/* Información detallada */}
                <div className="perfil-tarjeta-info">
                    <h3>Información de la cuenta</h3>

                    <div className="perfil-fila-dato">
                        <span className="perfil-etiqueta">Nombre completo</span>
                        <span className="perfil-valor">{usuarioActual.nombre} {usuarioActual.apellido}</span>
                    </div>

                    <div className="perfil-fila-dato">
                        <span className="perfil-etiqueta">Correo electrónico</span>
                        <span className="perfil-valor">{usuarioActual.email}</span>
                    </div>

                    <div className="perfil-fila-dato">
                        <span className="perfil-etiqueta">Miembro desde</span>
                        <span className="perfil-valor">{usuarioActual.fechaRegistro || 'N/A'}</span>
                    </div>

                    <div className="perfil-fila-dato">
                        <span className="perfil-etiqueta">ID de usuario</span>
                        <span className="perfil-valor">#{usuarioActual.id}</span>
                    </div>
                </div>

                {/* Acciones */}
                <div className="perfil-tarjeta-acciones">
                    <button
                        id="boton-cerrar-sesion"
                        className="boton-cerrar-sesion"
                        onClick={handleCerrarSesion}
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Perfil;
