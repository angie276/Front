import './ContadoresEstadisticos.css'
const ContadoresEstadisitcos = ({totalTareas = 0, totalMiembros = 0, tareasCompletadas = 0, tareasPendientes = 0} ) => {
    const estadisticas = [
        {
            titulo: "Tareas en total",
            estadistica: totalTareas,
            p: "Total de actividades declaradas e implantadas en este Workspace.",
        },
        {
            titulo: "Tareas Acabadas",
            estadistica: tareasCompletadas,
            p: "Actividades con entrega satisfactoria o ya finalizadas.",
        },
        {
            titulo: "Pendientes de Acción",
            estadistica: tareasPendientes,
            p: "Carga total de trabajo pendiente por liquidar.",
        },
        {
            titulo: "Cuentas Vinculadas",
            estadistica: totalMiembros,
            p: "Estudiantes activos sincronizados en el proyecto.",
            
        }
    ];
    return ( 
        <>
            <div className="db-grid-contadores">
                
                {estadisticas.map((e, index) => (
                    <div className="db-tarjeta-contador" key={index}>
                        <div>
                            <span className="db-mini-tag">{e.titulo}</span>
                            <span className='db-contador-numero'>{e.estadistica}</span>
                        </div>
                        <div className="db-contador-desc">{e.p}</div>
                    </div>
                ))}
            </div>      
        </>
    )
}
export default ContadoresEstadisitcos