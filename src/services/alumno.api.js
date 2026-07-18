import api from './api.js';

export const getAlumnos = async () => {
  const response = await api.get('/api/alumnos');
  return response.data;
};

export const toggleEstadoAlumno = async (id) => {
  const response = await api.put(`/api/alumnos/${id}/estado`);
  return response.data;
};

export const cambiarPasswordAlumno = async (id, nuevaPassword) => {
  const response = await api.put(`/api/alumnos/${id}/password`, { nuevaPassword });
  return response.data;
};
