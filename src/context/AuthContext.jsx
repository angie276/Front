import { createContext, useContext, useState, useEffect } from 'react';
import { registrarAlumno, iniciarSesionAlumno } from '../services/auth.service.js';
import { getProyectos } from '../services/proyecto.service.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [usuarioActual, setUsuarioActual] = useState(null);
    const [adminActual, setAdminActual] = useState(null);
    const [cargando, setCargando] = useState(true);

    // Cargar sesión guardada al iniciar
    useEffect(() => {
        const sesionUsuario = localStorage.getItem('usuarioActual');
        const sesionAdmin = localStorage.getItem('adminActual');
        if (sesionUsuario) setUsuarioActual(JSON.parse(sesionUsuario));
        if (sesionAdmin) setAdminActual(JSON.parse(sesionAdmin));
        setCargando(false);
    }, []);

    // Obtener lista de usuarios registrados
    const obtenerUsuarios = () => {
        const usuarios = localStorage.getItem('usuarios');
        return usuarios ? JSON.parse(usuarios) : [];
    };

    // Registrar nuevo usuario
    const registrarUsuario = async (datosUsuario) => {
        try {
            console.log('[AUTH] Enviando registro al backend');
            const { data } = await registrarAlumno(datosUsuario);
            if (data.token) localStorage.setItem('token', data.token);
            console.log('[AUTH] Registro exitoso:', data.usuario);
            return data;
        } catch (error) {
            console.error('[AUTH] Error al registrar:', error);
            return {
                exito: false,
                mensaje: error.response?.data?.mensaje || error.message || 'No se pudo registrar el usuario.'
            };
        }
    };

    // Iniciar sesión usuario
    const iniciarSesion = async (email, password) => {
        try {
            console.log('[AUTH] Enviando inicio de sesión al backend');
            const { data } = await iniciarSesionAlumno(email, password);
            if (!data.exito) return data;

            localStorage.setItem('token', data.token);
            const proyectosResponse = await getProyectos();
            const sesion = {
                ...data.usuario,
                proyectos: proyectosResponse.proyectos || []
            };
            setUsuarioActual(sesion);
            localStorage.setItem('usuarioActual', JSON.stringify(sesion));
            console.log('[AUTH] Inicio de sesión exitoso:', sesion);
            return { exito: true, tipo: 'usuario' };
        } catch (error) {
            console.error('[AUTH] Error al iniciar sesión:', error);
            return {
                exito: false,
                mensaje: error.response?.data?.mensaje || error.message || 'No se pudo iniciar sesión.'
            };
        }

        /* Legacy local-only implementation retained for reference only.
        const emailLimpio = email.trim().toLowerCase();
        const passwordLimpia = password.trim();
        const usuarios = obtenerUsuarios();

        const usuario = usuarios.find(u => u.email.toLowerCase() === emailLimpio && u.password === passwordLimpia);
        if (!usuario) return { exito: false, mensaje: 'Correo o contraseña incorrectos.' };
        if (!usuario.activo) return { exito: false, mensaje: 'Tu cuenta está desactivada. Contacta al administrador.' };

        const sesion = {
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            fechaRegistro: usuario.fechaRegistro,
            proyectos: usuario.proyectos || []
        };
        setUsuarioActual(sesion);
        localStorage.setItem('usuarioActual', JSON.stringify(sesion));
        return { exito: true };
        */
    };


    const actualizarContenidoProyecto = (proyectoId, nuevasTareas, nuevosRecursos) => {
        if (!usuarioActual || !usuarioActual.proyectos) return;

        // 1. Recorremos los proyectos del usuario y modificamos SOLO el proyecto actual
        const proyectosActualizados = usuarioActual.proyectos.map(p => {
            if (p.id === proyectoId) {
                return {
                    ...p,
                    tareas: nuevasTareas,
                    recursos: nuevosRecursos
                };
            }
            return p; // Los demás proyectos se quedan intactos
        });

        // 2. Usamos tu función existente para guardar el bloque completo de proyectos
        actualizarProyectosUsuario(proyectosActualizados);
    };

    const actualizarProyectosUsuario = (nuevosProyectos) => {
        if (!usuarioActual) return;

        // Evitar bucles infinitos si los proyectos son idénticos
        if (JSON.stringify(usuarioActual.proyectos) === JSON.stringify(nuevosProyectos)) {
            return;
        }

        // 1. Actualizar en la lista global de grupos de localStorage
        const grupos = localStorage.getItem('grupos');
        let listaGrupos = grupos ? JSON.parse(grupos) : [];
        
        nuevosProyectos.forEach(proyecto => {
            const index = listaGrupos.findIndex(g => g.id === proyecto.id);
            if (index > -1) {
                listaGrupos[index] = proyecto;
            } else {
                listaGrupos.push(proyecto);
            }
        });
        localStorage.setItem('grupos', JSON.stringify(listaGrupos));

        // 2. Sincronizar con todos los usuarios que tengan estos proyectos
        const usuarios = obtenerUsuarios();
        const proyectosMap = {};
        nuevosProyectos.forEach(p => {
            proyectosMap[p.id] = p;
        });

        const usuariosActualizados = usuarios.map(u => {
            if (u.id === usuarioActual.id) {
                return { ...u, proyectos: nuevosProyectos };
            }
            if (u.proyectos && u.proyectos.length > 0) {
                const proyectosUserSincronizados = u.proyectos.map(p => {
                    if (proyectosMap[p.id]) {
                        return proyectosMap[p.id];
                    }
                    return p;
                });
                return { ...u, proyectos: proyectosUserSincronizados };
            }
            return u;
        });
        localStorage.setItem('usuarios', JSON.stringify(usuariosActualizados));

        // 3. Actualizar la sesión activa
        const sesionActualizada = { ...usuarioActual, proyectos: nuevosProyectos };
        setUsuarioActual(sesionActualizada);
        localStorage.setItem('usuarioActual', JSON.stringify(sesionActualizada));
    };

    // Unirse a un grupo por código de invitación
    const unirseGrupoPorCodigo = (codigo) => {
        if (!usuarioActual) {
            return { exito: false, mensaje: 'Debes iniciar sesión para unirte a un grupo.' };
        }

        const codigoLimpio = codigo.trim().toUpperCase();
        
        // 1. Obtener la lista global de grupos de localStorage
        const grupos = localStorage.getItem('grupos');
        const listaGrupos = grupos ? JSON.parse(grupos) : [];
        
        // 2. Buscar el grupo con el código coincidente
        const grupoEncontrado = listaGrupos.find(g => g.codigo && g.codigo.toUpperCase() === codigoLimpio);
        
        if (!grupoEncontrado) {
            // Plan de contingencia: buscar en proyectos de todos los usuarios
            const usuarios = obtenerUsuarios();
            let deUsuarioGrupo = null;
            for (const u of usuarios) {
                if (u.proyectos) {
                    const p = u.proyectos.find(proj => proj.codigo && proj.codigo.toUpperCase() === codigoLimpio);
                    if (p) {
                        deUsuarioGrupo = p;
                        break;
                    }
                }
            }
            if (deUsuarioGrupo) {
                listaGrupos.push(deUsuarioGrupo);
                localStorage.setItem('grupos', JSON.stringify(listaGrupos));
                return vincularUsuarioAGrupo(deUsuarioGrupo, listaGrupos);
            }
            return { exito: false, mensaje: 'No se encontró ningún grupo con ese código de invitación.' };
        }

        return vincularUsuarioAGrupo(grupoEncontrado, listaGrupos);
    };

    const vincularUsuarioAGrupo = (grupoEncontrado, listaGrupos) => {
        // Verificar si el usuario ya está en este grupo
        const yaPertenece = (usuarioActual.proyectos || []).some(p => p.id === grupoEncontrado.id);
        if (yaPertenece) {
            return { exito: false, mensaje: 'Ya eres miembro de este grupo.' };
        }

        // Incrementar la cantidad de miembros y vincular al usuario
        const grupoActualizado = {
            ...grupoEncontrado,
            membersCount: (grupoEncontrado.membersCount || 1) + 1
        };

        // Actualizar el grupo en la lista global
        const listaGruposActualizada = listaGrupos.map(g => g.id === grupoActualizado.id ? grupoActualizado : g);
        if (!listaGrupos.some(g => g.id === grupoActualizado.id)) {
            listaGruposActualizada.push(grupoActualizado);
        }
        localStorage.setItem('grupos', JSON.stringify(listaGruposActualizada));

        // Agregar el grupo a los proyectos del usuario actual
        const nuevosProyectosUsuario = [...(usuarioActual.proyectos || []), grupoActualizado];

        // Actualizar en el master list de usuarios para todos los usuarios que tengan este grupo
        const usuarios = obtenerUsuarios();
        const usuariosActualizados = usuarios.map(u => {
            if (u.id === usuarioActual.id) {
                return { ...u, proyectos: nuevosProyectosUsuario };
            }
            if (u.proyectos && u.proyectos.length > 0) {
                const proyectosUserSincronizados = u.proyectos.map(p => {
                    if (p.id === grupoActualizado.id) {
                        return grupoActualizado;
                    }
                    return p;
                });
                return { ...u, proyectos: proyectosUserSincronizados };
            }
            return u;
        });
        localStorage.setItem('usuarios', JSON.stringify(usuariosActualizados));

        // Actualizar la sesión activa
        const sesionActualizada = { ...usuarioActual, proyectos: nuevosProyectosUsuario };
        setUsuarioActual(sesionActualizada);
        localStorage.setItem('usuarioActual', JSON.stringify(sesionActualizada));

        return { exito: true, proyecto: grupoActualizado };
    };

    // Eliminar grupo completo (solo el creador puede hacerlo)
    const eliminarGrupo = (proyectoId) => {
        if (!usuarioActual) return { exito: false };

        // 1. Eliminar de la lista global de grupos
        const grupos = localStorage.getItem('grupos');
        const listaGrupos = grupos ? JSON.parse(grupos) : [];
        const listaActualizada = listaGrupos.filter(g => g.id !== proyectoId);
        localStorage.setItem('grupos', JSON.stringify(listaActualizada));

        // 2. Quitar el proyecto de TODOS los usuarios que lo tengan
        const usuarios = obtenerUsuarios();
        const usuariosActualizados = usuarios.map(u => ({
            ...u,
            proyectos: (u.proyectos || []).filter(p => p.id !== proyectoId)
        }));
        localStorage.setItem('usuarios', JSON.stringify(usuariosActualizados));

        // 3. Actualizar sesión activa
        const nuevosProyectos = (usuarioActual.proyectos || []).filter(p => p.id !== proyectoId);
        const sesionActualizada = { ...usuarioActual, proyectos: nuevosProyectos };
        setUsuarioActual(sesionActualizada);
        localStorage.setItem('usuarioActual', JSON.stringify(sesionActualizada));

        return { exito: true };
    };

    // Salir de un grupo (miembro que se unió)
    const salirDeGrupo = (proyectoId) => {
        if (!usuarioActual) return { exito: false };

        // 1. Quitar el proyecto solo del usuario actual
        const nuevosProyectos = (usuarioActual.proyectos || []).filter(p => p.id !== proyectoId);
        const sesionActualizada = { ...usuarioActual, proyectos: nuevosProyectos };
        setUsuarioActual(sesionActualizada);
        localStorage.setItem('usuarioActual', JSON.stringify(sesionActualizada));

        // 2. Actualizar en lista global de usuarios
        const usuarios = obtenerUsuarios();
        const usuariosActualizados = usuarios.map(u => {
            if (u.id === usuarioActual.id) {
                return { ...u, proyectos: nuevosProyectos };
            }
            // Decrementar membersCount en los demás usuarios que tengan el grupo
            if (u.proyectos?.some(p => p.id === proyectoId)) {
                return {
                    ...u,
                    proyectos: u.proyectos.map(p =>
                        p.id === proyectoId
                            ? { ...p, membersCount: Math.max(1, (p.membersCount || 1) - 1) }
                            : p
                    )
                };
            }
            return u;
        });
        localStorage.setItem('usuarios', JSON.stringify(usuariosActualizados));

        // 3. Actualizar membersCount en la lista global de grupos
        const grupos = localStorage.getItem('grupos');
        const listaGrupos = grupos ? JSON.parse(grupos) : [];
        const listaActualizada = listaGrupos.map(g =>
            g.id === proyectoId
                ? { ...g, membersCount: Math.max(1, (g.membersCount || 1) - 1) }
                : g
        );
        localStorage.setItem('grupos', JSON.stringify(listaActualizada));

        return { exito: true };
    };

    // Quitar un miembro específico del grupo (solo el creador puede hacerlo)
    const quitarMiembro = (proyectoId, miembroId) => {
        if (!usuarioActual) return { exito: false };

        const usuarios = obtenerUsuarios();

        // 1. Quitar el proyecto del usuario expulsado
        const usuariosActualizados = usuarios.map(u => {
            if (u.id === miembroId) {
                return { ...u, proyectos: (u.proyectos || []).filter(p => p.id !== proyectoId) };
            }
            // Decrementar membersCount en los demás miembros del grupo
            if (u.proyectos?.some(p => p.id === proyectoId)) {
                return {
                    ...u,
                    proyectos: u.proyectos.map(p =>
                        p.id === proyectoId
                            ? { ...p, membersCount: Math.max(1, (p.membersCount || 1) - 1) }
                            : p
                    )
                };
            }
            return u;
        });
        localStorage.setItem('usuarios', JSON.stringify(usuariosActualizados));

        // 2. Actualizar membersCount en la lista global de grupos
        const grupos = localStorage.getItem('grupos');
        const listaGrupos = grupos ? JSON.parse(grupos) : [];
        const listaActualizada = listaGrupos.map(g =>
            g.id === proyectoId
                ? { ...g, membersCount: Math.max(1, (g.membersCount || 1) - 1) }
                : g
        );
        localStorage.setItem('grupos', JSON.stringify(listaActualizada));

        // 3. Actualizar sesión activa del creador (su membersCount también cambia)
        const sesionActualizada = {
            ...usuarioActual,
            proyectos: (usuarioActual.proyectos || []).map(p =>
                p.id === proyectoId
                    ? { ...p, membersCount: Math.max(1, (p.membersCount || 1) - 1) }
                    : p
            )
        };
        setUsuarioActual(sesionActualizada);
        localStorage.setItem('usuarioActual', JSON.stringify(sesionActualizada));

        return { exito: true };
    };

    // Cerrar sesión usuario
    const cerrarSesion = () => {
        setUsuarioActual(null);
        localStorage.removeItem('usuarioActual');
        localStorage.removeItem('token');
    };

    // Iniciar sesión administrador (interno)
    const iniciarSesionAdmin = (email, password) => {
        const ADMIN_EMAIL = 'admin@teamsync.com';
        const ADMIN_PASSWORD = 'Admin123';
        const emailLimpio = email.trim().toLowerCase();
        const passwordLimpia = password.trim();
        if (emailLimpio === ADMIN_EMAIL && passwordLimpia === ADMIN_PASSWORD) {
            const sesionAdmin = { email: ADMIN_EMAIL, nombre: 'Administrador' };
            setAdminActual(sesionAdmin);
            localStorage.setItem('adminActual', JSON.stringify(sesionAdmin));
            return { exito: true };
        }
        return { exito: false };
    };

    // Login unificado: detecta automáticamente si es admin o usuario
    const login = async (email, password) => {
        // Primero verifica si son credenciales de administrador
        const resultadoAdmin = iniciarSesionAdmin(email, password);
        if (resultadoAdmin.exito) {
            return { exito: true, tipo: 'admin' };
        }
        // Si no, intenta como usuario normal
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
    };

    // Activar / desactivar usuario (acción del admin)
    const toggleEstadoUsuario = (idUsuario) => {
        const usuarios = obtenerUsuarios();
        const actualizados = usuarios.map(u =>
            u.id === idUsuario ? { ...u, activo: !u.activo } : u
        );
        localStorage.setItem('usuarios', JSON.stringify(actualizados));
    };

    // Cambiar contraseña de usuario (acción del admin)
    const cambiarPasswordUsuario = (idUsuario, nuevaPassword) => {
        const usuarios = obtenerUsuarios();
        const actualizados = usuarios.map(u =>
            u.id === idUsuario ? { ...u, password: nuevaPassword } : u
        );
        localStorage.setItem('usuarios', JSON.stringify(actualizados));
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
            cambiarPasswordUsuario,
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
