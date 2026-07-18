import './AvanceGeneral.css'
import ContadoresEstadisitcos from './ContadoresEstadisticos/ContadoresEstadisticos'

const AvanceGeneral = ({ progreso=0, totalTareas = 0, totalMiembros = 0, tareasCompletadas = 0, tareasPendientes = 0}) => { 
    return (
        <>
            <div className="db-grid-tres-columnas">
                
                <div className="db-tarjeta-avance-general">
                    <span className="db-mini-tag">Avance General</span>
                    <div className="db-contenedor">
                        <div className="db-texto-central">
                            <span className="db-porcentaje-numero">{progreso}%</span>
                            <span className="db-porcentaje-sub">Completado</span>
                        </div> 
                        <div className="db-barra-fondo">
                            <div className="db-barra-relleno" 
                                style={{ width: `${progreso}%` }}/>
                        </div>

                    </div>
                </div>  
                <ContadoresEstadisitcos totalTareas={totalTareas} totalMiembros={totalMiembros} tareasCompletadas={tareasCompletadas} tareasPendientes={tareasPendientes} />
            </div>      
        </>

    )

}
export default AvanceGeneral