import express from "express";

export const createAuthRoutes = ({
  authController,
  authMiddleware,
}) => {
  if (!authController) {
    throw new Error("Auth controller is required");
  }

  if (!authMiddleware) {
    throw new Error("Auth middleware is required");
  }

  const {
    registerUser,
    verifyEmail,
    resendOTP,
    loginUser,
    getProfile,
    logoutUser,
    forgotPassword,
    verifyResetOTP,
    resendResetOTP,
    resetPassword,
  } = authController;

  const router = express.Router();

  // ======================================================
  // PUBLIC AUTH ROUTES
  // ======================================================

  // Register
  router.post("/register", registerUser);

  // Verify registration email
  router.post("/verify-email", verifyEmail);

  // Resend registration OTP
  router.post("/resend-otp", resendOTP);

  // Login
  router.post("/login", loginUser);

  // ======================================================
  // FORGOT PASSWORD ROUTES
  // ======================================================

  // Request password reset OTP
  router.post(
    "/forgot-password",
    forgotPassword
  );

  // Verify password reset OTP
  router.post(
    "/verify-reset-otp",
    verifyResetOTP
  );

  // Resend password reset OTP
  router.post(
    "/resend-reset-otp",
    resendResetOTP
  );

  // Set new password
  router.post(
    "/reset-password",
    resetPassword
  );

  // ======================================================
  // PROTECTED ROUTES
  // ======================================================

  // Get current user profile
  router.get(
    "/profile",
    authMiddleware,
    getProfile
  );

  // Logout
  router.post(
    "/logout",
    authMiddleware,
    logoutUser
  );

  return router;
};