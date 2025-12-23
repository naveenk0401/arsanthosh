/**
 * Project: Architect Santhosh
 * 
 * DESIGN PRINCIPLES:
 * 1. Clean Architecture: Controllers handle HTTP, Services handle Business Logic.
 * 2. Security: OTP for all new registrations, obscure admin paths.
 * 3. Scalability: Decoupled services allow for easy switches of providers (Email, DB).
 * 
 * DEVELOPER NOTES (2025 onwards):
 * - Auth flow: Register -> Send OTP -> Verify OTP -> Login.
 * - Admin routes are obscured in frontend (app/studio-management-v92-portal) and backend.
 * - Use 'AuthService' for any functional changes to authentication.
 */
console.log("System Architecture: Initialized and Optimized for 5+ years.");
