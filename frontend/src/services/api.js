// API Service with Axios and JWT Interceptor
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// JWT Interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auth Services
export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login/', { email, password });
        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/auth/register/', userData);
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
    }
};

// Institution Services
export const institucionService = {
    getAll: () => api.get('/instituciones/'),
    getById: (id) => api.get(`/instituciones/${id}/`),
    create: (data) => api.post('/instituciones/', data),
    update: (id, data) => api.put(`/instituciones/${id}/`, data),
    delete: (id) => api.delete(`/instituciones/${id}/`),
};

// Solicitud Institucion Services
export const solicitudInstitucionService = {
    getAll: () => api.get('/solicitudes/instituciones/'),
    create: (data) => api.post('/solicitudes/instituciones/', data),
    aprobar: (id) => api.patch(`/solicitudes/instituciones/${id}/aprobar/`),
};

// Station Services
export const estacionService = {
    getAll: () => api.get('/estaciones/'),
    getById: (id) => api.get(`/estaciones/${id}/`),
    create: (data) => api.post('/estaciones/', data),
    update: (id, data) => api.put(`/estaciones/${id}/`, data),
    delete: (id) => api.delete(`/estaciones/${id}/`),
};

// Solicitud Estacion Services
export const solicitudEstacionService = {
    getAll: () => api.get('/solicitudes/estaciones/'),
    create: (data) => api.post('/solicitudes/estaciones/', data),
    aprobar: (id) => api.patch(`/solicitudes/estaciones/${id}/aprobar/`),
};

// Variable Services
export const variableService = {
    getAll: () => api.get('/variables/'),
};

// Sensor Services
export const sensorService = {
    getAll: () => api.get('/sensores/'),
    create: (data) => api.post('/sensores/', data),
};

// Medicion Services
export const medicionService = {
    getAll: () => api.get('/mediciones/'),
    getUltimas: () => api.get('/mediciones/ultimas/'),
    create: (data) => api.post('/mediciones/', data),
};

// Alerta Services
export const alertaService = {
    getAll: () => api.get('/alertas/'),
};

// Reporte Services
export const reporteService = {
    getAll: () => api.get('/reportes/'),
    create: (data) => api.post('/reportes/', data),
};

export default api;
