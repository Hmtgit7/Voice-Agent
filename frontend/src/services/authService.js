// src/services/authService.js
import api from './api';

const authService = {
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        try {
            const response = await api.post('/auth/logout');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    validateToken: async () => {
        try {
            const response = await api.get('/auth/validate');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    forgotPassword: async (email) => {
        try {
            const response = await api.post('/auth/forgot-password', { email });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    resetPassword: async (token, password) => {
        try {
            const response = await api.post('/auth/reset-password', { token, password });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default authService;