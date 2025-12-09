import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// JWT interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// services/api.js
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login/', {
      email: email,
      password: password,
    });

    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (data) => {
    const response = await api.post('/auth/register/', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// USUARIO
export const usuarioService = {
    getAll: () => api.get('/usuario/'),
    getById: (id) => api.get(`/usuario/${id}/`),
};

// INSTITUCION
export const institucionService = {
    getAll: () => api.get('/institucion/'),
    create: (data) => api.post('/institucion/', data),
};

// SOLICITUD INSTITUCION
export const solicitudInstitucionService = {
    getAll: () => api.get('/solicitudes/instituciones/'),
    create: (data) => api.post('/solicitudes/instituciones/', data),
    aprobar: (id) => api.patch(`/solicitudes/instituciones/${id}/aprobar/`),
};

// ESTACION
export const estacionService = {
    getAll: () => api.get('/estacion/'),
    create: (data) => api.post('/estacion/', data),
};

// SOLICITUD ESTACION
export const solicitudEstacionService = {
    getAll: () => api.get('/solicitudes/estaciones/'),
    create: (data) => api.post('/solicitudes/estaciones/', data),
    aprobar: (id) => api.patch(`/solicitudes/estaciones/${id}/aprobar/`),
};


// VARIABLES
export const variableService = {
    getAll: () => api.get('/variable/'),
};

// SENSORES
export const sensorService = {
    getAll: () => api.get('/sensor/'),
    create: (data) => api.post('/sensor/', data),
};

// MEDICIONES
export const medicionService = {
    getAll: () => api.get('/mediciones/'),
    getUltimas: () => api.get('/mediciones/ultimas/'),
};

// ALERTAS
export const alertaService = {
    getAll: () => api.get('/alertas/'),
};


// REPORTES
export const reporteService = {
    getAll: () => api.get('/reportes/'),
    create: (data) => api.post('/reportes/', data),
};

export default api;
