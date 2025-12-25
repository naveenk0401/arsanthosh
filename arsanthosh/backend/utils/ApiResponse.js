/**
 * Utility class for standardized API responses.
 */
class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.success = statusCode < 400;
        this.error = null;
        this.data = typeof data === 'string' ? { message: data } : data;
    }

    static success(res, statusCode, data, message) {
        return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
    }
}

module.exports = ApiResponse;
