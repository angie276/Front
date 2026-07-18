import { useState, useEffect } from 'react';
import { calcularCantidadSinLeer } from './notificacionHelper';

export const useNotificationCount = (usuarioActual, obtenerUsuarios) => {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!usuarioActual) return;

        const fetchUnread = async () => {
            let todosAlumnos = [];
            try {
                todosAlumnos = await obtenerUsuarios();
            } catch (err) {
                console.error(err);
            }
            const count = calcularCantidadSinLeer(usuarioActual, todosAlumnos);
            setUnreadCount(count);
        };

        fetchUnread();
        const interval = setInterval(fetchUnread, 5000);
        return () => clearInterval(interval);
    }, [usuarioActual, obtenerUsuarios]);

    return [unreadCount, setUnreadCount];
};
