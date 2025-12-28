const { z } = require("zod");

const adminLoginSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(1, "Password is required"),
        secretKey: z.string().optional(),
    }),
});

const createAdminSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        phone: z.string().min(10, "Invalid phone number"),
        dob: z.string().optional(),
        idProofType: z.enum(["adhar", "pan", "10th mark sheet"]).optional(),
        idProofNumber: z.string().optional(),
        role: z.enum(["admin", "junior"]).default("admin"),
    }),
});

const onboardingSchema = z.object({
    body: z.object({
        newPassword: z.string().min(6, "Password must be at least 6 characters"),
    }),
});

module.exports = {
    adminLoginSchema,
    createAdminSchema,
    onboardingSchema,
};
