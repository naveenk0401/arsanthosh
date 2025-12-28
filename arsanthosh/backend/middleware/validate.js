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
    let message = "Validation Error";
    const issues = error.errors || error.issues;
    if (issues && Array.isArray(issues)) {
      message = issues.map((i) => i.message).join(", ");
    } else if (error instanceof Error) {
      message = error.message;
    }
    next(new AppError(message, 400));
  }
};

module.exports = validate;
