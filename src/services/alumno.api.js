import api from './api.js';

export const getAlumnos = async () => {
  const response = await api.get('/api/alumnos');
  return response.data;
};

export const toggleEstadoAlumno = async (id) => {
  const response = await api.put(`/api/alumnos/${id}/estado`);
  return response.data;
};

export const cambiarContrasenaAlumno = async (id, nuevaContrasena) => {
  const response = await api.put(`/api/alumnos/${id}/contrasena`, { nuevaContrasena });
  return response.data;
};
