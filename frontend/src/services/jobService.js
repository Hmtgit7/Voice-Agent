// src/services/jobService.js
import api from './api';

const jobService = {
    getAllJobs: async () => {
        try {
            const response = await api.get('/jobs');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getJobById: async (id) => {
        try {
            const response = await api.get(`/jobs/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createJob: async (jobData) => {
        try {
            const response = await api.post('/jobs', jobData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateJob: async (id, jobData) => {
        try {
            const response = await api.put(`/jobs/${id}`, jobData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteJob: async (id) => {
        try {
            const response = await api.delete(`/jobs/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default jobService;