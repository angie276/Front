import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Perfil from '../components/Auth/Perfil/Perfil';

const PerfilPage = () => {
    const { usuarioActual, cargando } = useAuth();

    if (cargando) return null;
    if (!usuarioActual) return <Navigate to="/login" replace />;

    return <Perfil />;
};

export default PerfilPage;
