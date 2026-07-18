import { createContext, useContext, useState, useEffect } from 'react';
import { getProyectosByUsuario, crearProyecto, eliminarProyecto, unirseGrupoPorCodigo as apiUnirseGrupoPorCodigo, salirDeGrupo as apiSalirDeGrupo, quitarMiembro as apiQuitarMiembro } from '../services/proyecto.service.js';
import { getTareasByProyecto, crearTarea, actualizarTarea, eliminarTarea } from '../services/tarea.service.js';
import { getRecursosByProyecto, crearRecurso, eliminarRecurso } from '../services/recurso.service.js';
import api from '../services/api.js';

const AuthContext = createContext(null);

const JWT_SECRET = 'zMxNgV1cjUcjKnSCOZykseZaoYvUVPBtYqBOTZmJW2P';

async function generateJWT(payload) {
    const header = { alg: "HS256", typ: "JWT" };
    const base64UrlEncode = (obj) => {
        const str = JSON.stringify(obj);
        const base64 = btoa(unescape(encodeURIComponent(str)));
        return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    };

    const headerEncoded = base64UrlEncode(header);
    const payloadEncoded = base64UrlEncode(payload);

    const encoder = new TextEncoder();
    const data = encoder.encode(`${headerEncoded}.${payloadEncoded}`);
    const keyData = encoder.encode(JWT_SECRET);

    const cryptoKey = await window.crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: { name: "SHA-256" } },
        false,
        ["sign"]
    );

    const signature = await window.crypto.subtle.sign(
        "HMAC",
        cryptoKey,
        data
    );

    const signatureArray = Array.from(new Uint8Array(signature));
    const signatureBase64 = btoa(String.fromCharCode.apply(null, signatureArray));
    const signatureEncoded = signatureBase64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

    return `${headerEncoded}.${payloadEncoded}.${signatureEncoded}`;
}

