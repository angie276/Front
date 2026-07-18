import './AvanceIntegrante.css'
import TarjetaMiembro from './TarjetaMiembro/TarjetaMiembro'    
const AvanceIntegrante = ({miembros = [], 
    cargasTrabajo = [], 
    tareas = []}) => { 
    return (
        <>
            <div className="db-bloque-individual">
                <div>
                    <h3 className="db-titulo-seccion">Avance Individual de Integrantes</h3>
                    <span className="db-mini-tag">Carga y Desempeño Individualizado</span>
                </div>

                <div className="db-grid-dos-columnas">
                    {miembros?.map(miembro => (
                        <TarjetaMiembro 
                            key={miembro.id} 
                            miembro={miembro}
                            cargasTrabajo={cargasTrabajo}
                            tareas={tareas}/>
                    ))}
                </div>
            </div>
        </>
    )
}
export default AvanceIntegrante
