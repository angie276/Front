import "./Header.css"
import { BackIcon, CheckSquareIcon, DashboardIcon } from "./Icons";

const Header = ({ pestanaActiva, setPestanaActiva, onVolver, proyecto }) => {
    const title = proyecto ? proyecto.title : "Nombre Proyecto";

    return (
        <header className="premium-header">
            {/* Left side: Back Button + Workspace info */}
            <div className="header-left">
                <button className="boton-volver-cuadrado" onClick={onVolver} title="Volver a Proyectos">
                    <BackIcon />
                </button>
                <div className="header-workspace-info">
                    <span className="workspace-tag">WORKSPACE DE EQUIPO</span>
                    <h1 className="workspace-titulo">{title}</h1>
                </div>
            </div>

            {/* Right side: Navigation pills track */}
            <div className="header-right">
                <nav className="header-nav-track">
                    <button 
                        className={`nav-pill ${pestanaActiva === 'tareas' ? 'activo' : ''}`}
                        onClick={() => setPestanaActiva('tareas')}
                    >
                        <CheckSquareIcon />
                        <span>TAREAS</span>
                    </button>
                    
                    <button 
                        className={`nav-pill ${pestanaActiva === 'dashboard' ? 'activo' : ''}`}
                        onClick={() => setPestanaActiva('dashboard')}
                    >
                        <DashboardIcon />
                        <span>DASHBOARD</span>
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;
