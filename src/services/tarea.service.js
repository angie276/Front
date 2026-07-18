import api from './api.js';

export const getTareasByProyecto = async (proyectoId) => {
  const response = await api.get(`/api/tareas/proyecto/${proyectoId}`);
  return response.data;
};

export const crearTarea = async (tarea) => {
  const response = await api.post('/api/tareas', tarea);
  return response.data;
};

export const actualizarTarea = async (id, tarea) => {
  const response = await api.put(`/api/tareas/${id}`, tarea);
  return response.data;
};

export const cambiarEstadoTarea = async (id) => {
  const response = await api.put(`/api/tareas/${id}/check`);
  return response.data;
};

export const eliminarTarea = async (id) => {
  const response = await api.delete(`/api/tareas/${id}`);
  return response.data;
};
