export const obtenerNotificacionesProyecto = (usuarioActual, todosAlumnos) => {
    if (!usuarioActual) return [];
    const result = [];
    const hoy = new Date();

    (usuarioActual.proyectos || []).forEach(proyecto => {
        const esCreador = usuarioActual.id === proyecto.creadorId;

        // 1. Vencimientos
        (proyecto.tareas || []).forEach(tarea => {
            if (tarea.fechaLimite && !tarea.check && !tarea.estaTerminada) {
                const limite = new Date(tarea.fechaLimite + 'T00:00:00');
                const diffTime = limite.getTime() - hoy.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays <= 3 && diffDays >= 0) {
                    result.push({
                        id: `vence-${tarea.id}`,
                        icono: "⏰",
                        mensaje: `La tarea "${tarea.titulo}" del proyecto "${proyecto.title}" está por vencer en ${diffDays === 0 ? 'hoy' : diffDays + ' día(s)'}.`,
                        tipo: "warning",
                        fecha: new Date(tarea.fechaLimite + 'T00:00:00')
                    });
                }
            }

            // 2. Completadas/Creadas
            if (tarea.estaTerminada || tarea.check) {
                result.push({
                    id: `completada-${tarea.id}`,
                    icono: "✅",
                    mensaje: `${tarea.asignado || 'Un integrante'} completó la tarea "${tarea.titulo}" en "${proyecto.title}".`,
                    tipo: "success",
                    fecha: new Date(tarea.updatedAt || new Date())
                });
            } else {
                result.push({
                    id: `creada-${tarea.id}`,
                    icono: "➕",
                    mensaje: `Se creó la tarea "${tarea.titulo}" en "${proyecto.title}" asignada a ${tarea.asignado}.`,
                    tipo: "info",
                    fecha: new Date(tarea.createdAt || new Date())
                });
            }
        });

        // 3. Nuevos Integrantes (para el creador)
        if (esCreador && todosAlumnos) {
            todosAlumnos.forEach(alumno => {
                const pertenece = (alumno.proyectos || []).some(p => p.id === proyecto.id);
                const noEsCreador = alumno.id !== proyecto.creadorId;
                if (pertenece && noEsCreador) {
                    result.push({
                        id: `miembro-${proyecto.id}-${alumno.id}`,
                        icono: "👤",
                        mensaje: `El integrante ${alumno.nombre} ${alumno.apellido || ''} se unió a tu proyecto "${proyecto.title}".`,
                        tipo: "info",
                        fecha: new Date(alumno.createdAt || alumno.fechaRegistro || new Date())
                    });
                }
            });
        }
    });

    result.sort((a, b) => b.fecha - a.fecha);
    return result;
};

export const calcularCantidadSinLeer = (usuarioActual, todosAlumnos) => {
    if (!usuarioActual) return 0;
    const notificaciones = obtenerNotificacionesProyecto(usuarioActual, todosAlumnos);
    const lastReadStr = localStorage.getItem(`lastReadNotifications_${usuarioActual.id}`) || new Date(0).toISOString();
    const lastRead = new Date(lastReadStr);

    return notificaciones.filter(n => n.fecha > lastRead).length;
};
