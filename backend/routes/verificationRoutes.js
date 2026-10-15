import express from "express";
import { verifyEmailOTP } from "../controllers/verificationController.js";

const router = express.Router();

router.post("/verify-email", verifyEmailOTP);

export default router;