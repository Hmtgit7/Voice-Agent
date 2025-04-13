// src/services/candidateService.js
import api from './api';

const candidateService = {
    getAllCandidates: async () => {
        try {
            const response = await api.get('/candidates');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getCandidateById: async (id) => {
        try {
            const response = await api.get(`/candidates/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createCandidate: async (candidateData) => {
        try {
            const response = await api.post('/candidates', candidateData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateCandidate: async (id, candidateData) => {
        try {
            const response = await api.put(`/candidates/${id}`, candidateData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteCandidate: async (id) => {
        try {
            const response = await api.delete(`/candidates/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default candidateService;