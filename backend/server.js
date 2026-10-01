import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import googleAuthRoutes from "./routes/googleAuthRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import githubAuthRoutes from "./routes/githubAuthRoutes.js";

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//Routes
app.use("/api/auth", authRoutes);

// Google Auth Routes
app.use("/api/auth", googleAuthRoutes);

// GitHub Auth Routes
app.use("/api/auth", githubAuthRoutes);

// Contact Routes
app.use("/api/contact", contactRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AuthFlow API is running 🚀",
  });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`AuthFlow server running on http://localhost:${PORT}`);
});