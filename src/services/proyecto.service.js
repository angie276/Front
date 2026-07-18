import api from './api.js';

export const getProyectos = async () => {
  const response = await api.get('/api/proyectos');
  return response.data;
};

// Alias for existing consumers; the backend gets the user from the JWT.
export const getProyectosByUsuario = getProyectos;

export const crearProyecto = async (proyectoData) => {
  const response = await api.post('/api/proyectos', proyectoData);
  return response.data;
};

export const eliminarProyecto = async (id, userId) => {
  const response = await api.delete(`/api/proyectos/${id}`, { data: { userId } });
  return response.data;
};

export const unirseGrupoPorCodigo = async (codigo, userId) => {
  const response = await api.post('/api/proyectos/unirse', { codigo, userId });
  return response.data;
};

export const salirDeGrupo = async (id, userId) => {
  const response = await api.post(`/api/proyectos/${id}/salir`, { userId });
  return response.data;
};

export const quitarMiembro = async (id, miembroId, creadorId) => {
  const response = await api.post(`/api/proyectos/${id}/miembros/quitar`, { miembroId, creadorId });
  return response.data;
};

export const sincronizarTareas = async (id, tareas) => {
  const response = await api.put(`/api/proyectos/${id}/tareas`, { tareas });
  return response.data;
};

export const sincronizarRecursos = async (id, recursos) => {
  const response = await api.put(`/api/proyectos/${id}/recursos`, { recursos });
  return response.data;
};
