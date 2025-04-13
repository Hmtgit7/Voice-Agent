// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);

    // Check if the error has a status code, otherwise default to 500
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        error: err.message || 'Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = errorHandler;