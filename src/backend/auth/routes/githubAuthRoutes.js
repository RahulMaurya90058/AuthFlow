import express from "express";

export const createGithubAuthRoutes = ({
  githubLogin,
  githubCallback,
}) => {
  if (!githubLogin) {
    throw new Error(
      "GitHub login controller is required"
    );
  }

  if (!githubCallback) {
    throw new Error(
      "GitHub callback controller is required"
    );
  }

  const router = express.Router();

  // Start GitHub OAuth
  router.get("/github", githubLogin);

  // GitHub OAuth callback
  router.get(
    "/github/callback",
    githubCallback
  );

  return router;
};