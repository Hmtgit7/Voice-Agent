// middleware/validateRequest.js
const validateRequest = (schema) => {
    return (req, res, next) => {
        if (!schema) return next();

        const { error } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                error: error.details[0].message
            });
        }

        next();
    };
};

module.exports = validateRequest;