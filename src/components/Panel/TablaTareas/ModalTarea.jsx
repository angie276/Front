import { useState, useEffect } from "react";
import "./ModalTarea.css";

const ModalTarea = ({ tarea, onClose, onSave, onDelete, miembros = [] }) => {
    const [titulo, setTitulo] = useState(tarea.titulo || "");
    const [asignado, setAsignado] = useState(tarea.asignado || "Todos");
    const [prioridad, setPrioridad] = useState(tarea.prioridad || "Media");
    const [fechaLimite, setFechaLimite] = useState(tarea.fechaLimite || "");
    const [estado, setEstado] = useState(tarea.estado || "PENDIENTE");
    const [peso, setPeso] = useState(tarea.peso || 0);

    // Actualizar estados si la tarea cambia externamente
    useEffect(() => {
        if (tarea) {
            setTitulo(tarea.titulo || "");
            setAsignado(tarea.asignado || "Todos");
            setPrioridad(tarea.prioridad || "Media");
            setFechaLimite(tarea.fechaLimite || "");
            setEstado(tarea.estado || "PENDIENTE");
            setPeso(tarea.peso || 0);
        }
    }, [tarea]);

    const handleSave = (e) => {
        e.preventDefault();
        if (titulo.trim() === "") return;
        const isCompletada = estado === "ENVIADO" || estado === "REVISADO";
        onSave({
            ...tarea,
            titulo: titulo.trim(),
            asignado,
            prioridad,
            fechaLimite,
            estado,
            check: isCompletada,
            estaTerminada: isCompletada,
            peso: parseInt(peso) || 0
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <h4 className="modal-subtitulo-sup">DETALLE DEL HITO ACADÉMICO</h4>
                    <button className="boton-cerrar-x" onClick={onClose}>&times;</button>
                </header>

                <form onSubmit={handleSave} className="modal-form">
                    <div className="modal-titulo-wrapper">
                        <input 
                            type="text" 
                            className="modal-titulo-input"
                            value={titulo} 
                            onChange={(e) => setTitulo(e.target.value)} 
                            placeholder="Escribe el título..."
                            required
                        />
                    </div>

                    <div className="cuadricula-formulario">
                        <div className="grupo-formulario">
                            <label>ESTADO DE AVANCE</label>
                            <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                                <option value="PENDIENTE">PENDIENTE</option>
                                <option value="ENVIADO">ENVIADO</option>
                                <option value="REVISADO">REVISADO</option>
                            </select>
                        </div>

                        <div className="grupo-formulario">
                            <label>PRIORIDAD</label>
                            <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
                                <option value="Baja">BAJA</option>
                                <option value="Media">MEDIA</option>
                                <option value="Alta">ALTA</option>
                            </select>
                        </div>

                        <div className="grupo-formulario">
                            <label>ASIGNAR RESPONSABLE</label>
                            <select value={asignado} onChange={(e) => setAsignado(e.target.value)}>
                                <option value="Todos">Todos</option>
                                {miembros.map((miembro) => (
                                    <option key={miembro.id} value={miembro.email}>
                                        {miembro.email}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grupo-formulario">
                            <label>FECHA DE ENTREGA</label>
                            <input 
                                type="date" 
                                value={fechaLimite} 
                                onChange={(e) => setFechaLimite(e.target.value)} 
                            />
                        </div>
                    </div>

                    <div className="grupo-formulario peso-seccion-modal">
                        <label>PESO DE LA TAREAS (%)</label>
                        <div className="peso-input-container">
                            <input 
                                type="number" 
                                className="selector selector-peso" 
                                min="0"
                                max="100"
                                value={peso} 
                                onChange={(e) => setPeso(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))} 
                            />
                            <span className="porcentaje-simbolo">%</span>
                        </div>
                    </div>

                    <footer className="modal-footer">
                        <button 
                            type="button" 
                            className="boton-eliminar-tarea" 
                            onClick={() => onDelete(tarea.id)}
                        >
                            Eliminar Tarea
                        </button>
                        <div className="botones-derecha">
                            <button type="button" className="boton-cancelar" onClick={onClose}>
                                Cancelar
                            </button>
                            <button type="submit" className="boton-guardar">
                                Guardar Cambios
                            </button>
                        </div>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default ModalTarea;

