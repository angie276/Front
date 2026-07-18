import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
    const { iniciarSesionAdmin } = useAuth();
    const navegar = useNavigate();

    const [datosFormulario, setDatosFormulario] = useState({
        email: '',
        password: ''
    });
    const [errorMensaje, setErrorMensaje] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleCambio = (e) => {
        setDatosFormulario({ ...datosFormulario, [e.target.name]: e.target.value });
        setErrorMensaje('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!datosFormulario.email || !datosFormulario.password) {
            setErrorMensaje('Por favor completa todos los campos.');
            return;
        }
 
        setCargando(true);
        // Pausa de asincronía para estabilizar el estado de carga en React
        await new Promise(r => setTimeout(r, 300));
        
        const resultado = iniciarSesionAdmin(datosFormulario.email, datosFormulario.password);
        setCargando(false);

        if (resultado.exito) {
            navegar('/admin/usuarios');
        } else {
            setErrorMensaje(resultado.mensaje || 'Credenciales de administrador incorrectas.');
        }
    };

    return (
        <div className="admin-login-pagina">
            <div className="admin-login-card">
                <div className="admin-login-logo">
                    <h1>TeamSync</h1>
                    <span>Panel de Administración</span>
                </div>

                <hr className="admin-login-separador" />

                <p className="admin-login-titulo-form">Acceso Administrativo</p>

                <form className="admin-login-formulario" onSubmit={handleSubmit} id="formulario-admin-login">
                    {errorMensaje && (
                        <div className="mensaje-error" role="alert">
                            {errorMensaje}
                        </div>
                    )}

                    <div className="campo-formulario">
                        <label htmlFor="email-admin-login">Correo electrónico</label>
                        <input
                            id="email-admin-login"
                            type="email"
                            name="email"
                            placeholder="admin@teamsync.com"
                            value={datosFormulario.email}
                            onChange={handleCambio}
                            className={errorMensaje ? 'campo-error' : ''}
                        />
                    </div>

                    <div className="campo-formulario">
                        <label htmlFor="password-admin-login">Contraseña</label>
                        <input
                            id="password-admin-login"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={datosFormulario.password}
                            onChange={handleCambio}
                            className={errorMensaje ? 'campo-error' : ''}
                        />
                    </div>

                    <button
                        id="boton-iniciar-sesion-admin"
                        type="submit"
                        className="boton-principal admin"
                        disabled={cargando}
                    >
                        {cargando ? 'Verificando...' : 'Ingresar al Panel'}
                    </button>
                </form>

                <div className="admin-login-enlaces">
                    <Link to="/login" className="enlace-accion" id="volver-login-usuario">
                        ← Volver al inicio de sesión de usuarios
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;