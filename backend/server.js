import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import verificationRoutes from "./routes/verificationRoutes.js";
import resendOTPRoutes from "./routes/resendOTPRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
import logoutRoutes from "./routes/logoutRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import forgotPasswordRoutes from "./routes/forgotPasswordRoutes.js";
import verifyResetOTPRoutes from "./routes/verifyResetOTPRoutes.js";
import resetPasswordRoutes from "./routes/resetPasswordRoutes.js";
import googleAuthRoutes from "./routes/googleAuthRoutes.js";
import githubAuthRoutes from "./routes/githubAuthRoutes.js";

dotenv.config();

connectDB();

const app = express();

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Auth Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", loginRoutes);
app.use("/api/auth", logoutRoutes);
app.use("/api/auth", forgotPasswordRoutes);
app.use("/api/auth", verifyResetOTPRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/verification", resendOTPRoutes);
app.use("/api/auth", resetPasswordRoutes);
app.use("/api/auth", googleAuthRoutes);
app.use("/api/user", profileRoutes);
app.use("/api/auth", githubAuthRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AuthFlow Backend is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`AuthFlow Backend running on port ${PORT}`);
});