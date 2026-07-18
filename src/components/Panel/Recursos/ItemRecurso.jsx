import "./ItemRecurso.css"

const ItemRecurso = (props) => {
    // Determine badge content and color style
    const getBadgeStyle = (cat) => {
        const c = (cat || 'url').toLowerCase();
        switch (c) {
            case 'pdf': return { label: 'PDF', class: 'badge-pdf' };
            case 'doc': return { label: 'DOC', class: 'badge-doc' };
            case 'csv': return { label: 'CSV', class: 'badge-csv' };
            case 'ppt': return { label: 'PPT', class: 'badge-ppt' };
            case 'url': return { label: 'URL', class: 'badge-url' };
            default: return { label: 'Otros', class: 'badge-otros' };
        }
    };

    const badge = getBadgeStyle(props.categoria);

    return (
        <div className="item-recurso">
            <div className="contenedor-item">
                <div className="titulo-y-badge">
                    <span className={`badge-recurso ${badge.class}`}>{badge.label}</span>
                    <p className="item-nombre">{props.nombre}</p>
                </div>
                {props.url && props.url !== "#" ? (
                    <a 
                        className="url-recurso" 
                        href={props.url} 
                        download={props.esArchivo ? (props.archivoNombre || props.nombre) : undefined}
                        target="_blank" 
                        rel="noreferrer"
                    >
                        {props.esArchivo ? "📎 Descargar Archivo" : props.url}
                    </a>
                ) : (
                    <span className="url-recurso sin-enlace">Sin archivo/enlace</span>
                )}
            </div>
            <button className="eliminar" onClick={() => props.eliminarRecurso(props.id)}>-</button>
        </div>
    )
}

export default ItemRecurso


