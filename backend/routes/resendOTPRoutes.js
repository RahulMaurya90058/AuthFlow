import express from "express";
import { resendEmailOTP } from "../controllers/resendOTPController.js";

const router = express.Router();

router.post("/resend-otp", resendEmailOTP);

export default router;