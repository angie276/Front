import React from "react";
import { CloseIcon } from "../Icons/Icons";

const CrearProyectoModal = ({
    mostrarModal,
    onClose,
    onSubmit,
    nuevoProyecto,
    onInputChange
}) => {
    if (!mostrarModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Crear Nuevo Proyecto</h2>
                    <button className="modal-close-btn" onClick={onClose}>
                        <CloseIcon />
                    </button>
                </div>
                <form onSubmit={onSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="title">Nombre del Proyecto</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            required
                            placeholder="Ej. Curso de Estructura de Datos"
                            value={nuevoProyecto.title}
                            onChange={onInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Descripción</label>
                        <textarea
                            id="description"
                            name="description"
                            rows="3"
                            placeholder="Describe brevemente el propósito de este proyecto..."
                            value={nuevoProyecto.description}
                            onChange={onInputChange}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="startDate">Fecha Inicio</label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={nuevoProyecto.startDate}
                                onChange={onInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="endDate">Fecha Fin</label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={nuevoProyecto.endDate}
                                onChange={onInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="membersCount">Cantidad de Miembros</label>
                        <input
                            type="number"
                            id="membersCount"
                            name="membersCount"
                            min="1"
                            value={nuevoProyecto.membersCount}
                            onChange={onInputChange}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancelar" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-crear">
                            Crear Proyecto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CrearProyectoModal;
