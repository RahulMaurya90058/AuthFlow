import express from "express";

export const createGoogleAuthRoutes = ({
  googleAuth,
}) => {
  if (!googleAuth) {
    throw new Error(
      "Google auth controller is required"
    );
  }

  const router = express.Router();

  router.post("/google", googleAuth);

  return router;
};