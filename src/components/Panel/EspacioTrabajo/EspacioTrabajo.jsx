import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./EspacioTrabajo.css";
import { PlusIcon, UserIcon, CalendarIcon, TimelineIcon, WorkloadIcon } from "./Icons/Icons";
import VencimientoTareas from "./VencimientoTareas/VencimientoTareas";
import CrearProyectoModal from "./CrearProyectoModal/CrearProyectoModal";
import ProyectosGrid from "./ProyectosGrid/ProyectosGrid";
import UnirseGrupoModal from "./UnirseGrupoModal/UnirseGrupoModal";
import CalendarioGeneral from "./CalendarioGeneral/CalendarioGeneral";
import LineaTiempo from "./LineaTiempo/LineaTiempo";
import Carga from "./Carga/Carga";

const EspacioTrabajo = ({ onSelectProyecto, usuarioActual, tabActivo = "proyectos", setTabActivo }) => {
    const { actualizarProyectosUsuario, unirseGrupoPorCodigo } = useAuth();
    const [proyectos, setProyectos] = useState(usuarioActual?.proyectos || []);

    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarUnirseModal, setMostrarUnirseModal] = useState(false);
    const [codigoInvitacion, setCodigoInvitacion] = useState("");

    const [nuevoProyecto, setNuevoProyecto] = useState({
        title: "",
        tag: "",
        description: "",
        iconType: "education",
        membersCount: 1,
        startDate: "",
        endDate: ""
    });

    // Sincronizar proyectos cuando el usuarioActual cambie (ej. al agregar tareas desde panel)
    useEffect(() => {
        if (usuarioActual?.proyectos) {
            setProyectos(usuarioActual.proyectos);
        }
    }, [usuarioActual]);

    const generarCodigoGrupo = () => {
        const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let resultado = "";
        for (let i = 0; i < 6; i++) {
            resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return resultado;
    };

    // Auto-generar códigos para proyectos antiguos que no tengan
    useEffect(() => {
        if (proyectos.length > 0) {
            let modificado = false;
            const proyectosActualizados = proyectos.map(p => {
                if (!p.codigo) {
                    modificado = true;
                    return { ...p, codigo: generarCodigoGrupo() };
                }
                return p;
            });
            if (modificado) {
                setProyectos(proyectosActualizados);
            }
        }
    }, [proyectos]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNuevoProyecto({
            ...nuevoProyecto,
            [name]: value
        });
    };

    const formatReadableDate = (dateStr) => {
        if (!dateStr) return "";
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
        return `${date.getDate()} ${months[date.getMonth()]}`;
    };

    const handleCreateProyecto = (e) => {
        e.preventDefault();
        if (!nuevoProyecto.title) return;

        const projectTag = nuevoProyecto.tag
            ? nuevoProyecto.tag.toUpperCase()
            : (nuevoProyecto.title ? nuevoProyecto.title.split(' ').map(w => w[0]).join('').slice(0, 5).toUpperCase() : "GRUPO");

        const project = {
            id: Date.now(),
            title: nuevoProyecto.title,
            tag: projectTag,
            description: nuevoProyecto.description || "Sin descripción disponible.",
            progress: 0,
            tasksCompleted: 0,
            tasksTotal: 0,
            membersCount: parseInt(nuevoProyecto.membersCount) || 1,
            startDate: formatReadableDate(nuevoProyecto.startDate) || "Hoy",
            endDate: formatReadableDate(nuevoProyecto.endDate) || "Por definir",
            startDateRaw: nuevoProyecto.startDate || null,
            endDateRaw: nuevoProyecto.endDate || null,
            iconType: nuevoProyecto.iconType,
            tareas: [],
            recursos: [],
            codigo: generarCodigoGrupo(),
            creadorId: usuarioActual?.id || null
        };

        const proyectosActualizados = [...proyectos, project];
        setProyectos(proyectosActualizados);
        actualizarProyectosUsuario(proyectosActualizados);
        setMostrarModal(false);
        setNuevoProyecto({
            title: "",
            tag: "",
            description: "",
            iconType: "education",
            membersCount: 1,
            startDate: "",
            endDate: ""
        });
    };

    const handleJoinGrupo = async (e) => {
        e.preventDefault();
        if (!codigoInvitacion.trim()) return;

        const resultado = await unirseGrupoPorCodigo(codigoInvitacion);
        if (resultado.exito) {
            setCodigoInvitacion("");
            setMostrarUnirseModal(false);
        } else {
            alert(resultado.mensaje || "Error desconocido");
        }
    };

    // Iniciales para el avatar
    const inicialesUsuario = usuarioActual
        ? `${usuarioActual.nombre?.[0] ?? ''}${usuarioActual.apellido?.[0] ?? ''}`.toUpperCase()
        : '';

    return (
        <div className="espacio-trabajo-container">
            <header className="workspace-header-premium">
                <div className="header-text-container">
                    <h1 className="proyectos-titulo">Tus Proyectos</h1>
                    <p className="proyectos-subtitulo">
                        {usuarioActual ? `Bienvenido, ${usuarioActual.nombre}. ` : ''}
                        Gestiona, organiza tareas y sincroniza el trabajo grupal de tus cursos u organizaciones.
                    </p>
                </div>
                <div className="header-acciones">
                    <button className="boton-crear-proyecto" onClick={() => setMostrarModal(true)}>
                        <PlusIcon />
                        <span>Nuevo Grupo</span>
                    </button>
                    <button className="boton-unirse-grupo" onClick={() => setMostrarUnirseModal(true)}>
                        <UserIcon />
                        <span>Unirse con Código</span>
                    </button>
                    {usuarioActual && (
                        <Link to="/perfil" className="avatar-usuario-header" id="ir-perfil" title="Ver mi perfil">
                            <span className="avatar-iniciales">{inicialesUsuario}</span>
                        </Link>
                    )}
                </div>
            </header>

            {/* Alertas de Tareas Urgentes */}
            <VencimientoTareas proyectos={proyectos} onSelectProyecto={onSelectProyecto} />

            {/* Selector de Pestañas del Workspace */}
            <div className="workspace-tabs-switcher">
                <button
                    className={`workspace-tab-btn ${tabActivo === 'proyectos' ? 'activo' : ''}`}
                    onClick={() => setTabActivo('proyectos')}
                >
                    㗊 MIS PROYECTOS
                </button>
                <button
                    className={`workspace-tab-btn ${tabActivo === 'calendario' ? 'activo' : ''}`}
                    onClick={() => setTabActivo('calendario')}
                >
                    <CalendarIcon />
                    <span>CALENDARIO GENERAL</span>
                </button>
                <button
                    className={`workspace-tab-btn ${tabActivo === 'linea_tiempo' ? 'activo' : ''}`}
                    onClick={() => setTabActivo('linea_tiempo')}
                >
                    <TimelineIcon />
                    <span>LÍNEA DEL TIEMPO</span>
                </button>
                <button
                    className={`workspace-tab-btn ${tabActivo === 'carga' ? 'activo' : ''}`}
                    onClick={() => setTabActivo('carga')}
                >
                    <WorkloadIcon />
                    <span>CARGA / WORKLOAD</span>
                </button>
            </div>

            <div className="proyectos-divider"></div>

            {/* Contenido Condicional según Pestaña */}
            {tabActivo === 'proyectos' && (
                <ProyectosGrid
                    proyectos={proyectos}
                    onSelectProyecto={onSelectProyecto}
                />
            )}

            {tabActivo === 'calendario' && (
                <CalendarioGeneral
                    proyectos={proyectos}
                    onSelectProyecto={onSelectProyecto}
                />
            )}

            {tabActivo === 'linea_tiempo' && (
                <LineaTiempo
                    proyectos={proyectos}
                    onSelectProyecto={onSelectProyecto}
                />
            )}

            {tabActivo === 'carga' && (
                <Carga
                    proyectos={proyectos}
                    onSelectProyecto={onSelectProyecto}
                />
            )}

            <CrearProyectoModal
                mostrarModal={mostrarModal}
                onClose={() => setMostrarModal(false)}
                onSubmit={handleCreateProyecto}
                nuevoProyecto={nuevoProyecto}
                onInputChange={handleInputChange}
            />

            <UnirseGrupoModal
                mostrarModal={mostrarUnirseModal}
                onClose={() => setMostrarUnirseModal(false)}
                onSubmit={handleJoinGrupo}
                codigo={codigoInvitacion}
                onCodigoChange={setCodigoInvitacion}
            />
        </div>
    );
};

export default EspacioTrabajo;
