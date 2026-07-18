import api from './api.js';

export const registrarAlumno = (datos) => api.post('/api/alumnos', datos);

export const iniciarSesionAlumno = (email, password) =>
  api.post('/api/alumnos/login', { email, password });
