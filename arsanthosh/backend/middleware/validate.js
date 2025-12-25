const AppError = require("../utils/AppError");

/**
 * Middleware to validate request data using Zod schema.
 */
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (error) {
        const message = error.errors.map((i) => i.message).join(", ");
        next(new AppError(message, 400));
    }
};

module.exports = validate;
