import './TarjetaMiembro.css'
import BarraProgreso from './BarraProgreso/BarraProgreso'
import SubTareaAlumno from './SubTareaAlumno/SubTareaAlumno'
const TarjetaMiembro = ({miembro, 
    cargasTrabajo = [], 
    tareas = []}) => { 

    const trabajoMiembro = cargasTrabajo?.find(w => w.email === miembro.email) || { 
        total: 0, 
        completado: 0, 
        pesoTotal: 0, 
        pesoCompletado: 0, 
        progresoPonderado: 0 
    };
    const porcentaje = trabajoMiembro.total > 0 ? Math.round((trabajoMiembro.completado / trabajoMiembro.total) * 100) : 0;
    const listaTareasMiembro = tareas.filter(t => t.asignado === miembro.email || t.asignado === "Todos");   
    return (
        <>
            <div className="db-tarjeta-miembro">
                <div>
                    <div className="db-miembro-header">
                        <div className="db-miembro-perfil">
                            
                            <div className="db-miembro-info">
                                <p className="db-miembro-email">{miembro.email}</p>
                                <span className="db-miembro-sub">Alumno</span>
                            </div>
                        </div>
                    </div>

                    <BarraProgreso 
                        titulo="Progreso de Tareas" 
                        porcentaje={porcentaje} 
                        completadas={trabajoMiembro.completado} 
                        total={trabajoMiembro.total} 
                    />
                    <BarraProgreso 
                        titulo="Progreso Ponderado (Peso)" 
                        porcentaje={trabajoMiembro.progresoPonderado} 
                        completadas={trabajoMiembro.pesoCompletado} 
                        total={trabajoMiembro.pesoTotal} 
                        esPeso={true}
                    />
                    <SubTareaAlumno listaTareasMiembro={listaTareasMiembro}/>
                    
                </div>
            </div>        
        </>
    )
}
export default TarjetaMiembro

