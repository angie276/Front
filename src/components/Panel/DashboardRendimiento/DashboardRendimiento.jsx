import { useState } from 'react'
import './DashboardRendimiento.css'
import AvanceGeneral from './AvanceGeneral/AvanceGeneral'
import AvanceIntegrante from './AvanceIntegrante/AvanceIntegrante'

const DashboardRendimiento = ({ pestanaActiva, tareas = [], miembros = [] }) => {

    const totalTareas = tareas.length;
    const totalMiembros = miembros?.length || 0;
    const tareasCompletadas = tareas ? tareas.filter(tarea => tarea.estaTerminada).length : 0;
    const tareasPendientes = totalTareas - tareasCompletadas;
    const progreso = tareas && tareas.length > 0 ? Math.round((tareasCompletadas / tareas.length) * 100) : 0;
    const cargasTrabajo = miembros.map(m => {
        const tMiembro = tareas.filter(t => t.asignado === m.email || t.asignado === "Todos");
        const pesoTotal = tMiembro.reduce((acc, t) => acc + (t.peso || 0), 0);
        const pesoCompletado = tMiembro.filter(t => t.estado === "ENVIADO" || t.estado === "REVISADO").reduce((acc, t) => acc + (t.peso || 0), 0);
        const progresoPonderado = pesoTotal > 0 ? Math.round((pesoCompletado / pesoTotal) * 100) : 0;
        return {
            email: m.email,
            total: tMiembro.length,
            completado: tMiembro.filter(t => t.estado === "ENVIADO" || t.estado === "REVISADO").length,
            pesoTotal,
            pesoCompletado,
            progresoPonderado
        };
    });


    return (
        <>
            {pestanaActiva === 'dashboard' && (
                <section key="dashboard"
                    className="dashboard-contenedor">
                    <div className="dashboard-header">
                        <div>
                            <h2 className="dashboard-titulo">Dashboard de Rendimiento</h2>
                            <span className="dashboard-subtitulo">Avance del Proyecto y
                                Estadísticas del Equipo</span>
                        </div>

                    </div>

                    <AvanceGeneral progreso={progreso} totalTareas={totalTareas}
                        totalMiembros={totalMiembros} tareasCompletadas={tareasCompletadas}
                        tareasPendientes={tareasPendientes} />
                    <AvanceIntegrante miembros={miembros} cargasTrabajo={cargasTrabajo}
                        tareas={tareas} />

                </section>
            )}

        </>

    )
}
export default DashboardRendimiento
