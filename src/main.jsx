import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import App from './App.jsx'
import PanelPage from './pages/PanelPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegistroPage from './pages/RegistroPage.jsx'
import PerfilPage from './pages/PerfilPage.jsx'
import AdminLoginPage from './pages/AdminLoginPage.jsx'
import AdminUsuariosPage from './pages/AdminUsuariosPage.jsx'
import miembrosData from './data/miembros.js'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: 'panel',
    element: <PanelPage />
  },
  {
    path: 'login',
    element: <LoginPage />
  },
  {
    path: 'registro',
    element: <RegistroPage />
  },
  {
    path: 'perfil',
    element: <PerfilPage />
  },
  {
    path: 'admin/login',
    element: <AdminLoginPage />
  },
  {
    path: 'admin/usuarios',
    element: <AdminUsuariosPage />
  },
])

const onLoad = () => {
  const storedMiembros = localStorage.getItem('miembros');
  if (!storedMiembros) {
    localStorage.setItem('miembros', JSON.stringify(miembrosData));
  }
}
onLoad();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
