/**
 * Verification Middleware
 * Ensures that only verified users can access certain resources.
 * Scalable for future feature-based permissioning.
 */
const verifyUser = (req, res, next) => {
    if (req.user && req.user.isVerified) {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Account not verified." });
    }
};

module.exports = { verifyUser };
