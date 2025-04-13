// utils/responseFormatter.js
/**
 * Format API response
 * @param {boolean} success - Whether the request was successful
 * @param {string} message - Response message
 * @param {*} data - Response data
 * @param {*} error - Error details (if any)
 * @returns {Object} - Formatted response object
 */
const formatResponse = (success, message, data = null, error = null) => {
    const response = {
        success,
        message
    };

    if (data) {
        response.data = data;
    }

    if (error) {
        response.error = error;
    }

    return response;
};

module.exports = {
    formatResponse
};