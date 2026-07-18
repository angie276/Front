import { useState } from "react";

const AgregarTarea = ({ onAgregar, miembros }) => {
    const [titulo, setTitulo] = useState("");
    const [asignado, setAsignado] = useState("Todos");
    const [prioridad, setPrioridad] = useState("Media");
    const [fechaLimite, setFechaLimite] = useState("");
    const [peso, setPeso] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (titulo.trim() === "") return;
        onAgregar({
            id: Date.now(),
            titulo: titulo,
            asignado: asignado,
            prioridad: prioridad,
            fechaLimite: fechaLimite,
            peso: parseInt(peso) || 0,
            estado: "PENDIENTE",
            check: false,
            estaTerminada: false
        });
        setTitulo("");
        setAsignado("Todos");
        setPrioridad("Media");
        setFechaLimite("");
        setPeso(0);
    };

    return (
        <form className="ingresar-tarea" onSubmit={handleSubmit}>
            <h4 className="agregar-tarea-titulo">AÑADIR NUEVA TAREA</h4>
            <div className="campos-adicionales">
                <div className="campo-grupo">
                    <p>RESPONSABLE</p>
                    <select className="selector" value={asignado} onChange={(e) => setAsignado(e.target.value)}>
                        <option value="Todos">Asignar a todos</option>
                        {miembros.map((miembro) => (
                            <option key={miembro.id} value={miembro.email}>
                                {miembro.email}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="campo-grupo">
                    <p>PRIORIDAD</p>
                    <select className="selector" value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
                        <option value="Baja">Baja</option>
                        <option value="Media">Media</option>
                        <option value="Alta">Alta</option>
                    </select>
                </div>

                <div className="campo-grupo">
                    <p>FECHA</p>
                    <input
                        type="date"
                        className="selector selector-fecha"
                        value={fechaLimite}
                        onChange={(e) => setFechaLimite(e.target.value)}
                    />
                </div>

                <div className="campo-grupo">
                    <p>PESO (%)</p>
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
            </div>

            <input type="text" placeholder="Escribe una tarea..." value={titulo} onChange={(e) => setTitulo(e.target.value)} />
            <button type="submit" className="añadir-tarea"> + </button>
        </form>
    );
};

export default AgregarTarea;


