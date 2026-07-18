import api from './api.js';

export const getRecursosByProyecto = async (proyectoId) => {
  const response = await api.get(`/api/recursos/proyecto/${proyectoId}`);
  return response.data;
};

export const crearRecurso = async (recurso) => {
  const response = await api.post('/api/recursos', recurso);
  return response.data;
};

export const eliminarRecurso = async (id) => {
  const response = await api.delete(`/api/recursos/${id}`);
  return response.data;
};
