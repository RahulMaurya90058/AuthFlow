import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { createAuth } from "@rahulmaurya956945/authflow";

dotenv.config();

const app = express();

// ======================================================
// AUTHFLOW
// ======================================================

const auth = createAuth({
  jwtSecret: process.env.JWT_SECRET,

  mongoUri: process.env.MONGO_URI,

  googleClientId:
    process.env.GOOGLE_CLIENT_ID,

  githubClientId:
    process.env.GITHUB_CLIENT_ID,

  githubClientSecret:
    process.env.GITHUB_CLIENT_SECRET,

  githubCallbackUrl:
    process.env.GITHUB_CALLBACK_URL,

  frontendUrl:
    process.env.FRONTEND_URL,

  brevoApiKey:
    process.env.BREVO_API_KEY,

  brevoSenderEmail:
    process.env.BREVO_SENDER_EMAIL,

  brevoSenderName:
    process.env.BREVO_SENDER_NAME,

  brevoRecipientEmail:
    process.env.BREVO_SENDER_EMAIL,
});

// ======================================================
// DATABASE
// ======================================================

auth.connectDB();

// ======================================================
// MIDDLEWARES
// ======================================================

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ======================================================
// AUTH ROUTES
// ======================================================

app.use(
  "/api/auth",
  auth.routes.auth
);

app.use(
  "/api/auth",
  auth.routes.google
);

app.use(
  "/api/auth",
  auth.routes.github
);

// ======================================================
// CONTACT ROUTES
// ======================================================

app.use(
  "/api/contact",
  auth.routes.contact
);

// ======================================================
// TEST ROUTE
// ======================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "AuthFlow API is running 🚀",
  });
});

// ======================================================
// SERVER
// ======================================================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `AuthFlow server running on http://localhost:${PORT}`
  );
});