export const AuthProvider = ({ children }) => {
    const [usuarioActual, setUsuarioActual] = useState(null);
    const [adminActual, setAdminActual] = useState(null);
    const [cargando, setCargando] = useState(true);

    const cargarDatosDesdeBackend = async (usuario) => {
        if (!usuario) return;
        try {
            const proyectosBackend = await getProyectosByUsuario(usuario.id);
            const proyectosCompletos = await Promise.all(
                proyectosBackend.map(async (p) => {
                    const tareas = await getTareasByProyecto(p.id);
                    const recursos = await getRecursosByProyecto(p.id);
                    return {
                        ...p,
                        tareas: tareas || [],
                        recursos: recursos || []
                    };
                })
            );

            const usuarioActualizado = { ...usuario, proyectos: proyectosCompletos };
            setUsuarioActual(usuarioActualizado);
            localStorage.setItem('usuarioActual', JSON.stringify(usuarioActualizado));
        } catch (error) {
            console.error("Error cargando datos del backend:", error);
        }
    };

    // Cargar sesión guardada al iniciar
    useEffect(() => {
        const initSession = async () => {
            const sesionUsuario = localStorage.getItem('usuarioActual');
            const sesionAdmin = localStorage.getItem('adminActual');
            if (sesionUsuario) {
                const usr = JSON.parse(sesionUsuario);
                setUsuarioActual(usr);
                // Cargar datos asíncronamente
                await cargarDatosDesdeBackend(usr);
            }
            if (sesionAdmin) setAdminActual(JSON.parse(sesionAdmin));
            setCargando(false);
        };
        initSession();
    }, []);

    // Polling periódico para mantener los proyectos del usuario sincronizados con el Backend
    useEffect(() => {
        if (!usuarioActual) return;
        const interval = setInterval(() => {
            const sesionUsuario = localStorage.getItem('usuarioActual');
            if (sesionUsuario) {
                const usr = JSON.parse(sesionUsuario);
                cargarDatosDesdeBackend(usr);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [usuarioActual?.id]);

    // Obtener lista de usuarios registrados (Local)
    const obtenerUsuarios = async () => {
        try {
            const response = await api.get('/alumnos');
            return response.data.usuarios || [];
        } catch (error) {
            console.error("Error obteniendo alumnos:", error);
            const local = localStorage.getItem('usuarios');
            return local ? JSON.parse(local) : [];
        }
    };

    // Registrar nuevo usuario
    const registrarUsuario = async (datosUsuario) => {
        try {
            const response = await api.post('/api/alumnos', {
                nombre: datosUsuario.nombre,
                apellido: datosUsuario.apellido,
                email: datosUsuario.email,
                password: datosUsuario.password
            });
            return { exito: true, usuario: response.data.usuario };
        } catch (error) {
            console.error("Error registrando usuario en backend:", error);
            const msg = error.response?.data?.mensaje || 'Error al registrar el usuario.';
            return { exito: false, mensaje: msg };
        }
    };

    // Iniciar sesión usuario
    const iniciarSesion = async (email, password) => {
        const emailLimpio = email.trim().toLowerCase();
        const passwordLimpio = password.trim();
        try {
            const response = await api.post('/api/alumnos/login', {
                email: emailLimpio,
                password: passwordLimpio
            });

            const { token, usuario } = response.data;
            const sesion = {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email || usuario.correo,
                fechaRegistro: usuario.fechaRegistro,
                rol: usuario.rol || 'usuario',
                proyectos: usuario.proyectos || []
            };

            localStorage.setItem('token', token);
            setUsuarioActual(sesion);
            localStorage.setItem('usuarioActual', JSON.stringify(sesion));

            await cargarDatosDesdeBackend(sesion);
            return { exito: true };
        } catch (error) {
            console.error("Error iniciando sesión en backend:", error);
            const msg = error.response?.data?.mensaje || 'Correo o contraseña incorrectos.';
            return { exito: false, mensaje: msg };
        }
    };

    const actualizarContenidoProyecto = async (proyectoId, nuevasTareas, nuevosRecursos) => {
        if (!usuarioActual || !usuarioActual.proyectos) return;

        const proyectoViejo = usuarioActual.proyectos.find(p => p.id === proyectoId);
        if (!proyectoViejo) return;

        const token = localStorage.getItem('token');
        if (!token) {
            // Generar token si falta
            const generatedToken = await generateJWT({
                id: usuarioActual.id,
                nombre: usuarioActual.nombre,
                correo: usuarioActual.email,
                rol: usuarioActual.rol || 'usuario'
            });
            localStorage.setItem('token', generatedToken);
        }

        const tareasViejas = proyectoViejo.tareas || [];

        // Tareas eliminadas
        const tareasEliminadas = tareasViejas.filter(tv => !nuevasTareas.some(nt => nt.id === tv.id));
        for (const t of tareasEliminadas) {
            try {
                await eliminarTarea(t.id);
            } catch (err) {
                console.error("Error eliminando tarea:", err);
            }
        }

        // Tareas creadas o actualizadas
        for (const nt of nuevasTareas) {
            const esNueva = !nt.id || nt.id > 1000000000;
            if (esNueva) {
                try {
                    await crearTarea({
                        titulo: nt.titulo,
                        asignado: nt.asignado,
                        prioridad: nt.prioridad,
                        fechaLimite: nt.fechaLimite,
                        peso: nt.peso,
                        estado: nt.estado,
                        check: nt.check,
                        estaTerminada: nt.estaTerminada,
                        proyectoId: proyectoId
                    });
                } catch (err) {
                    console.error("Error creando tarea:", err);
                }
            } else {
                const vieja = tareasViejas.find(v => v.id === nt.id);
                if (vieja && (
                    vieja.titulo !== nt.titulo ||
                    vieja.asignado !== nt.asignado ||
                    vieja.prioridad !== nt.prioridad ||
                    vieja.fechaLimite !== nt.fechaLimite ||
                    vieja.peso !== nt.peso ||
                    vieja.estado !== nt.estado ||
                    vieja.check !== nt.check ||
                    vieja.estaTerminada !== nt.estaTerminada
                )) {
                    try {
                        await actualizarTarea(nt.id, {
                            titulo: nt.titulo,
                            asignado: nt.asignado,
                            prioridad: nt.prioridad,
                            fechaLimite: nt.fechaLimite,
                            peso: nt.peso,
                            estado: nt.estado,
                            check: nt.check,
                            estaTerminada: nt.estaTerminada,
                            proyectoId: proyectoId
                        });
                    } catch (err) {
                        console.error("Error actualizando tarea:", err);
                    }
                }
            }
        }

        const recursosViejos = proyectoViejo.recursos || [];

        // Recursos eliminados
        const recursosEliminados = recursosViejos.filter(rv => !nuevosRecursos.some(nr => nr.id === rv.id));
        for (const r of recursosEliminados) {
            try {
                await eliminarRecurso(r.id);
            } catch (err) {
                console.error("Error eliminando recurso:", err);
            }
        }

        // Recursos creados
        for (const nr of nuevosRecursos) {
            const esNuevo = !nr.id || nr.id > 1000000000;
            if (esNuevo) {
                try {
                    await crearRecurso({
                        nombre: nr.nombre,
                        url: nr.url,
                        categoria: nr.categoria,
                        esArchivo: nr.esArchivo,
                        archivoNombre: nr.archivoNombre,
                        proyectoId: proyectoId
                    });
                } catch (err) {
                    console.error("Error creando recurso:", err);
                }
            }
        }

        await cargarDatosDesdeBackend(usuarioActual);
    };

    const actualizarProyectosUsuario = async (nuevosProyectos) => {
        if (!usuarioActual) return;

        if (JSON.stringify(usuarioActual.proyectos) === JSON.stringify(nuevosProyectos)) {
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            const generatedToken = await generateJWT({
                id: usuarioActual.id,
                nombre: usuarioActual.nombre,
                correo: usuarioActual.email,
                rol: usuarioActual.rol || 'usuario'
            });
            localStorage.setItem('token', generatedToken);
        }

        for (const p of nuevosProyectos) {
            const esNuevo = !p.id || p.id > 1000000000;
            if (esNuevo) {
                try {
                    const creado = await crearProyecto({
                        title: p.title,
                        tag: p.tag,
                        description: p.description,
                        startDate: p.startDate,
                        endDate: p.endDate,
                        startDateRaw: p.startDateRaw,
                        endDateRaw: p.endDateRaw,
                        iconType: p.iconType,
                        creadorId: usuarioActual.id
                    });

                    if (p.tareas && p.tareas.length > 0) {
                        for (const t of p.tareas) {
                            await crearTarea({ ...t, proyectoId: creado.id });
                        }
                    }
                    if (p.recursos && p.recursos.length > 0) {
                        for (const r of p.recursos) {
                            await crearRecurso({ ...r, proyectoId: creado.id });
                        }
                    }
                } catch (err) {
                    console.error("Error al crear proyecto en backend:", err);
                }
            }
        }

        await cargarDatosDesdeBackend(usuarioActual);
    };

    // Unirse a un grupo por código de invitación
    const unirseGrupoPorCodigo = async (codigo) => {
        if (!usuarioActual) return { exito: false };
        try {
            const res = await apiUnirseGrupoPorCodigo(codigo, usuarioActual.id);
            await cargarDatosDesdeBackend(usuarioActual);
            return { exito: true, proyecto: res.proyecto };
        } catch (err) {
            console.error("Error al unirse al grupo:", err);
            return { exito: false, mensaje: err.message || "Error al unirse al grupo" };
        }
    };

    // Eliminar grupo completo
    const eliminarGrupo = async (proyectoId) => {
        if (!usuarioActual) return { exito: false };

        try {
            await eliminarProyecto(proyectoId);
            await cargarDatosDesdeBackend(usuarioActual);
            return { exito: true };
        } catch (err) {
            console.error("Error eliminando proyecto:", err);
            return { exito: false };
        }
    };

    // Salir de un grupo
    const salirDeGrupo = async (proyectoId) => {
        if (!usuarioActual) return { exito: false };
        try {
            await apiSalirDeGrupo(proyectoId, usuarioActual.id);
            await cargarDatosDesdeBackend(usuarioActual);
            return { exito: true };
        } catch (err) {
            console.error("Error saliendo del grupo:", err);
            return { exito: false };
        }
    };

    // Quitar un miembro específico del grupo
    const quitarMiembro = async (proyectoId, miembroId) => {
        if (!usuarioActual) return { exito: false };
        try {
            await apiQuitarMiembro(proyectoId, miembroId, usuarioActual.id);
            await cargarDatosDesdeBackend(usuarioActual);
            return { exito: true };
        } catch (err) {
            console.error("Error quitando miembro del grupo:", err);
            return { exito: false };
        }
    };

    // Cerrar sesión usuario
    const cerrarSesion = () => {
        setUsuarioActual(null);
        localStorage.removeItem('usuarioActual');
        localStorage.removeItem('token');
    };

    // Iniciar sesión administrador (interno)
    const iniciarSesionAdmin = async (email, password) => {
        const ADMIN_EMAIL = 'admin@teamsync.com';
        const ADMIN_CONTRASENA = 'Admin123';
        const emailLimpio = email.trim().toLowerCase();
        const passwordLimpia = password.trim();
        if (emailLimpio === ADMIN_EMAIL && passwordLimpia === ADMIN_CONTRASENA) {
            const sesionAdmin = { email: ADMIN_EMAIL, nombre: 'Administrador', rol: 'admin' };
            const token = await generateJWT({
                id: 9999,
                nombre: sesionAdmin.nombre,
                correo: sesionAdmin.email,
                rol: sesionAdmin.rol
            });
            localStorage.setItem('token', token);
            setAdminActual(sesionAdmin);
            localStorage.setItem('adminActual', JSON.stringify(sesionAdmin));
            return { exito: true };
        }
        return { exito: false };
    };

    // Login unificado: detecta automáticamente si es admin o usuario
    const login = async (email, password) => {
        const resultadoAdmin = await iniciarSesionAdmin(email, password);
        if (resultadoAdmin.exito) {
            return { exito: true, tipo: 'admin' };
        }
        const resultadoUsuario = await iniciarSesion(email, password);
        if (resultadoUsuario.exito) {
            return { exito: true, tipo: 'usuario' };
        }
        return { exito: false, mensaje: resultadoUsuario.mensaje };
    };

    // Cerrar sesión administrador
    const cerrarSesionAdmin = () => {
        setAdminActual(null);
        localStorage.removeItem('adminActual');
        localStorage.removeItem('token');
    };

    // Activar / desactivar usuario (acción del admin)
    const toggleEstadoUsuario = async (idUsuario) => {
        try {
            await api.put(`/api/alumnos/${idUsuario}/estado`);
        } catch (error) {
            console.error("Error toggleEstadoUsuario:", error);
        }
    };

    // Cambiar contraseña de usuario (acción del admin)
    const cambiarContrasenaUsuario = async (idUsuario, nuevaContrasena) => {
        try {
            await api.put(`/api/alumnos/${idUsuario}/contrasena`, { nuevaContrasena });
        } catch (error) {
            console.error("Error cambiarContrasenaUsuario:", error);
        }
    };

    return (
        <AuthContext.Provider value={{
            usuarioActual,
            adminActual,
            cargando,
            login,
            registrarUsuario,
            iniciarSesion,
            cerrarSesion,
            iniciarSesionAdmin,
            cerrarSesionAdmin,
            obtenerUsuarios,
            toggleEstadoUsuario,
            cambiarContrasenaUsuario,
            actualizarProyectosUsuario,
            actualizarContenidoProyecto,
            unirseGrupoPorCodigo,
            eliminarGrupo,
            salirDeGrupo,
            quitarMiembro
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
