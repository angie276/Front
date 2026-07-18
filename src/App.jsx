import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import './App.css';
import Panel from './components/Panel/Panel';
import EspacioTrabajo from './components/Panel/EspacioTrabajo/EspacioTrabajo';
import Sidebar from './components/Panel/SideBar/SideBar';
import NotificationModal from './components/Panel/SideBar/NotificacionModal/NotificationModal';
import { useAuth } from './context/AuthContext';
import { useNotificationCount } from './components/Panel/SideBar/NotificacionModal/useNotificationCount';

function App() {
  const { usuarioActual, cargando, cerrarSesion, obtenerUsuarios } = useAuth();
  const [vista, setVista] = useState('proyectos');
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [sidebarColapsado, setSidebarColapsado] = useState(false);
  const [tabActivo, setTabActivo] = useState('proyectos'); // "proyectos" | "calendario" | "linea_tiempo" | "carga"
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const [unreadCount, setUnreadCount] = useNotificationCount(usuarioActual, obtenerUsuarios);

  const handleOpenNotifications = () => {
    setMostrarNotificaciones(true);
    setUnreadCount(0);
    localStorage.setItem(`lastReadNotifications_${usuarioActual?.id}`, new Date().toISOString());
  };

  // Mientras se comprueba la sesión guardada
  if (cargando) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#05010d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', sans-serif",
        color: '#8c86a6',
        fontSize: '0.95rem'
      }}>
        Cargando...
      </div>
    );
  }

  // Si no hay sesión, redirigir al login
  if (!usuarioActual) {
    return <Navigate to="/login" replace />;
  }

  const handleSelectProyecto = (proyecto) => {
    // Buscar el proyecto fresco desde el usuario actual si es posible
    const proyectoFresco = usuarioActual?.proyectos?.find(p => p.id === proyecto.id) || proyecto;
    setProyectoSeleccionado(proyectoFresco);
    setVista('panel');
  };

  const handleVolverProyectos = () => {
    setVista('proyectos');
    setProyectoSeleccionado(null);
  };

  const handleNavigateToProyectos = () => {
    setVista('proyectos');
    setTabActivo('proyectos');
    setProyectoSeleccionado(null);
  };

  const handleNavigateToCalendario = () => {
    setVista('proyectos');
    setTabActivo('calendario');
    setProyectoSeleccionado(null);
  };

  const handleNavigateToLineaTiempo = () => {
    setVista('proyectos');
    setTabActivo('linea_tiempo');
    setProyectoSeleccionado(null);
  };

  const handleNavigateToCarga = () => {
    setVista('proyectos');
    setTabActivo('carga');
    setProyectoSeleccionado(null);
  };

  return (
    <div className={`app-layout ${sidebarColapsado ? 'sidebar-colapsado' : 'sidebar-expandido'}`}>
      <Sidebar
        colapsado={sidebarColapsado}
        setColapsado={setSidebarColapsado}
        usuarioActual={usuarioActual}
        proyectos={usuarioActual?.proyectos || []}
        onSelectProyecto={handleSelectProyecto}
        onNavigateToProyectos={handleNavigateToProyectos}
        onNavigateToCalendario={handleNavigateToCalendario}
        onNavigateToLineaTiempo={handleNavigateToLineaTiempo}
        onNavigateToCarga={handleNavigateToCarga}
        onOpenNotifications={handleOpenNotifications}
        countNotificaciones={unreadCount}
        onLogout={cerrarSesion}
        proyectoSeleccionado={proyectoSeleccionado}
        vista={vista}
        tabActivo={tabActivo}
      />

      <div className="app-main-content">
        {vista === 'proyectos' ? (
          <EspacioTrabajo
            onSelectProyecto={handleSelectProyecto}
            usuarioActual={usuarioActual}
            tabActivo={tabActivo}
            setTabActivo={setTabActivo}
          />
        ) : (
          <Panel onVolver={handleVolverProyectos} proyecto={proyectoSeleccionado} />
        )}
      </div>

      {mostrarNotificaciones && (
        <NotificationModal
          usuarioActual={usuarioActual}
          onClose={() => setMostrarNotificaciones(false)}
        />
      )}
    </div>
  );
}

export default App;

