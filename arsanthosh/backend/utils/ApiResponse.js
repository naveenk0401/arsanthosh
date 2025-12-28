/**
 * Utility class for standardized API responses.
 * Enforces strict property ordering as requested:
 * success, message, data, error, pagination, filter
 */
class ApiResponse {
    constructor(statusCode, data, message = "Success", pagination = undefined, filter = undefined) {
        this.success = true;
        this.message = message;
        this.data = data;
        this.error = null;
        if (pagination !== undefined) this.pagination = pagination;
        if (filter !== undefined) this.filter = filter;
        this.statusCode = statusCode; // Kept but usually handled by res.status
    }

    static success(res, statusCode, data, message = "Success", pagination = undefined, filter = undefined) {
        const response = new ApiResponse(statusCode, data, message, pagination, filter);
        const { statusCode: status, ...jsonResponse } = response;
        return res.status(status).json(jsonResponse);
    }
}

module.exports = ApiResponse;
