/**
 * Utility to catch errors in asynchronous functions and pass them to next().
 * Eliminates the need for repetitive try-catch blocks in controllers.
 */
module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
