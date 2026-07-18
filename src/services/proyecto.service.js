import api from './api.js';

export const getProyectosByUsuario = async (userId) => {
  const response = await api.get('/api/proyectos');
  return response.data.proyectos || [];
};

export const crearProyecto = async (proyectoData) => {
  const response = await api.post('/api/proyectos', {
    ...proyectoData,
    creadorId: parseInt(proyectoData.creadorId)
  });
  return response.data.proyecto;
};

export const eliminarProyecto = async (id) => {
  const response = await api.delete(`/api/proyectos/${id}`);
  return response.data;
};

export const unirseGrupoPorCodigo = async (codigo, userId) => {
  const response = await api.post('/api/proyectos/unirse', { codigo });
  return response.data;
};

export const salirDeGrupo = async (id, userId) => {
  // Simulado en frontend
  return { exito: true };
};

export const quitarMiembro = async (id, miembroId, creadorId) => {
  // Simulado en frontend
  return { exito: true };
};

export const sincronizarTareas = async (id, tareas) => {
  // Simulado en frontend
  return { exito: true };
};

export const sincronizarRecursos = async (id, recursos) => {
  // Simulado en frontend
  return { exito: true };
};
