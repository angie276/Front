import React from "react";
import GrupoCreado from "../GrupoCreado/GrupoCreado";

const ProyectosGrid = ({ proyectos, onSelectProyecto }) => {
    return (
        <div className="proyectos-grid">
            {proyectos.map((proyecto) => (
                <GrupoCreado
                    key={proyecto.id}
                    proyecto={proyecto}
                    onSelectProyecto={onSelectProyecto}
                />
            ))}
        </div>
    );
};

export default ProyectosGrid;
