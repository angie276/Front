import './SubTareaAlumno.css'
const SubTareaAlumno = ({ listaTareasMiembro=[]}) => { 
    return (
        <>
            <div className="db-subtareas-lista">
                <span className="db-mini-tag">Tareas asignadas:</span>
                
                {listaTareasMiembro.length > 0 ? (listaTareasMiembro.map(t => (
                    <div key={t.id} className="db-item-tarea">
                        <span className={`db-tarea-desc ${t.estaTerminada ? 'line-through opacity-40' : ''}`}> {t.titulo}</span>
                        {t.peso !== undefined && (
                            <span className="db-tarea-peso-badge">{t.peso}% peso</span>
                        )}
                    </div>
                ))) : (<p className="db-sin-tareas">Sin tareas asignadas en este ciclo.</p>)}
            </div>        
        </>
    )
}
export default SubTareaAlumno

