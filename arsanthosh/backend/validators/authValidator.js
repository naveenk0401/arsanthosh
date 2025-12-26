const { z } = require("zod");

/**
 * Zod schemas for Authentication
 */
const registerSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        role: z.enum(["user", "admin", "super-admin"]).optional(),
    }),
});

const loginSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(1, "Password is required"),
        secretKey: z.string().optional(),
    }),
});

const verifyOTPSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email format"),
        otp: z.string().length(6, "OTP must be 6 digits"),
    }),
});

module.exports = {
    registerSchema,
    loginSchema,
    verifyOTPSchema,
};
