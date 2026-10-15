import express from "express";
import { verifyResetOTP } from "../controllers/verifyResetOTPController.js";

const router = express.Router();

router.post("/verify-reset-otp", verifyResetOTP);

export default router;