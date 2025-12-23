const authService = require("../services/authService");

/**
 * Controller for Auth related endpoints.
 * Communicates with AuthService and handles HTTP responses.
 */
class AuthController {
    async register(req, res) {
        try {
            const result = await authService.register(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);
            res.status(200).json(result);
        } catch (error) {
            const status = error.message.includes("ACCOUNT_NOT_VERIFIED") ? 403 : 401;
            res.status(status).json({ message: error.message });
        }
    }

    async verify(req, res) {
        try {
            const { email, otp } = req.body;
            const result = await authService.verifyOTP(email, otp);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new AuthController();
