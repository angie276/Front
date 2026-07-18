import { useState, useEffect } from "react"
import Header from "./Header/Header"
import ResumenProyecto from "./ResumenProyecto/ResumenProyecto"
import Recursos from "./Recursos/Recursos"
import TablaTareas from "./TablaTareas/TablaTareas"
import "./Panel.css"
import DashboardRendimiento from "./DashboardRendimiento/DashboardRendimiento"
import { useAuth } from "../../context/AuthContext";

const Panel = ({ onVolver, proyecto }) => {
    const { usuarioActual, obtenerUsuarios } = useAuth();
    const [pestanaActiva, setPestanaActiva] = useState('tareas');
    const [miembros, setMiembros] = useState([]);

    // 1. CAMBIO CRÍTICO: Buscamos el proyecto fresco directamente desde el usuario activo
    const proyectoSincronizado = usuarioActual?.proyectos?.find(p => p.id === proyecto.id) || proyecto;

    // 2. Extraemos las tareas directo del proyecto sincronizado (SIN useState)
    const tareas = proyectoSincronizado?.tareas || [];

    // 3. Derivamos los miembros de forma asíncrona y los actualizamos con polling
    useEffect(() => {
        let activo = true;
        const fetchMiembros = () => {
            obtenerUsuarios().then(todosUsuarios => {
                if (!activo) return;
                const filtrados = (todosUsuarios || [])
                    .filter(u => {
                        const proyectosUsuario = u.proyectos || [];
                        const esMiembro = proyectosUsuario.some(p => String(p.id) === String(proyectoSincronizado.id));
                        const esCreador = String(u.id) === String(proyectoSincronizado.creadorId);
                        return esMiembro || esCreador;
                    })
                    .map((u, i) => ({ 
                        id: i + 1, 
                        userId: u.id, 
                        email: u.email || u.correo, 
                        nombre: u.nombre, 
                        apellido: u.apellido 
                    }));
                
                // Evitar actualizaciones de estado si la lista es idéntica
                setMiembros(prev => {
                    if (JSON.stringify(prev) === JSON.stringify(filtrados)) return prev;
                    return filtrados;
                });
            });
        };

        fetchMiembros();
        const interval = setInterval(fetchMiembros, 4000); // Polling cada 4 segundos

        return () => {
            activo = false;
            clearInterval(interval);
        };
    }, [usuarioActual, proyectoSincronizado.id]);

    const tareasCompletas = tareas.filter(tarea => tarea.check);

    return (
        <div className="panel-wrapper">
            <Header 
                pestanaActiva={pestanaActiva} 
                setPestanaActiva={setPestanaActiva} 
                onVolver={onVolver} 
                proyecto={proyectoSincronizado} 
            />
            <div className="panel-body">
                <section className="panel-tareas">
                    <ResumenProyecto
                        setPestanaActiva={setPestanaActiva}
                        proyecto={proyectoSincronizado}
                        tareas={tareas}
                        tareasCompletas={tareasCompletas}
                        onVolver={onVolver}
                        usuarioActual={usuarioActual}
                        miembros={miembros}
                    />

                    {pestanaActiva === 'tareas' && (
                        <TablaTareas
                            miembros={miembros}
                            proyecto={proyectoSincronizado}
                        />
                    )}
                    {pestanaActiva === 'dashboard' && (
                        <DashboardRendimiento
                            pestanaActiva={pestanaActiva}
                            tareas={tareas}
                            miembros={miembros}
                        />
                    )}
                </section>

                <section className="panel-recursos">
                    <Recursos proyecto={proyectoSincronizado} />
                </section>
            </div>
        </div>
    )
}

export default Panel;
