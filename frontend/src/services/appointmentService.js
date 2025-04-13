// src/services/appointmentService.js
import api from './api';

const appointmentService = {
    getAllAppointments: async () => {
        try {
            const response = await api.get('/appointments');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getAppointmentById: async (id) => {
        try {
            const response = await api.get(`/appointments/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createAppointment: async (appointmentData) => {
        try {
            const response = await api.post('/appointments', appointmentData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateAppointment: async (id, appointmentData) => {
        try {
            const response = await api.put(`/appointments/${id}`, appointmentData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteAppointment: async (id) => {
        try {
            const response = await api.delete(`/appointments/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default appointmentService;