import api from './api.js';

export const getTareasByProyecto = async (proyectoId) => {
  const response = await api.get(`/api/tareas/proyecto/${proyectoId}`);
  return response.data.tareas || [];
};

export const crearTarea = async (tareaData) => {
  const response = await api.post('/api/tareas', {
    ...tareaData,
    proyectoId: parseInt(tareaData.proyectoId)
  });
  return response.data.tarea;
};

export const actualizarTarea = async (id, tareaData) => {
  const response = await api.put(`/api/tareas/${id}`, {
    ...tareaData,
    proyectoId: parseInt(tareaData.proyectoId)
  });
  return response.data.tarea;
};

export const eliminarTarea = async (id) => {
  const response = await api.delete(`/api/tareas/${id}`);
  return response.data;
};

export const toggleCheckTarea = async (id) => {
  const response = await api.put(`/api/tareas/${id}/check`);
  return response.data.tarea;
};
