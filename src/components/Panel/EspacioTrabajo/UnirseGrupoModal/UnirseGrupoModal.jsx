import React from "react";
import { CloseIcon, UserIcon } from "../Icons/Icons";

const UnirseGrupoModal = ({
    mostrarModal,
    onClose,
    onSubmit,
    codigo,
    onCodigoChange
}) => {
    if (!mostrarModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-unirse">
                <div className="modal-header">
                    <div className="unirse-titulo-container">
                        <div className="proyecto-icon-wrapper unirse-icon-wrapper">
                            <UserIcon />
                        </div>
                        <h2>Unirse a un Grupo</h2>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>
                        <CloseIcon />
                    </button>
                </div>
                <form onSubmit={onSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="codigo" className="unirse-label">CÓDIGO DE INVITACIÓN</label>
                        <input
                            type="text"
                            id="codigo"
                            name="codigo"
                            required
                            placeholder="EJ: ABC123"
                            value={codigo}
                            onChange={(e) => onCodigoChange(e.target.value)}
                            className="unirse-input"
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancelar" onClick={onClose}>
                            CANCELAR
                        </button>
                        <button type="submit" className="btn-crear btn-unirse">
                            UNIRSE
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UnirseGrupoModal;
