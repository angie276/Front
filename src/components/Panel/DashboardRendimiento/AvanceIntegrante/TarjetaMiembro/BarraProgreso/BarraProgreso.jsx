import './BarraProgreso.css'
const BarraProgreso = ({ titulo = "Progreso Asignado", porcentaje = 0, completadas = 0, total = 0, esPeso = false }) => { 
    return (
        <>
            <div className="db-progreso-contenedor">
                <div className="db-progreso-texto">
                    <span>{titulo}</span>
                    <span>{porcentaje}% {esPeso ? `(${completadas}% / ${total}%)` : `(${completadas}/${total})`}</span>
                </div>
                <div className="db-barra-fondo">
                    <div className="db-barra-relleno" style={{ width: `${porcentaje}%` }} />
                </div>
            </div>       
        </>
    )
}
export default BarraProgreso