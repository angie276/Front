import api from './api.js';

export const getRecursosByProyecto = async (proyectoId) => {
  const response = await api.get(`/api/recursos/proyecto/${proyectoId}`);
  return response.data.recursos || [];
};

export const crearRecurso = async (recursoData) => {
  const response = await api.post('/api/recursos', {
    ...recursoData,
    proyectoId: parseInt(recursoData.proyectoId)
  });
  return response.data.recurso;
};

export const eliminarRecurso = async (id) => {
  const response = await api.delete(`/api/recursos/${id}`);
  return response.data;
};
