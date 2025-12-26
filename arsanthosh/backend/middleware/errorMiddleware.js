const AppError = require("../utils/AppError");

/**
 * Global Error Handling Middleware.
 * Standardizes all error responses according to the user's requested format.
 */
const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    // Standardized Error Response Format
    return res.status(err.statusCode).json({
        statusCode: err.statusCode,
        success: false,
        error: {
            message: err.message || "Internal Server Error"
        },
        data: null
    });
};

module.exports = errorMiddleware;
