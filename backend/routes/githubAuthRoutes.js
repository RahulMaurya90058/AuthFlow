import express from "express";

import {
  githubLogin,
  githubCallback,
} from "../controllers/githubAuthController.js";

const router = express.Router();

// Start GitHub OAuth
router.get("/github", githubLogin);

// GitHub OAuth callback
router.get("/github/callback", githubCallback);

export default router;