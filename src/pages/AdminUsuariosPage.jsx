import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GestionUsuarios from '../components/Admin/GestionUsuarios/GestionUsuarios';

const AdminUsuariosPage = () => {
    const { adminActual, cargando } = useAuth();

    if (cargando) return null;
    if (!adminActual) return <Navigate to="/admin/login" replace />;

    return <GestionUsuarios />;
};

export default AdminUsuariosPage;
