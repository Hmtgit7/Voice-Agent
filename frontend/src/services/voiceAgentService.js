// src/services/voiceAgentService.js
import api from './api';

const voiceAgentService = {
    startVoiceCall: async (data) => {
        try {
            const response = await api.post('/voice-agent/call', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    processVoiceInput: async (data) => {
        try {
            const response = await api.post('/voice-agent/process', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // For Web Speech API simulation
    simulateVoiceCall: async (candidateId, jobId) => {
        try {
            const response = await api.post('/voice-agent/call', { candidate_id: candidateId, job_id: jobId });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default voiceAgentService;