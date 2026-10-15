import express from "express";
import {
  registerUser,
  verifyEmail,
} from "../controllers/authController.js";

const router = express.Router();

// Register
router.post("/register", registerUser);

// Verify Email
router.get("/verify-email/:token", verifyEmail);

export default router;